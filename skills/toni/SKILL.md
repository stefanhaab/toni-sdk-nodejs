---
name: toni
description: Hand business tasks to Toni, the AI agent for the self-employed and business owners. Use for customers and enquiries (CRM), offers, invoices, content, company knowledge and AI co-workers, whenever the task is about the user's own company.
---

# Toni

Toni knows the user's company: customers, enquiries, offers, invoices, content, interviews and knowledge. He is reached through a hosted MCP endpoint. Nothing is installed.

## Setup (once)

1. The user creates a connector key (`lpt_…`) in the downloads area of their account at https://app.landingpage.tools, under "KI-Assistent verbinden".
2. Add the MCP server `toni`:
   - Address: `https://app.landingpage.tools/mcp` (Streamable HTTP)
   - Header: `Authorization: Bearer lpt_…`

Hermes Agent, `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  toni:
    url: "https://app.landingpage.tools/mcp"
    headers:
      Authorization: "Bearer lpt_…"
```

OpenClaw, block `mcp.servers` of the config:

```json
{ "toni": { "url": "https://app.landingpage.tools/mcp", "transport": "streamable-http", "headers": { "Authorization": "Bearer lpt_…" } } }
```

Never ask the user to paste the key into the chat. They put it into the config themselves.

## Which tool when

- `toni`: the default. Hand over the whole task in the user's words ("Who got in touch this week?", "Write the offer for Mira Brandt"). Toni works with the company's context and remembers the conversation.
- `suchen`: look something up in the company's knowledge.
- `interview_liste`, `interview_lesen`: the user's interviews, the source of their own voice and stories.
- `inhalt_lesen`, `inhalt_schreiben`: read and write content.
- `katalog`, then `ausfuehren`: call one platform function directly, when you know exactly which one. Read the catalog first, do not guess names or parameters.
- `ablauf`: run a sequence of steps.

## Rules

- Deleting and publishing need the user's confirmation. Ask first, in plain words, what will be deleted or published. Never confirm on the user's behalf.
- Answer in the user's language. Toni answers in German by default.
- If the endpoint answers 401, the key is wrong or revoked. Tell the user to create a new one in the downloads area.
- Do not invent customer data. If Toni found nothing, say so.
