// TONI_API_KEY=km_live_… node examples/agent.mjs "Wer hat sich diese Woche gemeldet?"
import { Toni } from 'toni-sdk';

const toni = new Toni();
const agent = toni.agent({
  areas: ['crm'],
  onStep: (s) => console.error(`→ ${s.tool} ${JSON.stringify(s.args)} (${s.ms} ms)`),
});
const ergebnis = await agent.run(process.argv.slice(2).join(' ') || 'Welche Leads sind neu?');
console.log(ergebnis.text);
