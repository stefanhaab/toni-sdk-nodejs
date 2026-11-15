import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { Toni, CATALOG, ToniError, PermissionError, RateLimitError, ConfirmationRequiredError, ToniConnectionError } from '../dist/index.js';

/** Ein kleiner Nachbau der API: merkt sich jede Anfrage und antwortet aus einer Warteschlange oder nach festen Regeln. */
let server; let basis; const anfragen = []; let antworten = [];
const chatAntwort = (message) => ({ id: 'chatcmpl-1', object: 'chat.completion', created: 1, model: 'toni-mittel', choices: [{ index: 0, message: { role: 'assistant', ...message }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } });
const aufruf = (id, name, args) => ({ id, type: 'function', function: { name, arguments: JSON.stringify(args) } });

before(async () => {
  server = createServer(async (req, res) => {
    const teile = []; for await (const t of req) teile.push(t);
    const roh = Buffer.concat(teile);
    const typ = req.headers['content-type'] || '';
    const eintrag = { method: req.method, url: req.url, headers: req.headers, body: typ.includes('json') ? JSON.parse(roh.toString() || 'null') : roh.toString('latin1') };
    anfragen.push(eintrag);
    const json = (status, o, kopf = {}) => { res.writeHead(status, { 'content-type': 'application/json', ...kopf }); res.end(JSON.stringify(o)); };
    if (antworten.length) { const a = antworten.shift(); return json(a.status ?? 200, a.body, a.headers); }
    if (req.url === '/v1/preise') return json(200, { object: 'list', data: [{ id: 'toni-leicht', name: 'Leicht', preis: {} }] });
    if (req.url === '/v1/chat/completions' && eintrag.body.stream) {
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      for (const s of ['Hal', 'lo']) res.write(`data: ${JSON.stringify({ id: 'c', object: 'chat.completion.chunk', choices: [{ index: 0, delta: { content: s }, finish_reason: null }] })}\n\n`);
      return res.end('data: [DONE]\n\n');
    }
    if (req.url === '/v1/chat/completions') return json(200, chatAntwort({ content: 'Hallo.' }));
    if (req.url === '/v1/audio/transcriptions') return json(200, { text: 'gesprochen' });
    if (req.url === '/v1/videos/vid_1/content') { res.writeHead(200, { 'content-type': 'video/mp4' }); return res.end(Buffer.from([1, 2, 3])); }
    const m = req.url.match(/^\/v1\/platform\/([a-z_]+)\/([a-z0-9_]+)$/);
    if (m) {
      if (m[2].startsWith('delete') && eintrag.body?.bestaetigt !== true) return json(409, { error: { message: 'Bestätigung fehlt.', type: 'invalid_request_error', param: null, code: 'bestaetigung_fehlt' } });
      return json(200, { object: 'platform.result', bereich: m[1], werkzeug: m[2], stufe: 'lesen', data: { success: true, data: { items: [{ id: 4711, firstname: 'Mira' }] } } });
    }
    json(404, { error: { message: 'Gibt es nicht.', type: 'invalid_request_error', param: null, code: 'not_found' } });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  basis = `http://127.0.0.1:${server.address().port}/v1`;
});
after(() => server.close());
const neu = (o = {}) => { anfragen.length = 0; antworten = []; return new Toni({ apiKey: 'km_live_test', baseUrl: basis, ...o }); };

test('Katalog: jede Funktion ist eine Methode, Namen passen in ein Werkzeug', () => {
  const toni = neu();
  let n = 0;
  for (const a of CATALOG) {
    const feld = a.name.replace(/_+([a-z0-9])/g, (_, c) => c.toUpperCase());
    assert.ok(toni[feld], `Bereich ${a.name} fehlt am Client`);
    for (const f of a.functions) {
      n++;
      const methode = f.name.replace(/_+([a-z0-9])/g, (_, c) => c.toUpperCase());
      assert.equal(typeof toni[feld][methode], 'function', `${a.name}.${methode}`);
      assert.ok(`${a.name}__${f.name}`.length <= 64, `${a.name}__${f.name} ist zu lang`);
      assert.ok(['lesen', 'schreiben', 'veroeffentlichen', 'loeschen'].includes(f.level));
    }
  }
  assert.ok(n >= 260, `${n} Funktionen`);
  for (const fest of ['realtime', 'chat', 'platform', 'embeddings', 'audio', 'images', 'videos', 'models', 'agent', 'ask', 'prices']) {
    assert.ok(!CATALOG.some((a) => a.name === fest), `Bereich ${fest} überschreibt den Client`);
  }
});

test('Plattform-Funktion: Pfad, Schlüssel, Rückgabe ohne Hülle', async () => {
  const toni = neu();
  const r = await toni.crm.getLeads({ status: 'new', limit: 5 });
  assert.equal(r.success, true);
  assert.equal(r.data.items[0].id, 4711);
  assert.equal(anfragen[0].url, '/v1/platform/crm/get_leads');
  assert.equal(anfragen[0].method, 'POST');
  assert.equal(anfragen[0].headers.authorization, 'Bearer km_live_test');
  assert.match(anfragen[0].headers['user-agent'], /^toni-sdk-node\//);
  assert.deepEqual(anfragen[0].body, { status: 'new', limit: 5 });
  assert.equal((await toni.platform.raw('crm', 'get_leads')).object, 'platform.result');
});

test('Löschen: ohne Bestätigung 409, mit confirmed geht bestaetigt mit', async () => {
  const toni = neu();
  await assert.rejects(toni.books.deleteBook({ book_id: 1, bestaetigt: false }), (e) => e instanceof ConfirmationRequiredError && e.code === 'bestaetigung_fehlt' && e.status === 409);
  await toni.platform.call('books', 'delete_book', { book_id: 1 }, { confirmed: true });
  assert.deepEqual(anfragen.at(-1).body, { book_id: 1, bestaetigt: true });
});

test('Fehler: Klassen, Wiederholung bei 429, keine Wiederholung bei Plattform-Aufrufen', async () => {
  const toni = neu({ maxRetries: 1 });
  antworten = [{ status: 403, body: { error: { message: 'Kein Recht.', type: 'permission_error', param: null, code: 'recht_fehlt' } } }];
  await assert.rejects(toni.models.list(), (e) => e instanceof PermissionError && e.message === 'Kein Recht.' && e.type === 'permission_error');
  antworten = [{ status: 429, body: { error: { message: 'Zu viel.' } }, headers: { 'retry-after': '0' } }, { status: 200, body: { object: 'list', data: [] } }];
  assert.deepEqual((await toni.models.list()).data, []);
  anfragen.length = 0;
  antworten = [{ status: 429, body: { error: { message: 'Zu viel.' } } }];
  await assert.rejects(toni.crm.createLead({ data: { email: 'a@example.com' } }), RateLimitError);
  assert.equal(anfragen.length, 1, 'ein schreibender Aufruf wird nicht wiederholt');
});

test('Ohne Schlüssel: klarer Satz, öffentliche Endpunkte gehen trotzdem', async () => {
  const alt = [process.env.TONI_API_KEY, process.env.KM_KEY];
  delete process.env.TONI_API_KEY; delete process.env.KM_KEY;
  try {
    const toni = new Toni({ baseUrl: basis });
    await assert.rejects(toni.models.list(), (e) => e instanceof ToniError && /TONI_API_KEY/.test(e.message));
    anfragen.length = 0;
    assert.equal((await toni.prices()).data[0].id, 'toni-leicht');
    assert.equal(anfragen[0].headers.authorization, undefined);
  } finally {
    if (alt[0] !== undefined) process.env.TONI_API_KEY = alt[0];
    if (alt[1] !== undefined) process.env.KM_KEY = alt[1];
  }
});

test('Nicht erreichbar: ToniConnectionError', async () => {
  const toni = new Toni({ apiKey: 'k', baseUrl: 'http://127.0.0.1:1/v1', maxRetries: 0 });
  await assert.rejects(toni.models.list(), ToniConnectionError);
});

test('Chat: ask, Strom, Transkription, Video-Datei', async () => {
  const toni = neu();
  assert.equal(await toni.ask('Hi', { system: 'Kurz.' }), 'Hallo.');
  assert.deepEqual(anfragen[0].body, { model: 'toni-mittel', messages: [{ role: 'system', content: 'Kurz.' }, { role: 'user', content: 'Hi' }] });
  let text = '';
  for await (const s of await toni.chat.completions.create({ model: 'toni-leicht', messages: [{ role: 'user', content: 'Hi' }], stream: true })) text += s.choices[0].delta.content ?? '';
  assert.equal(text, 'Hallo');
  const t = await toni.audio.transcriptions.create({ file: { data: new Uint8Array([1, 2, 3]), filename: 'a.mp3' }, language: 'de' });
  assert.equal(t.text, 'gesprochen');
  const form = anfragen.at(-1);
  assert.match(form.headers['content-type'], /^multipart\/form-data/);
  assert.match(form.body, /name="model"\r\n\r\ntoni-transkription/);
  assert.match(form.body, /filename="a.mp3"/);
  assert.equal(new Uint8Array(await toni.videos.content('vid_1')).length, 3);
});

test('Agent mit Bereichen: Werkzeugaufruf, Ergebnis geht zurück ins Gespräch', async () => {
  const toni = neu();
  const agent = toni.agent({ areas: ['crm'], instructions: 'Sei knapp.' });
  assert.ok(agent.toolNames.includes('crm__get_leads'));
  assert.ok(!agent.toolNames.includes('crm__create_lead'), 'Standard ist nur lesen');
  antworten = [
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'crm__get_leads', { status: 'new' })] }) },
    { body: { object: 'platform.result', bereich: 'crm', werkzeug: 'get_leads', stufe: 'lesen', data: { success: true, data: { items: [{ id: 1 }] } } } },
    { body: chatAntwort({ content: 'Ein neuer Lead.' }) },
  ];
  const schritte = [];
  const r = await toni.agent({ areas: ['crm'], instructions: 'Sei knapp.', onStep: (s) => schritte.push(s.tool) }).run('Neue Leads?');
  assert.equal(r.text, 'Ein neuer Lead.');
  assert.equal(r.finish, 'stop');
  assert.deepEqual(schritte, ['crm/get_leads']);
  assert.equal(r.steps[0].failed, false);
  assert.equal(r.usage.total_tokens, 30);
  assert.equal(anfragen[1].url, '/v1/platform/crm/get_leads');
  const zweite = anfragen[2].body.messages;
  assert.match(zweite[0].content, /Sei knapp\./);
  assert.equal(zweite.at(-1).role, 'tool');
  assert.equal(zweite.at(-1).tool_call_id, 'c1');
  assert.match(zweite.at(-1).content, /"items"/);
  assert.ok(anfragen[0].body.tools.every((t) => !('bestaetigt' in (t.function.parameters.properties ?? {}))));
});

