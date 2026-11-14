import type { Toni } from './client.js';
import { ToniApiError, ToniError } from './errors.js';
import { CATALOG } from './generated/catalog.js';
import type { CatalogArea, CatalogFunction, ChatMessage, ChatModel, ChatTool, JsonSchema, Level, ToolCall, Usage } from './types.js';

/** Ein eigenes Werkzeug, das der Agent neben den Funktionen der Plattform aufrufen darf. */
export interface CustomTool {
  name: string;
  description: string;
  parameters?: JsonSchema;
  execute(args: Record<string, any>): unknown | Promise<unknown>;
}

export interface PendingCall {
  area: string;
  name: string;
  title: string;
  level: Level;
  args: Record<string, unknown>;
}

export interface AgentStep {
  /** `bereich/funktion` oder der Name eines eigenen Werkzeugs */
  tool: string;
  area?: string;
  name: string;
  level?: Level;
  args: Record<string, unknown>;
  result: unknown;
  /** true, wenn der Aufruf abgelehnt wurde oder die API einen Fehler meldete */
  failed: boolean;
  ms: number;
}

export interface AgentOptions {
  /** Standard `toni-mittel`. */
  model?: ChatModel;
  /** Rolle und Ton des Agenten (Systemnachricht). */
  instructions?: string;
  /**
   * Bereiche, deren Funktionen der Agent direkt als Werkzeuge bekommt, z. B. `['crm', 'offers']`.
   * Ohne Angabe sucht er sich die Funktion selbst im ganzen Katalog (zwei Werkzeuge: suchen, aufrufen).
   */
  areas?: string[];
  /**
   * Stufen, die der Agent nutzen darf. Standard `['lesen']`: er liest nur.
   * `loeschen` und `veroeffentlichen` laufen zusätzlich nur mit `onConfirm`.
   */
  allow?: Level[];
  /**
   * Wird vor jedem Aufruf der Stufen `loeschen`/`veroeffentlichen` gefragt. Nur bei `true` läuft er.
   * Das Modell kann die Bestätigung nicht selbst setzen.
   */
  onConfirm?(call: PendingCall): boolean | Promise<boolean>;
  /** Eigene Werkzeuge. */
  tools?: CustomTool[];
  /** Höchstzahl der Runden mit Werkzeugaufrufen. Standard 12. */
  maxSteps?: number;
  temperature?: number;
  /** Wird nach jedem Werkzeugaufruf gerufen (Protokoll, Fortschritt). */
  onStep?(step: AgentStep): void;
  /** Höchstlänge eines Werkzeug-Ergebnisses im Gespräch, in Zeichen. Standard 24000. */
  maxResultChars?: number;
}

export interface RunOptions {
  /** Bisheriges Gespräch (`result.messages` des letzten Laufs), um weiterzusprechen. */
  messages?: ChatMessage[];
  signal?: AbortSignal;
}

export interface AgentResult {
  /** Antwort des Agenten */
  text: string;
  steps: AgentStep[];
  /** Das ganze Gespräch — für die nächste Runde an `run(…, { messages })` geben. */
  messages: ChatMessage[];
  usage: Usage;
  /** `stop` = fertig, `max_steps` = Rundengrenze erreicht */
  finish: 'stop' | 'max_steps';
}

const SUCHEN = 'toni_funktion_suchen';
const AUFRUFEN = 'toni_funktion_aufrufen';
const DIREKT_GRENZE = 64;
const HEIKEL: Level[] = ['loeschen', 'veroeffentlichen'];

const GRUNDSATZ = [
  'Du bist Toni, der digitale Assistent eines Unternehmens. Du arbeitest mit den Funktionen der Plattform und antwortest in der Sprache der Person, kurz und konkret.',
  'Erfinde keine Daten: was du nicht aus einem Werkzeug-Ergebnis weißt, sagst du nicht. Meldet ein Werkzeug einen Fehler, sag in einem Satz, was nicht ging.',
].join('\n');

/** Entfernt die Bestätigung aus dem Schema: sie kommt nie vom Modell. */
function ohneBestaetigung(s: JsonSchema): JsonSchema {
  const { bestaetigt: _weg, ...properties } = s.properties ?? {};
  const required = (s.required ?? []).filter((r) => r !== 'bestaetigt');
  return { type: 'object', properties, ...(required.length ? { required } : {}) };
}

