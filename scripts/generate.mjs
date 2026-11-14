#!/usr/bin/env node
// Erzeugt src/generated/* aus der OpenAPI-Datei der Toni API.
//   node scripts/generate.mjs                 (lädt https://ki-markt.com/v1/platform/openapi.json)
//   node scripts/generate.mjs pfad/openapi.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUELLE = process.argv[2] || process.env.TONI_OPENAPI || 'https://ki-markt.com/v1/platform/openapi.json';
const ZIEL = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'generated');

const doc = /^https?:/.test(QUELLE)
  ? await (await fetch(QUELLE)).json()
  : JSON.parse(await readFile(QUELLE, 'utf8'));

const camel = (s) => s.replace(/_+([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => { const c = camel(s); return c[0].toUpperCase() + c.slice(1); };
const kurz = (s, n) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
};
const doku = (s) => String(s || '').replace(/\*\//g, '*\\/').replace(/\s+/g, ' ').trim();
const ersterSatz = (s) => {
  const t = String(s || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
};

/** JSON-Schema-Eigenschaft → TypeScript-Typ */
function tsTyp(p) {
  if (!p || typeof p !== 'object') return 'unknown';
  if (Array.isArray(p.enum) && p.enum.length) return p.enum.map((e) => JSON.stringify(e)).join(' | ');
  const t = Array.isArray(p.type) ? p.type.filter((x) => x !== 'null')[0] : p.type;
  switch (t) {
    case 'string': return 'string';
    case 'integer':
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return `Array<${tsTyp(p.items)}>`;
    case 'object': return 'Record<string, unknown>';
    default: return 'unknown';
  }
}

/** Schema für den Katalog: nur was ein Sprachmodell für den Aufruf braucht. */
function schlank(p) {
  const o = {};
  const t = Array.isArray(p?.type) ? p.type.filter((x) => x !== 'null')[0] : p?.type;
  if (t) o.type = t;
  if (p?.description) o.description = kurz(p.description, 180);
  if (Array.isArray(p?.enum)) o.enum = p.enum;
  if (t === 'array') o.items = p.items && typeof p.items === 'object' ? schlank(p.items) : {};
  return o;
}

const tagText = Object.fromEntries((doc.tags || []).map((t) => [t.name, t.description || '']));
const bereiche = new Map();
for (const [pfad, eintrag] of Object.entries(doc.paths)) {
  const m = pfad.match(/^\/platform\/([a-z_]+)\/([a-z0-9_]+)$/);
  if (!m || !eintrag.post) continue;
  const [, bereich, name] = m;
  const op = eintrag.post;
  const schema = op.requestBody?.content?.['application/json']?.schema || {};
  const tag = (op.tags || [])[0] || bereich;
  if (!bereiche.has(bereich)) bereiche.set(bereich, { name: bereich, title: tag, description: ersterSatz(tagText[tag]), functions: [] });
  bereiche.get(bereich).functions.push({
    name,
    title: op.summary || name,
    level: op['x-stufe'] || 'lesen',
    properties: schema.properties || {},
    required: schema.required || [],
  });
}
if (!bereiche.size) throw new Error('Keine Plattform-Funktionen in der OpenAPI-Datei gefunden.');

// ---------------------------------------------------------------- catalog.ts
const katalog = [...bereiche.values()].map((b) => ({
  name: b.name,
  title: b.title,
  description: b.description,
  functions: b.functions.map((f) => ({
    name: f.name,
    title: f.title,
    level: f.level,
    parameters: {
      type: 'object',
      properties: Object.fromEntries(Object.entries(f.properties).map(([k, v]) => [k, schlank(v)])),
      ...(f.required.length ? { required: f.required } : {}),
    },
  })),
}));
const anzahl = katalog.reduce((n, b) => n + b.functions.length, 0);
const kopf = `// ERZEUGT von scripts/generate.mjs aus der OpenAPI-Datei (${doc.info?.title} ${doc.info?.version}). Nicht von Hand ändern.\n`;

let cat = kopf + `import type { CatalogArea } from '../types.js';\n\n`;
cat += `/** Stand der API, aus dem dieses Paket erzeugt wurde. */\nexport const API_VERSION = ${JSON.stringify(doc.info?.version || '')};\n\n`;
cat += `/** ${katalog.length} Bereiche, ${anzahl} Funktionen. */\nexport const CATALOG: CatalogArea[] = ${JSON.stringify(katalog, null, 1)};\n`;

// ---------------------------------------------------------------- areas.ts
let ts = kopf + `import type { CallOptions, FunctionResult, PlatformCaller } from '../types.js';\n`;
const felder = [];
for (const b of bereiche.values()) {
  const Klasse = pascal(b.name) + 'Area';
  let rumpf = '';
  for (const f of b.functions) {
    const P = pascal(b.name) + pascal(f.name) + 'Params';
    const eig = Object.entries(f.properties);
    const pflicht = eig.some(([k]) => f.required.includes(k));
    ts += `\nexport interface ${P} {\n`;
    for (const [k, v] of eig) {
      if (v?.description) ts += `  /** ${doku(v.description)} */\n`;
      const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      ts += `  ${key}${f.required.includes(k) ? '' : '?'}: ${tsTyp(v)};\n`;
    }
    ts += `  [weiteres: string]: unknown;\n}\n`;
    rumpf += `  /**\n   * ${doku(f.title)}\n   *\n   * Recht am Schlüssel: \`${f.level}\` · \`POST /platform/${b.name}/${f.name}\`\n   */\n`;
    rumpf += `  ${camel(f.name)}(params${pflicht ? '' : '?'}: ${P}, options?: CallOptions): Promise<FunctionResult> {\n`;
    rumpf += `    return this.platform.call('${b.name}', '${f.name}', params, options);\n  }\n\n`;
  }
  ts += `\n/** ${doku(b.title)}${b.description ? ' — ' + doku(b.description) : ''} */\nexport class ${Klasse} {\n  constructor(private readonly platform: PlatformCaller) {}\n\n${rumpf.trimEnd()}\n}\n`;
  felder.push([camel(b.name), Klasse, b.title]);
}
ts += `\n/** Alle Bereiche der Plattform als Eigenschaften des Clients. */\nexport interface Areas {\n`;
for (const [feld, Klasse, titel] of felder) ts += `  /** ${doku(titel)} */\n  readonly ${feld}: ${Klasse};\n`;
ts += `}\n\nexport function createAreas(platform: PlatformCaller): Areas {\n  return {\n`;
for (const [feld, Klasse] of felder) ts += `    ${feld}: new ${Klasse}(platform),\n`;
ts += `  };\n}\n`;

await mkdir(ZIEL, { recursive: true });
await writeFile(join(ZIEL, 'catalog.ts'), cat);
await writeFile(join(ZIEL, 'areas.ts'), ts);
console.log(`${katalog.length} Bereiche, ${anzahl} Funktionen → src/generated/`);
