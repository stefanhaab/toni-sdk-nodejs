# Toni SDK for Node.js

**An AI agent for your business, without running one.** Toni is a hosted agent with 260+ business functions built in: CRM, offers, invoices, books, podcasts, landing pages, knowledge graph, and your own AI co-workers. This SDK gives you the agent loop, every function as a typed method, an OpenAI-compatible model gateway and a terminal client.

If you looked at [Hermes Agent](https://github.com/NousResearch/hermes-agent) or [OpenClaw](https://github.com/openclaw/openclaw) and want the agent but not the server, the model keys and the skill wiring, this is the hosted alternative.

[Deutsche Fassung](README.de.md) · [PHP](https://github.com/stefanhaab/toni-sdk-php) · [API reference](https://ki-markt.com/api-referenz) · [ki-markt.com](https://ki-markt.com)

```bash
npm install toni-sdk
```

```ts
import { Toni } from 'toni-sdk';

const toni = new Toni(); // reads TONI_API_KEY

const result = await toni.agent({ areas: ['crm'] }).run('Who got in touch this week, and who is still waiting for an answer?');
console.log(result.text);
```

Get a key (`km_live_…`) in your account under "API" at [ki-markt.com](https://ki-markt.com). New accounts start with test credit.

## Toni, Hermes Agent, OpenClaw

Hermes Agent and OpenClaw are open-source agents you host yourself. Toni is a hosted platform you call. Pick by what you want to own.

| | Toni | Hermes Agent | OpenClaw |
|---|---|---|---|
| Runs on | Hosted, you call an API | Your machine or server | Your machine or server |
| Setup | `npm install`, one key | Install, configure, keep running | Install, onboard, keep a daemon running |
| Models | Three sizes included, pay per use | Bring your own model keys | Bring your own model keys, or local models |
| Tools | 260+ business functions, tenant-safe | Skills the agent writes, community skills | Community skills |
| Business data | CRM, offers, invoices, content, knowledge graph included | You connect it | You connect it |
| Destructive actions | Blocked unless a human confirms | Up to your setup | Up to your setup |
| Personal data | Privacy gate replaces it before a model sees it | Up to your setup | Up to your setup |
| Chat apps (Telegram, WhatsApp …) | Not part of this SDK | Built in | Built in |
| Source | SDK is MIT, platform is hosted | MIT, fully open | MIT, fully open |

Choose Hermes Agent or OpenClaw if you want everything on your own hardware and a personal assistant in your chat apps. Choose Toni if you want an agent that already knows how to work with a company's data, and you'd rather not operate it.

## The agent

```ts
const agent = toni.agent({
  areas: ['crm', 'offers'],          // functions of these areas become tools
  allow: ['lesen', 'schreiben'],     // default is ['lesen']: read only
  instructions: 'You work for a machine builder. Answer in English.',
  onStep: (s) => console.log('→', s.tool, s.args),
});

const first = await agent.run('Create a lead for Mira Example, mira@example.com.');
const next = await agent.run('And draft an offer for her.', { messages: first.messages });
```

- **Without `areas`** the agent searches the whole catalog itself (two tools: search, call). Good for open questions.
- **Rights** follow four levels: `lesen` (read), `schreiben` (write), `veroeffentlichen` (publish), `loeschen` (delete). The agent only sees functions of the levels you allow, and the key needs the same right in your account.
- **Deleting and publishing** additionally need `onConfirm`. The model cannot confirm for itself:

```ts
toni.agent({
  areas: ['books'],
  allow: ['lesen', 'loeschen'],
  onConfirm: async (call) => confirm(`${call.title}: ${JSON.stringify(call.args)}?`),
});
```

- **Your own tools** sit next to the platform functions:

```ts
toni.agent({
  tools: [{
    name: 'stock',
    description: 'Stock level of an article',
    parameters: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] },
    execute: ({ sku }) => warehouse.stock(sku),
  }],
});
```

`run()` returns `text`, `steps` (every tool call with arguments, result and duration), `messages`, `usage` and `finish`.

## AI co-workers that run on their own

Agents you build on the platform keep running without your process: on a schedule or on events such as a new lead or an incoming mail.

```ts
const { agent_id } = await toni.baukasten.agentEntwurf({ name: 'Check new leads', anweisungen: 'Rate every new lead and note why.' });
const { lauf_id } = await toni.baukasten.agentStarten({ agent_id, simulation: true });   // dry run: nothing is written
const status = await toni.baukasten.agentLaufStatus({ lauf_id });
```

## Every function as a method

```ts
const leads = await toni.crm.getLeads({ status: 'new', limit: 10 });
const book = await toni.books.createBook({ title: 'Less office' });
await toni.books.deleteBook({ book_id: 12, bestaetigt: true });

await toni.platform.call('crm', 'get_leads', { limit: 10 });   // generic form
```

30 areas, generated from the OpenAPI document, with parameter docs in your editor. Function names and docs are German, as in the API. A function returns `{ success, data }`; a business error such as an unknown id comes back as `{ success: false, error }` and does not throw.

## Model gateway (OpenAI-compatible)

```ts
const text = await toni.ask('Summarise in two sentences what a voicebot is.');

const stream = await toni.chat.completions.create({
  model: 'toni-mittel',                       // toni-leicht · toni-mittel · toni-schwer
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true,
});
for await (const chunk of stream) process.stdout.write(chunk.choices[0]?.delta?.content ?? '');

await toni.embeddings.create({ input: ['one', 'two'] });
await toni.audio.transcriptions.create({ file: './call.mp3', language: 'de' });
await toni.images.generate({ prompt: 'A workshop at sunrise' });

const video = await toni.videos.create({ prompt: 'A drone over a factory roof', seconds: 5 });
await toni.videos.wait(video.id);
const mp4 = await toni.videos.content(video.id);

await toni.prices();   // sizes and prices, no key needed
```

Already using the OpenAI library? Point it at `https://ki-markt.com/v1` with your Toni key.

## Terminal

```bash
export TONI_API_KEY=km_live_…
npx toni "Which invoices are overdue?"
npx toni --bereiche crm --schreiben      # conversation, may create and change
npx toni funktionen lead                 # browse the catalog
```

## Errors

```ts
import { ToniApiError, RateLimitError, PermissionError } from 'toni-sdk';

try {
  await toni.crm.createLead({ data: { email: 'mira@example.com' } });
} catch (e) {
  if (e instanceof PermissionError) console.log(e.code); // recht_fehlt
  else if (e instanceof ToniApiError) console.log(e.status, e.code, e.message);
  else throw e;
}
```

`AuthenticationError` (401), `InsufficientCreditError` (402), `PermissionError` (403), `ConfirmationRequiredError` (409), `RateLimitError` (429), `ToniConnectionError` (no answer). Reads are retried on 429 and 5xx; writing platform calls are never retried on their own.

## Options

```ts
new Toni({ apiKey, baseUrl, timeout: 120_000, maxRetries: 2, fetch, headers });
```

Environment: `TONI_API_KEY` (or `KM_KEY`), `TONI_BASE_URL`. Node.js 18 or newer, no dependencies.

## Not in this SDK yet

Realtime voice (`/v1/realtime`, WebSocket) has no wrapper yet; see the [API reference](https://ki-markt.com/api-referenz).

## Development

```bash
npm install
npm run generate     # rebuild src/generated from the live OpenAPI document
npm test
```

MIT