function suche(katalog: CatalogArea[], frage: string, erlaubt: Set<Level>, bereich?: string): Array<{ area: CatalogArea; fn: CatalogFunction; punkte: number }> {
  const worte = frage.toLowerCase().split(/[^a-z0-9äöüß]+/).filter((w) => w.length > 1);
  const treffer: Array<{ area: CatalogArea; fn: CatalogFunction; punkte: number }> = [];
  for (const area of katalog) {
    if (bereich && area.name !== bereich) continue;
    for (const fn of area.functions) {
      if (!erlaubt.has(fn.level)) continue;
      const name = fn.name.toLowerCase();
      const text = `${fn.title} ${area.title} ${area.name}`.toLowerCase();
      let punkte = 0;
      for (const w of worte) {
        if (name.includes(w)) punkte += 3;
        if (text.includes(w)) punkte += 2;
      }
      if (punkte > 0 || (bereich && !worte.length)) treffer.push({ area, fn, punkte });
    }
  }
  return treffer.sort((a, b) => b.punkte - a.punkte).slice(0, 10);
}

export class Agent {
  private readonly erlaubt: Set<Level>;
  private readonly eigene = new Map<string, CustomTool>();
  private readonly direkt = new Map<string, { area: CatalogArea; fn: CatalogFunction }>();
  private readonly tools: ChatTool[] = [];
  private readonly entdecken: boolean;

