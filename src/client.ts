import { Agent, type AgentOptions } from './agent.js';
import { ToniError } from './errors.js';
import { createAreas, type Areas } from './generated/areas.js';
import { CATALOG } from './generated/catalog.js';
import { Http, sse } from './http.js';
import type {
  CallOptions, CatalogArea, ChatChunk, ChatCompletion, ChatModel, ChatParams, EmbeddingParams, EmbeddingResponse,
  FileInput, FunctionResult, ImageParams, ImageResponse, ListResponse, Model, PlatformCaller, PlatformEnvelope,
  RequestOptions, ToniOptions, Transcription, TranscriptionParams, Video, VideoParams,
} from './types.js';

class Completions {
  constructor(private readonly http: Http) {}

  /** Chat, OpenAI-kompatibel. Mit `stream: true` kommt ein Strom von Stücken. */
  create(params: ChatParams & { stream: true }, options?: RequestOptions): Promise<AsyncIterable<ChatChunk>>;
  create(params: ChatParams & { stream?: false }, options?: RequestOptions): Promise<ChatCompletion>;
  async create(params: ChatParams, options: RequestOptions = {}): Promise<ChatCompletion | AsyncIterable<ChatChunk>> {
    if (params.stream) {
      const res = await this.http.request<Response>({ path: '/chat/completions', body: params, raw: true, headers: { Accept: 'text/event-stream', ...options.headers }, signal: options.signal, timeout: options.timeout });
      return sse<ChatChunk>(res);
    }
    return this.http.request<ChatCompletion>({ path: '/chat/completions', body: params, ...options });
  }
}

class Platform implements PlatformCaller {
  constructor(private readonly http: Http) {}

  /** Ruft eine Funktion auf und liefert ihre Rückgabe (`data` der Hülle). */
  async call<T = any>(area: string, name: string, params: Record<string, unknown> = {}, options: CallOptions = {}): Promise<FunctionResult<T>> {
    return (await this.raw<T>(area, name, params, options)).data;
  }

  /** Wie `call`, liefert aber die ganze Hülle (`bereich`, `werkzeug`, `stufe`, `data`). */
  raw<T = any>(area: string, name: string, params: Record<string, unknown> = {}, options: CallOptions = {}): Promise<PlatformEnvelope<T>> {
    if (!/^[a-z_]+$/.test(area) || !/^[a-z0-9_]+$/.test(name)) throw new ToniError(`Unbekannte Funktion „${area}/${name}“.`);
    const { confirmed, ...rest } = options;
    const body = confirmed ? { ...params, bestaetigt: true } : params;
    // Schreibende Aufrufe werden nicht von selbst wiederholt: ein zweiter Versuch könnte doppelt anlegen.
    return this.http.request<PlatformEnvelope<T>>({ path: `/platform/${area}/${name}`, method: 'POST', body, noRetry: true, ...rest });
  }

  /** Bereiche und Funktionen samt der Rechte DIESES Schlüssels (`erlaubt`). */
  catalog(options?: RequestOptions): Promise<{ object: 'list'; rechte: string[]; data: Array<{ bereich: string; titel: string; funktionen: Array<{ name: string; stufe: string; erlaubt: boolean }> }> }> {
    return this.http.request({ path: '/platform', ...options });
  }

  /** Kapitel „Toni und der Kontext deines Unternehmens“ (öffentlich). */
  concepts(options?: RequestOptions): Promise<Record<string, unknown>> {
    return this.http.request({ path: '/platform/konzepte', anonymous: true, ...options });
  }

  /** OpenAPI-Dokument der ganzen API (öffentlich). */
  openapi(options?: RequestOptions): Promise<Record<string, unknown>> {
    return this.http.request({ path: '/platform/openapi.json', anonymous: true, ...options });
  }

  /** Der Katalog, mit dem dieses Paket erzeugt wurde (ohne Netzwerk). */
  get functions(): CatalogArea[] {
    return CATALOG;
  }
}

async function alsDatei(file: FileInput): Promise<{ blob: Blob; name: string }> {
  if (typeof file === 'string') {
    const { readFile } = await import('node:fs/promises');
    const { basename } = await import('node:path');
    return { blob: new Blob([await readFile(file)]), name: basename(file) };
  }
  if (typeof Blob !== 'undefined' && file instanceof Blob) return { blob: file, name: (file as File).name || 'audio' };
  if (file instanceof Uint8Array || file instanceof ArrayBuffer) return { blob: new Blob([file as BlobPart]), name: 'audio' };
  const o = file as { data: Blob | Uint8Array | ArrayBuffer; filename: string };
  return { blob: o.data instanceof Blob ? o.data : new Blob([o.data as BlobPart]), name: o.filename };
}

