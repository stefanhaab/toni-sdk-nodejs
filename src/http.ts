import { apiError, ToniConnectionError, ToniError } from './errors.js';
import type { RequestOptions, ToniOptions } from './types.js';

export const VERSION = '0.1.0';
export const DEFAULT_BASE_URL = 'https://ki-markt.com/v1';

const WIEDERHOLEN = new Set([429, 502, 503, 504]);

export interface HttpRequest extends RequestOptions {
  method?: 'GET' | 'POST';
  path: string;
  body?: unknown;
  /** multipart/form-data statt JSON */
  form?: FormData;
  /** Ohne Schlüssel senden (öffentliche Endpunkte). */
  anonymous?: boolean;
  /** Antwort nicht einlesen, sondern die Response liefern (Streams, Dateien). */
  raw?: boolean;
  /** Nicht wiederholen. */
  noRetry?: boolean;
}

const env = (k: string): string | undefined => (typeof process !== 'undefined' ? process.env?.[k] : undefined);

export class Http {
  readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly fetchFn: typeof fetch;
  private readonly headers: Record<string, string>;

  constructor(o: ToniOptions = {}) {
    this.apiKey = o.apiKey ?? env('TONI_API_KEY') ?? env('KM_KEY');
    this.baseUrl = (o.baseUrl ?? env('TONI_BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = o.timeout ?? 120_000;
    this.maxRetries = o.maxRetries ?? 2;
    this.headers = o.headers ?? {};
    const f = o.fetch ?? globalThis.fetch;
    if (typeof f !== 'function') throw new ToniError('fetch fehlt. Nutze Node.js 18 oder neuer, oder übergib `fetch` in den Optionen.');
    this.fetchFn = f.bind(globalThis);
  }

  /** Der Schlüssel, oder ein klarer Fehler, wenn er fehlt. */
  key(): string {
    if (!this.apiKey) throw new ToniError('Der Schlüssel fehlt. Übergib `apiKey` oder setze die Umgebungsvariable TONI_API_KEY (km_live_…).');
    return this.apiKey;
  }

  async request<T = unknown>(r: HttpRequest): Promise<T> {
    if (!r.anonymous && !this.apiKey) {
      throw new ToniError('Der Schlüssel fehlt. Übergib `apiKey` oder setze die Umgebungsvariable TONI_API_KEY (km_live_…).');
    }
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': `toni-sdk-node/${VERSION}`,
      ...this.headers,
      ...r.headers,
    };
    if (!r.anonymous) headers.Authorization = `Bearer ${this.apiKey}`;
    let body: BodyInit | undefined;
    if (r.form) body = r.form;
    else if (r.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(r.body);
    }
    const versuche = r.noRetry ? 0 : this.maxRetries;

    for (let versuch = 0; ; versuch++) {
      const ctl = new AbortController();
      const abbruch = () => ctl.abort(r.signal?.reason);
      if (r.signal?.aborted) abbruch();
      r.signal?.addEventListener('abort', abbruch, { once: true });
      let zeitgrenze = false;
      const timer = setTimeout(() => { zeitgrenze = true; ctl.abort(); }, r.timeout ?? this.timeout);
      let res: Response;
      try {
        res = await this.fetchFn(this.baseUrl + r.path, { method: r.method ?? (body ? 'POST' : 'GET'), headers, body, signal: ctl.signal });
      } catch (e) {
        clearTimeout(timer);
        r.signal?.removeEventListener('abort', abbruch);
        if (r.signal?.aborted) throw e;
        if (versuch < versuche) { await warte(pause(versuch)); continue; }
        throw new ToniConnectionError(zeitgrenze ? 'Die Toni API hat nicht rechtzeitig geantwortet.' : 'Die Toni API ist nicht erreichbar.', { cause: e });
      }
      r.signal?.removeEventListener('abort', abbruch);

      if (res.ok) {
        if (r.raw) {
          // Die Zeitgrenze gilt bei Streams bis zum ersten Byte.
          clearTimeout(timer);
          return res as unknown as T;
        }
        try {
          const text = await res.text();
          const typ = res.headers.get('content-type') || '';
          return (typ.includes('json') ? JSON.parse(text) : text) as T;
        } catch (e) {
          throw new ToniConnectionError('Die Antwort der Toni API war nicht lesbar.', { cause: e });
        } finally {
          clearTimeout(timer);
        }
      }

      clearTimeout(timer);
      const text = await res.text().catch(() => '');
      let json: unknown = null;
      try { json = JSON.parse(text); } catch { /* kein JSON */ }
      if (WIEDERHOLEN.has(res.status) && versuch < versuche) {
        const nach = Number(res.headers.get('retry-after'));
        await warte(Number.isFinite(nach) && nach > 0 ? Math.min(nach * 1000, 30_000) : pause(versuch));
        continue;
      }
      throw apiError(res.status, json ?? text);
    }
  }
}

const pause = (versuch: number): number => Math.min(500 * 2 ** versuch, 8000) + Math.floor(Math.random() * 250);
const warte = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** Liest einen Server-Sent-Events-Strom und liefert die JSON-Stücke bis `[DONE]`. */
export async function* sse<T>(res: Response): AsyncGenerator<T, void, undefined> {
  if (!res.body) return;
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let puffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      puffer += dec.decode(value, { stream: true });
      let i: number;
      while ((i = puffer.search(/\r?\n\r?\n/)) !== -1) {
        const block = puffer.slice(0, i);
        puffer = puffer.slice(i + (puffer[i] === '\r' ? 4 : 2));
        const daten = block.split(/\r?\n/).filter((z) => z.startsWith('data:')).map((z) => z.slice(5).trimStart()).join('\n');
        if (!daten) continue;
        if (daten === '[DONE]') return;
        let stueck: any;
        try { stueck = JSON.parse(daten); } catch { continue; }
        if (stueck?.error) throw apiError(Number(stueck.error.status) || 500, stueck);
        yield stueck as T;
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}