test('Agent: Schreiben und Löschen nur mit Erlaubnis und Bestätigung eines Menschen', async () => {
  const toni = neu();
  // Das Modell versucht zu löschen und setzt die Bestätigung selbst — der Agent liest nur.
  antworten = [
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'toni_funktion_aufrufen', { bereich: 'books', funktion: 'delete_book', parameter: { book_id: 7, bestaetigt: true } })] }) },
    { body: chatAntwort({ content: 'Das darf ich nicht.' }) },
  ];
  let r = await toni.agent().run('Lösch Buch 7');
  assert.equal(r.steps[0].failed, true);
  assert.ok(!anfragen.some((a) => a.url.startsWith('/v1/platform/')), 'kein Aufruf der Plattform');

  // Erlaubt, aber ohne onConfirm: wieder kein Aufruf.
  anfragen.length = 0;
  antworten = [
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'books__delete_book', { book_id: 7, bestaetigt: true })] }) },
    { body: chatAntwort({ content: 'Braucht deine Bestätigung.' }) },
  ];
  r = await toni.agent({ areas: ['books'], allow: ['lesen', 'loeschen'] }).run('Lösch Buch 7');
  assert.equal(r.steps[0].failed, true);
  assert.ok(!anfragen.some((a) => a.url.startsWith('/v1/platform/')));

  // Mensch lehnt ab / stimmt zu.
  for (const ja of [false, true]) {
    anfragen.length = 0;
    antworten = [
      { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'books__delete_book', { book_id: 7 })] }) },
      ...(ja ? [{ body: { object: 'platform.result', bereich: 'books', werkzeug: 'delete_book', stufe: 'loeschen', data: { success: true } } }] : []),
      { body: chatAntwort({ content: 'Fertig.' }) },
    ];
    let gefragt = null;
    r = await toni.agent({ areas: ['books'], allow: ['lesen', 'loeschen'], onConfirm: (c) => { gefragt = c; return ja; } }).run('Lösch Buch 7');
    assert.deepEqual(gefragt.args, { book_id: 7 });
    assert.equal(gefragt.level, 'loeschen');
    const plattform = anfragen.filter((a) => a.url.startsWith('/v1/platform/'));
    assert.equal(plattform.length, ja ? 1 : 0);
    if (ja) assert.deepEqual(plattform[0].body, { book_id: 7, bestaetigt: true });
    assert.equal(r.steps[0].failed, !ja);
  }
});

