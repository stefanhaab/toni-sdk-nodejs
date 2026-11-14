/** Recht, das ein Schlüssel für eine Funktion braucht. */
export type Level = 'lesen' | 'schreiben' | 'veroeffentlichen' | 'loeschen';

export type ChatModel = 'toni-leicht' | 'toni-mittel' | 'toni-schwer' | (string & {});

export interface ToniOptions {
  /** Schlüssel `km_live_…`. Standard: Umgebungsvariable `TONI_API_KEY`, sonst `KM_KEY`. */
  apiKey?: string;
  /** Standard: `TONI_BASE_URL`, sonst https://ki-markt.com/v1 */
  baseUrl?: string;
  /** Zeitgrenze je Anfrage in Millisekunden. Standard 120000. */
  timeout?: number;
  /** Wiederholungen bei 429, 502, 503, 504 und Netzwerkfehlern. Standard 2. */
  maxRetries?: number;
  /** Eigene fetch-Funktion (Tests, Proxys). */
  fetch?: typeof fetch;
  /** Zusätzliche Kopfzeilen für jede Anfrage. */
  headers?: Record<string, string>;
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface CallOptions extends RequestOptions {
  /**
   * Bestätigt eine Funktion der Stufe `loeschen` oder `veroeffentlichen`
   * (sendet `"bestaetigt": true`). Ohne Bestätigung antwortet die API mit 409.
   */
  confirmed?: boolean;
}

/**
 * Rückgabe einer Plattform-Funktion. Fast immer `{ success, data }`; fachliche Fehler
 * (z. B. unbekannte ID) kommen als `{ success: false, error }` und werfen NICHT.
 */
export interface FunctionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  [weiteres: string]: any;
}

/** Hülle jeder Plattform-Antwort (`platform.raw`). */
export interface PlatformEnvelope<T = any> {
  object: 'platform.result';
  bereich: string;
  werkzeug: string;
  stufe: Level;
  data: FunctionResult<T>;
}

export interface PlatformCaller {
  call<T = any>(area: string, name: string, params?: Record<string, unknown>, options?: CallOptions): Promise<FunctionResult<T>>;
}

export interface JsonSchema {
  type?: string;
  description?: string;
  enum?: unknown[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  [weiteres: string]: unknown;
}

export interface CatalogFunction {
  name: string;
  title: string;
  level: Level;
  parameters: JsonSchema;
}

export interface CatalogArea {
  name: string;
  title: string;
  description: string;
  functions: CatalogFunction[];
}

// ------------------------------------------------------------------ Chat

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ChatTool {
  type: 'function';
  function: { name: string; description?: string; parameters?: JsonSchema };
}

export interface ChatParams {
  model: ChatModel;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  tools?: ChatTool[];
  response_format?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{ index: number; message: ChatMessage; finish_reason: string | null }>;
  usage?: Usage;
}

export interface ChatChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { role?: string; content?: string | null; tool_calls?: Array<Partial<ToolCall> & { index: number }> };
    finish_reason: string | null;
  }>;
  usage?: Usage | null;
}

// ------------------------------------------------------------------ Medien

export interface EmbeddingParams {
  model?: 'toni-embedding' | (string & {});
  input: string | string[];
}

export interface EmbeddingResponse {
  object: 'list';
  model: string;
  data: Array<{ object: 'embedding'; index: number; embedding: number[] }>;
  usage?: { prompt_tokens: number; total_tokens: number };
}

export type FileInput = Blob | Uint8Array | ArrayBuffer | string | { data: Blob | Uint8Array | ArrayBuffer; filename: string };

export interface TranscriptionParams {
  /** Blob/File, Bytes oder ein Dateipfad. Höchstens 25 MB. */
  file: FileInput;
  model?: 'toni-transkription' | (string & {});
  /** ISO 639-1, z. B. `de`. */
  language?: string;
  response_format?: 'json' | 'text' | 'verbose_json';
}

export interface Transcription {
  text: string;
  [weiteres: string]: unknown;
}

export interface ImageParams {
  prompt: string;
  model?: 'toni-bild' | (string & {});
  size?: string;
  n?: 1;
}

export interface ImageResponse {
  created: number;
  data: Array<{ b64_json?: string; url?: string }>;
}

export interface VideoParams {
  prompt: string;
  model?: 'toni-video' | (string & {});
  /** 2 bis 5 */
  seconds?: number;
  aspect_ratio?: '16:9' | '9:16' | 'vertical';
}

export interface Video {
  id: string;
  object: 'video';
  model: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | (string & {});
  seconds?: number;
  [weiteres: string]: unknown;
}

export interface Model {
  id: string;
  object: 'model';
  art: string;
  name: string;
  beschreibung: string;
  preis: Record<string, unknown>;
  kontext?: number;
  nur_nach_aufladung?: boolean;
  [weiteres: string]: unknown;
}

export interface ListResponse<T> {
  object: 'list';
  data: T[];
  [weiteres: string]: unknown;
}
