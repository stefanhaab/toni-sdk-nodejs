/** Basis aller Fehler dieses Pakets. */
export class ToniError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options as ErrorOptions);
    this.name = new.target.name;
  }
}

/** Die API hat mit einem Fehler geantwortet (HTTP 4xx/5xx). */
export class ToniApiError extends ToniError {
  /** HTTP-Status */
  readonly status: number;
  /** z. B. invalid_request_error, permission_error, rate_limit_error */
  readonly type: string | null;
  /** Stabiler Schlüssel zum Auswerten, z. B. recht_fehlt, insufficient_quota, bestaetigung_fehlt */
  readonly code: string | null;
  /** Betroffenes Feld, falls benennbar */
  readonly param: string | null;
  /** Antwort im Rohzustand */
  readonly body: unknown;

  constructor(status: number, body: unknown, fallback: string) {
    const e = (body as any)?.error;
    super(typeof e?.message === 'string' && e.message ? e.message : fallback);
    this.status = status;
    this.type = e?.type ?? null;
    this.code = e?.code ?? null;
    this.param = e?.param ?? null;
    this.body = body;
  }
}

/** 401 — Schlüssel fehlt oder ist ungültig. */
export class AuthenticationError extends ToniApiError {}
/** 402 — Guthaben aufgebraucht. */
export class InsufficientCreditError extends ToniApiError {}
/** 403 — dem Schlüssel fehlt ein Recht oder eine Stufe. */
export class PermissionError extends ToniApiError {}
/** 409 — `loeschen`/`veroeffentlichen` ohne Bestätigung. */
export class ConfirmationRequiredError extends ToniApiError {}
/** 429 — zu viele Anfragen oder Monatslimit. */
export class RateLimitError extends ToniApiError {}

/** Keine Antwort: Netzwerkfehler oder Zeitgrenze. */
export class ToniConnectionError extends ToniError {}

export function apiError(status: number, body: unknown): ToniApiError {
  const text = `Die Toni API hat mit HTTP ${status} geantwortet.`;
  switch (status) {
    case 401: return new AuthenticationError(status, body, text);
    case 402: return new InsufficientCreditError(status, body, text);
    case 403: return new PermissionError(status, body, text);
    case 409: return new ConfirmationRequiredError(status, body, text);
    case 429: return new RateLimitError(status, body, text);
    default: return new ToniApiError(status, body, text);
  }
}