/**
 * Client für die Toni API (https://ki-markt.com).
 *
 * ```ts
 * const toni = new Toni();                       // liest TONI_API_KEY
 * const text = await toni.ask('Was ist ein Voicebot?');
 * const leads = await toni.crm.getLeads({ status: 'new' });
 * const ergebnis = await toni.agent({ areas: ['crm'] }).run('Wer hat sich diese Woche gemeldet?');
 * ```
 */
export class Toni {
  private readonly http: Http;

  readonly chat: { completions: Completions };
  readonly platform: Platform;

  readonly embeddings: { create(params: EmbeddingParams, options?: RequestOptions): Promise<EmbeddingResponse> };
  readonly audio: { transcriptions: { create(params: TranscriptionParams, options?: RequestOptions): Promise<Transcription> } };
  readonly images: { generate(params: ImageParams, options?: RequestOptions): Promise<ImageResponse> };
  readonly videos: {
    create(params: VideoParams, options?: RequestOptions): Promise<Video>;
    retrieve(id: string, options?: RequestOptions): Promise<Video>;
    /** Die fertige MP4-Datei. */
    content(id: string, options?: RequestOptions): Promise<ArrayBuffer>;
    /** Fragt ab, bis das Video fertig oder gescheitert ist. */
    wait(id: string, options?: { interval?: number; timeout?: number; signal?: AbortSignal }): Promise<Video>;
  };
  readonly models: { list(options?: RequestOptions): Promise<ListResponse<Model>> };

  constructor(options: ToniOptions = {}) {
    const http = (this.http = new Http(options));
    this.chat = { completions: new Completions(http) };
    this.platform = new Platform(http);
    this.embeddings = {
      create: (p, o) => http.request({ path: '/embeddings', body: { model: 'toni-embedding', ...p }, ...o }),
    };
    this.audio = {
      transcriptions: {
        create: async (p, o) => {
          const { blob, name } = await alsDatei(p.file);
          const form = new FormData();
          form.set('model', p.model ?? 'toni-transkription');
          form.set('file', blob, name);
          if (p.language) form.set('language', p.language);
          if (p.response_format) form.set('response_format', p.response_format);
          const r = await http.request<Transcription | string>({ path: '/audio/transcriptions', method: 'POST', form, ...o });
          return typeof r === 'string' ? { text: r } : r;
        },
      },
    };
    this.images = {
      generate: (p, o) => http.request({ path: '/images/generations', body: { model: 'toni-bild', ...p }, noRetry: true, ...o }),
    };
    this.videos = {
      create: (p, o) => http.request({ path: '/videos', body: { model: 'toni-video', ...p }, noRetry: true, ...o }),
      retrieve: (id, o) => http.request({ path: `/videos/${encodeURIComponent(id)}`, ...o }),
      content: async (id, o) => (await http.request<Response>({ path: `/videos/${encodeURIComponent(id)}/content`, raw: true, headers: { Accept: 'video/mp4' }, ...o })).arrayBuffer(),
      wait: async (id, o = {}) => {
        const ende = Date.now() + (o.timeout ?? 10 * 60_000);
        for (;;) {
          const v = await this.videos.retrieve(id, { signal: o.signal });
          if (v.status === 'completed' || v.status === 'failed') return v;
          if (Date.now() > ende) throw new ToniError(`Das Video ${id} ist nach der Wartezeit noch nicht fertig.`);
          await new Promise((r) => setTimeout(r, o.interval ?? 5000));
        }
      },
    };
    this.models = { list: (o) => http.request({ path: '/models', ...o }) };
    Object.assign(this, createAreas(this.platform));
  }

  /** Die Adresse, gegen die der Client arbeitet. */
  get baseUrl(): string {
    return this.http.baseUrl;
  }

  /** Größen und Preise (öffentlich, ohne Schlüssel). */
  prices(options?: RequestOptions): Promise<ListResponse<Model>> {
    return this.http.request({ path: '/preise', anonymous: true, ...options });
  }

  /** Eine Frage, eine Antwort als Text. */
  async ask(prompt: string, options: { model?: ChatModel; system?: string; temperature?: number; max_tokens?: number } & RequestOptions = {}): Promise<string> {
    const { model = 'toni-mittel', system, temperature, max_tokens, ...rest } = options;
    const r = await this.chat.completions.create({
      model,
      messages: [...(system ? [{ role: 'system' as const, content: system }] : []), { role: 'user' as const, content: prompt }],
      ...(temperature !== undefined ? { temperature } : {}),
      ...(max_tokens !== undefined ? { max_tokens } : {}),
    }, rest);
    return r.choices[0]?.message?.content ?? '';
  }

  /**
   * Ein Agent: das Modell entscheidet, welche Funktionen der Plattform (und welche eigenen Werkzeuge)
   * es aufruft, bis die Aufgabe erledigt ist. Standard: nur lesende Funktionen.
   */
  agent(options: AgentOptions = {}): Agent {
    return new Agent(this, options);
  }
}

// Die erzeugten Bereiche (toni.crm, toni.books, …) hängen als Eigenschaften am Client.
export interface Toni extends Areas {}
