// TONI_API_KEY=km_live_… node examples/chat-stream.mjs
import { Toni } from 'toni-sdk';

const toni = new Toni();
const strom = await toni.chat.completions.create({
  model: 'toni-mittel',
  messages: [{ role: 'user', content: 'Schreib drei Sätze über gute Angebote.' }],
  stream: true,
});
for await (const stueck of strom) process.stdout.write(stueck.choices[0]?.delta?.content ?? '');
console.log();
