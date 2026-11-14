import { ToniError } from './errors.js';
import type { JsonSchema } from './types.js';

export interface RealtimeOptions {
  /** Rolle und Ton für das Gespräch. */
  instructions?: string;
  /** Stimme, z. B. `marin` (Standard). */
  voice?: string;
  /** Audioformat beider Richtungen. Standard `audio/pcm` mit 24000 Hz; fürs Telefon `audio/pcmu` mit 8000 Hz. */
  format?: { type?: 'audio/pcm' | 'audio/pcmu' | 'audio/pcma'; rate?: 8000 | 16000 | 24000 | 48000 };
  /**
   * Werkzeuge, die Toni im Hintergrund aufrufen darf, während er spricht (höchstens 32).
   * Der Aufruf kommt als Ereignis; das Ergebnis schickst du mit `toolOutput`.
   */
  tools?: Array<{ name: string; description?: string; parameters?: JsonSchema }>;
  /** Anweisung für die Werkzeug-Runde im Hintergrund. */
  toolInstructions?: string;
  /** Eigene WebSocket-Klasse, z. B. aus dem Paket `ws` (nötig vor Node.js 22). */
  WebSocket?: any;
  /** Zeitgrenze für den Verbindungsaufbau in Millisekunden. Standard 15000. */
  timeout?: number;
}

/** Ein Ereignis des Gesprächs, so wie es der Server sendet (`type` und weitere Felder). */
export interface RealtimeEvent {
  type: string;
  [weiteres: string]: any;
}

type Hoerer = (ereignis: any) => void;

/**
 * Ein laufendes Sprachgespräch. Abgerechnet wird im Takt von zehn Sekunden; bei leerem Guthaben endet die Sitzung.
 * Toni spricht nur, solange Audio hereinkommt: in Pausen Stille senden.
 */
export class RealtimeSession implements AsyncIterable<RealtimeEvent> {
  private readonly hoerer = new Map<string, Set<Hoerer>>();
  private readonly puffer: RealtimeEvent[] = [];
  private wartend: ((r: IteratorResult<RealtimeEvent>) => void) | null = null;
  private zu = false;

  /** @internal */
  constructor(private readonly ws: any) {
    ws.addEventListener('message', (m: any) => {
      let e: RealtimeEvent;
      try { e = JSON.parse(typeof m.data === 'string' ? m.data : String(m.data)); } catch { return; }
      this.melden('event', e);
      if (e.type === 'error') this.melden('error', e.error ?? e);
      if (this.wartend) { const w = this.wartend; this.wartend = null; w({ value: e, done: false }); } else this.puffer.push(e);
    });
    ws.addEventListener('close', () => {
      this.zu = true;
      this.melden('close', undefined);
      if (this.wartend) { const w = this.wartend; this.wartend = null; w({ value: undefined, done: true }); }
    });
  }

  /** `event`: jedes Ereignis · `error`: Fehlermeldung des Servers · `close`: Gespräch beendet */
  on(art: 'event' | 'error' | 'close', fn: Hoerer): this {
    if (!this.hoerer.has(art)) this.hoerer.set(art, new Set());
    this.hoerer.get(art)!.add(fn);
    return this;
  }

  off(art: 'event' | 'error' | 'close', fn: Hoerer): this {
    this.hoerer.get(art)?.delete(fn);
    return this;
  }

  private melden(art: string, wert: unknown): void {
    for (const fn of this.hoerer.get(art) ?? []) fn(wert);
  }

  private senden(nachricht: Record<string, unknown>): void {
    if (this.zu) throw new ToniError('Das Gespräch ist beendet.');
    this.ws.send(JSON.stringify(nachricht));
  }

  /** Audio des Menschen, im Format der Sitzung. Bytes oder schon Base64. Höchstens ~70 KB je Stück. */
  sendAudio(audio: Uint8Array | ArrayBuffer | string): void {
    const b64 = typeof audio === 'string' ? audio : Buffer.from(audio instanceof ArrayBuffer ? new Uint8Array(audio) : audio).toString('base64');
    this.senden({ type: 'session.input_audio.append', audio: b64 });
  }

  /** Zusätzliche Anweisung mitten im Gespräch (höchstens 4000 Zeichen). */
  instruct(text: string): void {
    this.senden({ type: 'session.instructions.append', content: text });
  }

  /** Ergebnis eines Werkzeugaufrufs zurückgeben. */
  toolOutput(callId: string, output: unknown): void {
    this.senden({ type: 'response.item.create', item: { type: 'function_call_output', call_id: callId, output: typeof output === 'string' ? output : JSON.stringify(output) } });
  }

  /** Toni zum Antworten auffordern. */
  respond(): void {
    this.senden({ type: 'response.create' });
  }

  close(): void {
    if (this.zu) return;
    try { this.ws.send(JSON.stringify({ type: 'session.close' })); } catch { /* schon zu */ }
    this.ws.close();
  }

  get closed(): boolean {
    return this.zu;
  }

  [Symbol.asyncIterator](): AsyncIterator<RealtimeEvent> {
    return {
      next: () => {
        if (this.puffer.length) return Promise.resolve({ value: this.puffer.shift()!, done: false });
        if (this.zu) return Promise.resolve({ value: undefined, done: true });
        return new Promise((r) => { this.wartend = r; });
      },
      return: () => { this.close(); return Promise.resolve({ value: undefined, done: true }); },
    };
  }
}

/** Echtzeit-Sprache: `wss://…/v1/realtime`. */
export class Realtime {
  /** @internal */
  constructor(private readonly baseUrl: string, private readonly key: () => string) {}

  /** Die Adresse des Sprachkanals. */
  get url(): string {
    return this.baseUrl.replace(/^http/, 'ws') + '/realtime?model=toni-sprache';
  }

  /** Baut die Verbindung auf und startet die Sitzung. */
  connect(options: RealtimeOptions = {}): Promise<RealtimeSession> {
    const WS = options.WebSocket ?? (globalThis as any).WebSocket;
    if (typeof WS !== 'function') {
      throw new ToniError('WebSocket fehlt. Nutze Node.js 22 oder neuer, oder übergib die Klasse aus dem Paket `ws` als Option `WebSocket`.');
    }
    // Der Schlüssel reist als Unterprotokoll: das geht mit jeder WebSocket-Klasse, auch im Browser.
    const ws = new WS(this.url, ['realtime', `km-key.${this.key()}`]);
    const start: Record<string, any> = {
      instructions: options.instructions ?? '',
      audio: { format: { type: options.format?.type ?? 'audio/pcm', rate: options.format?.rate ?? 24000 }, output: { voice: options.voice ?? 'marin' } },
    };
    if (options.tools?.length) {
      start.delegation = { type: 'responses', responses: {
        instructions: options.toolInstructions ?? '',
        tools: options.tools.map((t) => ({ type: 'function', name: t.name, description: t.description ?? '', parameters: t.parameters ?? { type: 'object', properties: {} } })),
      } };
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { try { ws.close(); } catch { /* egal */ } reject(new ToniError('Der Sprachkanal hat nicht rechtzeitig geantwortet.')); }, options.timeout ?? 15_000);
      const fehler = (): void => { clearTimeout(timer); reject(new ToniError('Der Sprachkanal ist nicht erreichbar.')); };
      ws.addEventListener('error', fehler);
      ws.addEventListener('open', () => {
        clearTimeout(timer);
        ws.removeEventListener('error', fehler);
        const sitzung = new RealtimeSession(ws);
        ws.send(JSON.stringify({ type: 'session.start', session: start }));
        resolve(sitzung);
      });
    });
  }
}
