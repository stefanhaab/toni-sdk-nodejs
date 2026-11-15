#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr, argv, exit, env } from 'node:process';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { Toni } from './client.js';
import { AuthenticationError, ToniError } from './errors.js';
import { CATALOG } from './generated/catalog.js';
import { VERSION } from './http.js';
import type { ChatMessage, Level } from './types.js';

const HILFE = `toni ${VERSION} — Toni im Terminal (https://ki-markt.com)

  toni "Wer hat sich diese Woche gemeldet?"     eine Aufgabe, eine Antwort
  toni                                           Gespräch (beenden mit Strg+D)
  toni funktionen [suche]                        Funktionen der Plattform auflisten
  toni preise                                    Größen und Preise
  toni login                                     Schlüssel einmal speichern
  toni logout                                    gespeicherten Schlüssel löschen
  toni verbinden hermes|openclaw                 Toni in Hermes Agent oder OpenClaw einbinden

Optionen:
  --bereiche crm,offers   nur diese Bereiche (sonst sucht Toni selbst im Katalog)
  --modell toni-schwer    Größe: toni-leicht, toni-mittel (Standard), toni-schwer
  --schreiben             Toni darf auch anlegen und ändern (Standard: nur lesen)
  --alles                 zusätzlich löschen und veröffentlichen, jeweils mit Rückfrage
  --leise                 Werkzeugaufrufe nicht anzeigen

Schlüssel: \`toni login\` oder Umgebungsvariable TONI_API_KEY (km_live_…), aus dem Konto unter „API“.`;

const MCP_ADRESSE = 'https://app.landingpage.tools/mcp';
const VERBINDEN: Record<string, string> = {
  hermes: `# ~/.hermes/config.yaml
mcp_servers:
  toni:
    url: "${MCP_ADRESSE}"
    headers:
      Authorization: "Bearer lpt_…"`,
  openclaw: `// Block mcp.servers deiner OpenClaw-Konfiguration, prüfen mit: openclaw mcp probe
{
  "mcp": {
    "servers": {
      "toni": {
        "url": "${MCP_ADRESSE}",
        "transport": "streamable-http",
        "headers": { "Authorization": "Bearer lpt_…" }
      }
    }
  }
}`,
};
const VERBINDEN_HINWEIS = `
Den Verbindungs-Schlüssel (lpt_…) erzeugst du im Download-Bereich deines Kontos
unter „KI-Assistent verbinden“. Er ist ein anderer als der API-Schlüssel (km_live_…).`;

/** Ablage des Schlüssels: $XDG_CONFIG_HOME/toni/config.json, sonst ~/.config/toni/config.json. */
export const ablage = (): string => join(env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'toni', 'config.json');

export function gespeicherterSchluessel(): string | undefined {
  try {
    const k = JSON.parse(readFileSync(ablage(), 'utf8')).api_key;
    return typeof k === 'string' && k ? k : undefined;
  } catch { return undefined; }
}

async function login(vorgabe?: string): Promise<void> {
  let key = vorgabe?.trim();
  if (!key) {
    if (stdin.isTTY) {
      const rl = createInterface({ input: stdin, output: stdout });
      key = (await rl.question('API-Schlüssel (km_live_…, aus dem Konto unter „API“): ')).trim();
      rl.close();
    } else {
      let text = '';
      for await (const stueck of stdin) text += stueck;
      key = text.trim();
    }
  }
  if (!key) throw new ToniError('Kein Schlüssel eingegeben.');
  try {
    await new Toni({ apiKey: key }).models.list();
  } catch (e) {
    if (e instanceof AuthenticationError) throw new ToniError('Dieser Schlüssel wird nicht angenommen. Gespeichert wurde nichts.');
    stderr.write('Der Schlüssel ließ sich gerade nicht prüfen. Er wird trotzdem gespeichert.\n');
  }
  const datei = ablage();
  mkdirSync(dirname(datei), { recursive: true, mode: 0o700 });
  writeFileSync(datei, JSON.stringify({ api_key: key }, null, 2) + '\n', { mode: 0o600 });
  chmodSync(datei, 0o600);
  console.log(`Gespeichert in ${datei}. Probier: toni "Wer hat sich diese Woche gemeldet?"`);
}

