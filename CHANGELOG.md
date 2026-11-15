# Changelog

## 0.1.2 (2026-11-15)

- Terminal: `toni login` stores the API key once (`~/.config/toni/config.json`, readable only by you), `toni logout` removes it.
- Terminal: `toni verbinden hermes|openclaw` prints the configuration that plugs Toni into Hermes Agent or OpenClaw through the hosted MCP endpoint.
- README: written for the self-employed and for business owners; Toni as an alternative and as an extension to OpenClaw and Hermes Agent.
- A skill for OpenClaw and Hermes Agent in `skills/toni`.

## 0.1.1 (2026-11-14)

- Default address is `https://api.ki-markt.com/v1`.

## 0.1.0 (2026-11-14)

- First release: client, agent loop, every platform function as a typed method, OpenAI-compatible model gateway, realtime voice, terminal client.