  constructor(private readonly toni: Toni, private readonly o: AgentOptions = {}) {
    this.erlaubt = new Set(o.allow ?? ['lesen']);
    for (const t of o.tools ?? []) {
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(t.name)) throw new ToniError(`Der Werkzeugname „${t.name}“ ist ungültig (Buchstaben, Ziffern, _ und -, höchstens 64).`);
      this.eigene.set(t.name, t);
      this.tools.push({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters ?? { type: 'object', properties: {} } } });
    }
    this.entdecken = !o.areas?.length;
    if (this.entdecken) {
      this.tools.push(
        { type: 'function', function: {
          name: SUCHEN,
          description: `Sucht Funktionen der Plattform. Bereiche: ${CATALOG.map((a) => `${a.name} (${a.title})`).join(', ')}. Liefert Name, Titel und Parameter der passenden Funktionen.`,
          parameters: { type: 'object', properties: {
            suche: { type: 'string', description: 'Stichworte, z. B. „leads“ oder „buch kapitel“.' },
            bereich: { type: 'string', description: 'Optional: nur in diesem Bereich suchen.', enum: CATALOG.map((a) => a.name) },
          }, required: ['suche'] },
        } },
        { type: 'function', function: {
          name: AUFRUFEN,
          description: `Ruft eine Funktion der Plattform auf. Bereich, Name und Parameter kommen aus ${SUCHEN}.`,
          parameters: { type: 'object', properties: {
            bereich: { type: 'string' },
            funktion: { type: 'string' },
            parameter: { type: 'object', description: 'Parameter der Funktion.' },
          }, required: ['bereich', 'funktion'] },
        } },
      );
    } else {
      for (const name of o.areas!) {
        const area = CATALOG.find((a) => a.name === name);
        if (!area) throw new ToniError(`Den Bereich „${name}“ gibt es nicht. Bereiche: ${CATALOG.map((a) => a.name).join(', ')}.`);
        for (const fn of area.functions) {
          if (!this.erlaubt.has(fn.level)) continue;
          const tool = `${area.name}__${fn.name}`;
          this.direkt.set(tool, { area, fn });
          this.tools.push({ type: 'function', function: { name: tool, description: `${fn.title} (${area.title})`, parameters: ohneBestaetigung(fn.parameters) } });
        }
      }
      if (this.direkt.size > DIREKT_GRENZE) {
        throw new ToniError(`${this.direkt.size} Funktionen sind zu viele für ein Gespräch (höchstens ${DIREKT_GRENZE}). Wähle weniger Bereiche oder lass \`areas\` weg, dann sucht der Agent selbst.`);
      }
    }
  }

  /** Die Werkzeuge, die das Modell in diesem Agenten sieht. */
  get toolNames(): string[] {
    return this.tools.map((t) => t.function.name);
  }

  async run(input: string, options: RunOptions = {}): Promise<AgentResult> {
    const messages: ChatMessage[] = options.messages?.length
      ? [...options.messages]
      : [{ role: 'system', content: this.o.instructions ? `${GRUNDSATZ}\n\n${this.o.instructions}` : GRUNDSATZ }];
    messages.push({ role: 'user', content: input });
    const steps: AgentStep[] = [];
    const usage: Usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const grenze = this.o.maxSteps ?? 12;

    for (let runde = 0; ; runde++) {
      const letzte = runde >= grenze;
      const r = await this.toni.chat.completions.create({
        model: this.o.model ?? 'toni-mittel',
        messages,
        ...(this.tools.length && !letzte ? { tools: this.tools } : {}),
        ...(this.o.temperature !== undefined ? { temperature: this.o.temperature } : {}),
      }, { signal: options.signal });
      if (r.usage) {
        usage.prompt_tokens += r.usage.prompt_tokens ?? 0;
        usage.completion_tokens += r.usage.completion_tokens ?? 0;
        usage.total_tokens += r.usage.total_tokens ?? 0;
      }
      const m = r.choices[0]?.message;
      if (!m) throw new ToniError('Die Toni API hat keine Antwort geliefert.');
      const calls = letzte ? [] : (m.tool_calls ?? []);
      messages.push({ role: 'assistant', content: m.content ?? null, ...(calls.length ? { tool_calls: calls } : {}) });
      if (!calls.length) return { text: m.content ?? '', steps, messages, usage, finish: letzte ? 'max_steps' : 'stop' };

      for (const call of calls) {
        const step = await this.ausfuehren(call, options.signal);
        if (step) {
          steps.push(step);
          this.o.onStep?.(step);
        }
        const ergebnis = step ? step.result : this.letztesErgebnis;
        let text = typeof ergebnis === 'string' ? ergebnis : JSON.stringify(ergebnis ?? null);
        const max = this.o.maxResultChars ?? 24_000;
        if (text.length > max) text = text.slice(0, max) + `\n… (gekürzt, ${text.length} Zeichen insgesamt. Grenze die Abfrage ein, z. B. mit limit.)`;
        messages.push({ role: 'tool', tool_call_id: call.id, content: text });
      }
    }
  }

  private letztesErgebnis: unknown = null;

  /** Führt einen Werkzeugaufruf aus. Suchen im Katalog ist kein Schritt und liefert null. */
  private async ausfuehren(call: ToolCall, signal?: AbortSignal): Promise<AgentStep | null> {
    const start = Date.now();
    let args: Record<string, any> = {};
    try {
      args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
    } catch {
      this.letztesErgebnis = { error: 'Die Parameter waren kein gültiges JSON.' };
      return null;
    }
    const tool = call.function.name;

    const eigenes = this.eigene.get(tool);
    if (eigenes) {
      try {
        return { tool, name: tool, args, result: await eigenes.execute(args), failed: false, ms: Date.now() - start };
      } catch (e) {
        return { tool, name: tool, args, result: { error: e instanceof Error ? e.message : String(e) }, failed: true, ms: Date.now() - start };
      }
    }

    if (this.entdecken && tool === SUCHEN) {
      const treffer = suche(CATALOG, String(args.suche ?? ''), this.erlaubt, typeof args.bereich === 'string' ? args.bereich : undefined);
      this.letztesErgebnis = treffer.length
        ? treffer.map(({ area, fn }) => ({ bereich: area.name, funktion: fn.name, titel: fn.title, stufe: fn.level, parameter: ohneBestaetigung(fn.parameters) }))
        : { hinweis: 'Keine passende Funktion gefunden, die dieser Agent nutzen darf. Versuch andere Stichworte oder einen Bereich.' };
      return null;
    }

    let ziel: { area: CatalogArea; fn: CatalogFunction } | undefined;
    let parameter: Record<string, unknown> = args;
    if (this.entdecken && tool === AUFRUFEN) {
      const area = CATALOG.find((a) => a.name === args.bereich);
      const fn = area?.functions.find((f) => f.name === args.funktion);
      if (area && fn) ziel = { area, fn };
      parameter = args.parameter && typeof args.parameter === 'object' ? args.parameter : {};
    } else {
      ziel = this.direkt.get(tool);
    }
    if (!ziel) {
      this.letztesErgebnis = { error: `Die Funktion „${args.bereich ?? ''}/${args.funktion ?? tool}“ gibt es nicht.` };
      return null;
    }

    const { area, fn } = ziel;
    const { bestaetigt: _nie, ...sauber } = parameter as Record<string, unknown>;
    const basis = { tool: `${area.name}/${fn.name}`, area: area.name, name: fn.name, level: fn.level, args: sauber };
    const abgelehnt = (satz: string): AgentStep => ({ ...basis, result: { error: satz }, failed: true, ms: Date.now() - start });

    if (!this.erlaubt.has(fn.level)) return abgelehnt(`Dieser Agent darf keine Funktionen der Stufe „${fn.level}“ nutzen.`);
    let confirmed = false;
    if (HEIKEL.includes(fn.level)) {
      if (!this.o.onConfirm) return abgelehnt('Diese Aktion ist unumkehrbar oder wirkt nach außen und braucht die Bestätigung eines Menschen. Die ist hier nicht eingerichtet.');
      confirmed = (await this.o.onConfirm({ area: area.name, name: fn.name, title: fn.title, level: fn.level, args: sauber })) === true;
      if (!confirmed) return abgelehnt('Die Person hat diese Aktion nicht bestätigt.');
    }
    try {
      const result = await this.toni.platform.call(area.name, fn.name, sauber, { confirmed, signal });
      return { ...basis, result, failed: result?.success === false, ms: Date.now() - start };
    } catch (e) {
      if (e instanceof ToniApiError) return { ...basis, result: { error: e.message, code: e.code }, failed: true, ms: Date.now() - start };
      throw e;
    }
  }
}
