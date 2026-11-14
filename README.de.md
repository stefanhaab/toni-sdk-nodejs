# Toni SDK für Node.js

**Ein KI-Agent für dein Unternehmen, ohne ihn selbst zu betreiben.** Toni ist ein gehosteter Agent mit über 260 fertigen Funktionen: CRM, Angebote, Rechnungen, Bücher, Podcasts, Landingpages, Wissensgraph und deine eigenen KI-Mitarbeiter. Dieses SDK bringt die Agenten-Schleife, jede Funktion als typisierte Methode, ein OpenAI-kompatibles Gateway und Toni fürs Terminal.

Wer sich [Hermes Agent](https://github.com/NousResearch/hermes-agent) oder [OpenClaw](https://github.com/openclaw/openclaw) angesehen hat und den Agenten will, aber nicht den Server, die Modell-Schlüssel und das Verdrahten der Werkzeuge: das hier ist die gehostete Alternative.

[English](README.md) · [PHP](https://github.com/stefanhaab/toni-sdk-php) · [API-Referenz](https://ki-markt.com/api-referenz) · [ki-markt.com](https://ki-markt.com)

```bash
npm install toni-sdk
```

```ts
import { Toni } from 'toni-sdk';

const toni = new Toni(); // liest TONI_API_KEY

const ergebnis = await toni.agent({ areas: ['crm'] }).run('Wer hat sich diese Woche gemeldet, und wer wartet noch auf Antwort?');
console.log(ergebnis.text);
```

Den Schlüssel (`km_live_…`) erzeugst du im Konto unter „API“ auf [ki-markt.com](https://ki-markt.com). Neue Konten starten mit Testguthaben.

## Toni, Hermes Agent, OpenClaw

Hermes Agent und OpenClaw sind quelloffene Agenten, die du selbst betreibst. Toni ist eine gehostete Plattform, die du aufrufst.

| | Toni | Hermes Agent | OpenClaw |
|---|---|---|---|
| Läuft | Gehostet, du rufst eine API auf | Auf deinem Rechner oder Server | Auf deinem Rechner oder Server |
| Einrichtung | `npm install`, ein Schlüssel | Installieren, einrichten, am Laufen halten | Installieren, einrichten, Dienst am Laufen halten |
| Modelle | Drei Größen inklusive, Abrechnung nach Nutzung | Eigene Modell-Schlüssel | Eigene Modell-Schlüssel oder lokale Modelle |
| Werkzeuge | Über 260 Funktionen, je Unternehmen getrennt | Fähigkeiten, die der Agent selbst schreibt, und aus der Community | Fähigkeiten aus der Community |
| Unternehmensdaten | CRM, Angebote, Rechnungen, Inhalte, Wissensgraph sind dabei | Bindest du selbst an | Bindest du selbst an |
| Unumkehrbares | Gesperrt, bis ein Mensch bestätigt | Je nach Einrichtung | Je nach Einrichtung |
| Personenbezogene Daten | Die Datenschleuse ersetzt sie, bevor ein Modell sie sieht | Je nach Einrichtung | Je nach Einrichtung |
| Chat-Apps (Telegram, WhatsApp …) | Nicht Teil dieses SDK | Eingebaut | Eingebaut |
| Quelltext | SDK unter MIT, Plattform gehostet | MIT, ganz offen | MIT, ganz offen |

Nimm Hermes Agent oder OpenClaw, wenn alles auf deiner eigenen Hardware laufen soll und du einen persönlichen Assistenten in deinen Chat-Apps willst. Nimm Toni, wenn der Agent schon mit den Daten eines Unternehmens arbeiten können soll und du ihn nicht betreiben möchtest.

## Der Agent

```ts
const agent = toni.agent({
  areas: ['crm', 'offers'],          // Funktionen dieser Bereiche werden Werkzeuge
  allow: ['lesen', 'schreiben'],     // Standard ist ['lesen']: er liest nur
  instructions: 'Du arbeitest für einen Maschinenbauer.',
  onStep: (s) => console.log('→', s.tool, s.args),
});

const erste = await agent.run('Leg einen Lead für Mira Beispiel an, mira@example.com.');
const zweite = await agent.run('Und entwirf ihr ein Angebot.', { messages: erste.messages });
```

- **Ohne `areas`** sucht der Agent selbst im ganzen Katalog (zwei Werkzeuge: suchen, aufrufen). Gut für offene Fragen.
- **Rechte** gibt es in vier Stufen: `lesen`, `schreiben`, `veroeffentlichen`, `loeschen`. Der Agent sieht nur Funktionen der erlaubten Stufen, und der Schlüssel braucht dasselbe Recht im Konto.
- **Löschen und Veröffentlichen** brauchen zusätzlich `onConfirm`. Das Modell kann sich nicht selbst bestätigen:

```ts
toni.agent({
  areas: ['books'],
  allow: ['lesen', 'loeschen'],
  onConfirm: async (aufruf) => confirm(`${aufruf.title}: ${JSON.stringify(aufruf.args)}?`),
});
```

- **Eigene Werkzeuge** stehen neben den Funktionen der Plattform:

```ts
toni.agent({
  tools: [{
    name: 'lagerbestand',
    description: 'Bestand eines Artikels',
    parameters: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] },
    execute: ({ sku }) => lager.bestand(sku),
  }],
});
```

`run()` liefert `text`, `steps` (jeder Werkzeugaufruf mit Parametern, Ergebnis und Dauer), `messages`, `usage` und `finish`.

## KI-Mitarbeiter, die von selbst laufen

KI-Mitarbeiter, die du auf der Plattform baust, laufen ohne deinen Prozess weiter: nach Zeitplan oder bei Ereignissen wie einem neuen Lead oder einer eingehenden Mail.

```ts
const { agent_id } = await toni.baukasten.agentEntwurf({ name: 'Neue Leads prüfen', anweisungen: 'Bewerte jeden neuen Lead und notiere, warum.' });
const { lauf_id } = await toni.baukasten.agentStarten({ agent_id, simulation: true });   // Probe: nichts wird geschrieben
const stand = await toni.baukasten.agentLaufStatus({ lauf_id });
```

## Jede Funktion als Methode

```ts
const leads = await toni.crm.getLeads({ status: 'new', limit: 10 });
const buch = await toni.books.createBook({ title: 'Weniger Büro' });
await toni.books.deleteBook({ book_id: 12, bestaetigt: true });

await toni.platform.call('crm', 'get_leads', { limit: 10 });   // allgemeine Form
```

30 Bereiche, aus dem OpenAPI-Dokument erzeugt, mit der Beschreibung jedes Parameters im Editor. Eine Funktion liefert `{ success, data }`; ein fachlicher Fehler wie eine unbekannte ID kommt als `{ success: false, error }` und wirft nicht.

## KI-Gateway (OpenAI-kompatibel)

```ts
const text = await toni.ask('Fasse in zwei Sätzen zusammen, was ein Voicebot ist.');

const strom = await toni.chat.completions.create({
  model: 'toni-mittel',                       // toni-leicht · toni-mittel · toni-schwer
  messages: [{ role: 'user', content: 'Hallo' }],
  stream: true,
});
for await (const stueck of strom) process.stdout.write(stueck.choices[0]?.delta?.content ?? '');

await toni.embeddings.create({ input: ['eins', 'zwei'] });
await toni.audio.transcriptions.create({ file: './anruf.mp3', language: 'de' });
await toni.images.generate({ prompt: 'Eine Werkstatt bei Sonnenaufgang' });

const video = await toni.videos.create({ prompt: 'Eine Drohne über einem Hallendach', seconds: 5 });
await toni.videos.wait(video.id);
const mp4 = await toni.videos.content(video.id);

await toni.prices();   // Größen und Preise, ohne Schlüssel
```

Du nutzt schon die OpenAI-Bibliothek? Stell sie auf `https://ki-markt.com/v1` und deinen Toni-Schlüssel um.

## Terminal

```bash
export TONI_API_KEY=km_live_…
npx toni "Welche Rechnungen sind überfällig?"
npx toni --bereiche crm --schreiben      # Gespräch, darf anlegen und ändern
npx toni funktionen lead                 # im Katalog blättern
```

## Fehler

`AuthenticationError` (401), `InsufficientCreditError` (402), `PermissionError` (403), `ConfirmationRequiredError` (409), `RateLimitError` (429), `ToniConnectionError` (keine Antwort); alle API-Fehler tragen `status`, `code` und `message`. Lesende Aufrufe werden bei 429 und 5xx wiederholt, schreibende Plattform-Aufrufe nie von selbst.

## Optionen

```ts
new Toni({ apiKey, baseUrl, timeout: 120_000, maxRetries: 2, fetch, headers });
```

Umgebung: `TONI_API_KEY` (oder `KM_KEY`), `TONI_BASE_URL`. Node.js 18 oder neuer, keine Abhängigkeiten.

## Noch nicht im SDK

Echtzeit-Sprache (`/v1/realtime`, WebSocket) hat noch keine eigene Hülle; siehe [API-Referenz](https://ki-markt.com/api-referenz).

## Entwicklung

```bash
npm install
npm run generate     # src/generated aus dem OpenAPI-Dokument neu erzeugen
npm test
```

MIT