test('Agent ohne Bereiche: sucht im Katalog, eigene Werkzeuge, Rundengrenze, Fortsetzen', async () => {
  const toni = neu();
  antworten = [
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'toni_funktion_suchen', { suche: 'leads' })] }) },
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c2', 'wetter', { ort: 'Köln' })] }) },
    { body: chatAntwort({ content: 'Sonnig.' }) },
  ];
  const agent = toni.agent({ tools: [{ name: 'wetter', description: 'Wetter', parameters: { type: 'object', properties: { ort: { type: 'string' } } }, execute: ({ ort }) => ({ ort, wetter: 'sonnig' }) }] });
  assert.deepEqual(agent.toolNames, ['wetter', 'toni_funktion_suchen', 'toni_funktion_aufrufen']);
  const r = await agent.run('Wetter?');
  assert.equal(r.text, 'Sonnig.');
  assert.deepEqual(r.steps.map((s) => s.tool), ['wetter'], 'Suchen im Katalog ist kein Schritt');
  const suche = JSON.parse(anfragen[1].body.messages.at(-1).content);
  assert.ok(suche.some((t) => t.bereich === 'crm' && t.funktion === 'get_leads'));
  assert.ok(suche.every((t) => t.stufe === 'lesen'), 'nur erlaubte Stufen');

  antworten = [{ body: chatAntwort({ content: 'Und morgen Regen.' }) }];
  const weiter = await agent.run('Und morgen?', { messages: r.messages });
  assert.equal(weiter.messages.filter((m) => m.role === 'system').length, 1);
  assert.equal(weiter.messages.at(-2).content, 'Und morgen?');

  // Rundengrenze: das Modell ruft immer weiter Werkzeuge auf.
  antworten = [
    { body: chatAntwort({ content: null, tool_calls: [aufruf('c1', 'wetter', {})] }) },
    { body: chatAntwort({ content: 'Schluss.', tool_calls: [aufruf('c2', 'wetter', {})] }) },
  ];
  anfragen.length = 0;
  const g = await toni.agent({ tools: agent['o'].tools, maxSteps: 1 }).run('Los');
  assert.equal(g.finish, 'max_steps');
  assert.equal(g.steps.length, 1);
  assert.equal(anfragen.at(-1).body.tools, undefined, 'die letzte Runde bekommt keine Werkzeuge mehr');

  assert.throws(() => toni.agent({ areas: ['gibtsnicht'] }), ToniError);
});