const args = argv.slice(2);
const schalter = (n: string): boolean => { const i = args.indexOf(n); if (i < 0) return false; args.splice(i, 1); return true; };
const wert = (n: string): string | undefined => { const i = args.indexOf(n); if (i < 0) return undefined; const [, w] = args.splice(i, 2); return w; };

async function main(): Promise<void> {
  if (schalter('--help') || schalter('-h')) return void console.log(HILFE);
  if (schalter('--version') || schalter('-v')) return void console.log(VERSION);
  const bereiche = wert('--bereiche')?.split(',').map((s) => s.trim()).filter(Boolean);
  const modell = wert('--modell');
  const alles = schalter('--alles');
  const schreiben = schalter('--schreiben') || alles;
  const leise = schalter('--leise');

  if (args[0] === 'funktionen') {
    const frage = args.slice(1).join(' ').toLowerCase();
    for (const a of CATALOG) {
      const f = a.functions.filter((x) => !frage || `${a.name} ${a.title} ${x.name} ${x.title}`.toLowerCase().includes(frage));
      if (!f.length) continue;
      console.log(`\n${a.title} (${a.name})`);
      for (const x of f) console.log(`  ${x.name.padEnd(38)} ${x.level.padEnd(17)} ${x.title}`);
    }
    return;
  }

  if (args[0] === 'login') return login(args[1]);
  if (args[0] === 'logout') {
    const da = existsSync(ablage());
    rmSync(ablage(), { force: true });
    return void console.log(da ? 'Der gespeicherte Schlüssel ist gelöscht.' : 'Es war kein Schlüssel gespeichert.');
  }
  if (args[0] === 'verbinden') {
    const text = VERBINDEN[(args[1] ?? '').toLowerCase()];
    if (!text) return void console.log(`${VERBINDEN.hermes}\n\n${VERBINDEN.openclaw}\n${VERBINDEN_HINWEIS}`);
    return void console.log(`${text}\n${VERBINDEN_HINWEIS}`);
  }

  const toni = new Toni({ apiKey: env.TONI_API_KEY || env.KM_KEY || gespeicherterSchluessel() });
  if (args[0] === 'preise') {
    for (const m of (await toni.prices()).data) console.log(`${m.id.padEnd(22)} ${String(m.name).padEnd(16)} ${JSON.stringify(m.preis)}`);
    return;
  }

  const rl = stdin.isTTY ? createInterface({ input: stdin, output: stdout }) : null;
  const allow: Level[] = alles ? ['lesen', 'schreiben', 'veroeffentlichen', 'loeschen'] : schreiben ? ['lesen', 'schreiben'] : ['lesen'];
  const agent = toni.agent({
    areas: bereiche,
    model: modell,
    allow,
    onStep: leise ? undefined : (s) => stderr.write(`  ${s.failed ? '✗' : '→'} ${s.tool} ${JSON.stringify(s.args)} (${s.ms} ms)\n`),
    onConfirm: rl
      ? async (c) => /^j/i.test(await rl.question(`\n${c.title} (${c.area}/${c.name}) ${JSON.stringify(c.args)}\nWirklich ausführen? [j/N] `))
      : undefined,
  });

  const frage = args.join(' ').trim();
  if (frage) {
    console.log((await agent.run(frage)).text);
    rl?.close();
    return;
  }
  if (!rl) {
    let text = '';
    for await (const stueck of stdin) text += stueck;
    if (!text.trim()) return void console.log(HILFE);
    return void console.log((await agent.run(text.trim())).text);
  }
  console.log(`Toni ${VERSION} · ${allow.join(', ')} · Strg+D beendet`);
  let messages: ChatMessage[] | undefined;
  for (;;) {
    let eingabe: string;
    try { eingabe = (await rl.question('\n› ')).trim(); } catch { break; }
    if (!eingabe) continue;
    if (eingabe === 'exit' || eingabe === 'ende') break;
    try {
      const r = await agent.run(eingabe, { messages });
      messages = r.messages;
      console.log(`\n${r.text}`);
    } catch (e) {
      if (!(e instanceof ToniError)) throw e;
      console.error(`\n${e.message}`);
    }
  }
  rl.close();
}

main().catch((e) => {
  console.error(e instanceof ToniError ? e.message : e);
  exit(1);
});