test('Echtzeit-Sprache: Adresse, Schlüssel als Unterprotokoll, Start, Ereignisse', async () => {
  const toni = neu();
  const gesendet = [];
  let ws;
  class FalscherSocket extends EventTarget {
    constructor(url, protokolle) { super(); ws = this; this.url = url; this.protokolle = protokolle; queueMicrotask(() => this.dispatchEvent(new Event('open'))); }
    send(t) { gesendet.push(JSON.parse(t)); }
    close() { this.dispatchEvent(new Event('close')); }
    kommt(o) { const e = new Event('message'); e.data = JSON.stringify(o); this.dispatchEvent(e); }
  }
  const s = await toni.realtime.connect({ WebSocket: FalscherSocket, instructions: 'Kurz.', format: { type: 'audio/pcmu', rate: 8000 }, tools: [{ name: 'wetter' }] });
  assert.equal(ws.url, basis.replace('http', 'ws') + '/realtime?model=toni-sprache');
  assert.deepEqual(ws.protokolle, ['realtime', 'km-key.km_live_test']);
  assert.equal(gesendet[0].type, 'session.start');
  assert.deepEqual(gesendet[0].session.audio, { format: { type: 'audio/pcmu', rate: 8000 }, output: { voice: 'marin' } });
  assert.equal(gesendet[0].session.delegation.responses.tools[0].name, 'wetter');
  s.sendAudio(new Uint8Array([1, 2, 3]));
  s.toolOutput('call_1', { ok: true });
  s.respond();
  assert.deepEqual(gesendet.slice(1), [
    { type: 'session.input_audio.append', audio: 'AQID' },
    { type: 'response.item.create', item: { type: 'function_call_output', call_id: 'call_1', output: '{"ok":true}' } },
    { type: 'response.create' },
  ]);
  const fehler = [];
  s.on('error', (e) => fehler.push(e.code));
  ws.kommt({ type: 'session.started' });
  ws.kommt({ type: 'error', error: { code: 'insufficient_quota', message: 'Leer.' } });
  const gesehen = [];
  setTimeout(() => s.close(), 5);
  for await (const e of s) gesehen.push(e.type);
  assert.deepEqual(gesehen, ['session.started', 'error']);
  assert.deepEqual(fehler, ['insufficient_quota']);
  assert.equal(s.closed, true);
  assert.equal(gesendet.at(-1).type, 'session.close');
  assert.throws(() => s.respond(), ToniError);
});

test('Terminal: login speichert den Schlüssel, logout löscht ihn, verbinden zeigt den MCP-Zugang', async () => {
  const { execFile } = await import('node:child_process');
  const { mkdtempSync, readFileSync, statSync, existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const ordner = mkdtempSync(join(tmpdir(), 'toni-'));
  const datei = join(ordner, 'toni', 'config.json');
  const umgebung = { PATH: process.env.PATH, XDG_CONFIG_HOME: ordner, TONI_BASE_URL: basis };
  const toni = (...a) => new Promise((fertig) => {
    const kind = execFile(process.execPath, ['dist/cli.js', ...a], { env: umgebung }, (fehler, out, err) => fertig({ code: fehler ? fehler.code : 0, out, err }));
    kind.stdin.end();
  });

  anfragen.length = 0; antworten = [{ status: 401, body: { error: { message: 'Falsch.', type: 'authentication_error', param: null, code: 'invalid_api_key' } } }];
  const falsch = await toni('login', 'km_live_falsch');
  assert.equal(falsch.code, 1);
  assert.match(falsch.err, /nicht angenommen/);
  assert.equal(existsSync(datei), false);

  antworten = [{ body: { object: 'list', data: [] } }];
  const gut = await toni('login', 'km_live_gespeichert');
  assert.equal(gut.code, 0);
  assert.equal(JSON.parse(readFileSync(datei, 'utf8')).api_key, 'km_live_gespeichert');
  assert.equal(statSync(datei).mode & 0o777, 0o600);

  anfragen.length = 0;
  const antwort = await toni('--bereiche', 'crm', 'Hallo');
  assert.equal(antwort.out.trim(), 'Hallo.');
  assert.equal(anfragen[0].headers.authorization, 'Bearer km_live_gespeichert');

  assert.match((await toni('logout')).out, /gelöscht/);
  assert.equal(existsSync(datei), false);
  assert.match((await toni('Hallo')).err, /toni login/);

  const hermes = (await toni('verbinden', 'hermes')).out;
  assert.match(hermes, /https:\/\/app\.landingpage\.tools\/mcp/);
  assert.match(hermes, /mcp_servers/);
  assert.match((await toni('verbinden', 'openclaw')).out, /streamable-http/);
});
