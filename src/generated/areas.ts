// ERZEUGT von scripts/generate.mjs aus der OpenAPI-Datei (KI-Markt API 1.0.0-beta). Nicht von Hand ändern.
import type { CallOptions, FunctionResult, PlatformCaller } from '../types.js';

export interface BooksGetBooksParams {
  /** Höchstzahl der Bücher in der Antwort (ganze Zahl). Standard ist 10. Eine Obergrenze erzwingt der Code nicht; wähle für große Bestände sinnvolle Seitengrößen, etwa 20 bis 50. */
  limit?: number;
  /** Anzahl der Bücher, die am Anfang übersprungen werden (ganze Zahl, Standard 0). Zusammen mit `limit` ergibt das die Seiteneinteilung, z. B. `offset` 10 und `limit` 10 für die zweite Seite. */
  offset?: number;
  /** Optionaler Filter auf den Status eines Buchs. Erlaubt laut Schema: `draft`, `published`, `in_progress`. Der Vergleich ist exakt; ohne Angabe (oder bei leerem Wert) werden alle Status geliefert. */
  status?: "draft" | "published" | "in_progress";
  [weiteres: string]: unknown;
}

export interface BooksGetBookParams {
  /** ID des Buchs als ganze Zahl (Pflicht). Die ID ist die Objekt-ID aus `get_books`, `search_books` oder `create_book`. Bücher anderer Unternehmen werden wie nicht vorhanden behandelt. */
  book_id: number;
  [weiteres: string]: unknown;
}

export interface BooksSearchBooksParams {
  /** Suchbegriff als Text (Pflicht). Gesucht wird als Teilstring in Titel, Untertitel und Beschreibung. Leere Werte werden abgelehnt. */
  query: string;
  /** Höchstzahl der Treffer (ganze Zahl, Standard 10). Eine Obergrenze erzwingt der Code nicht. */
  limit?: number;
  /** Anzahl der Treffer, die übersprungen werden (ganze Zahl, Standard 0), für das seitenweise Blättern durch die Trefferliste. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface BooksCreateBookParams {
  /** Titel des Buchs (Pflicht, nicht leer). Er wird als Titel gespeichert und dient als Grundlage des Objektschlüssels. */
  title: string;
  /** Optionaler Untertitel als Text. Wird nur gesetzt, wenn er im Körper vorkommt. */
  subtitle?: string;
  /** Optionaler Name des Autors oder der Autorin als Text. Er erscheint in allen Buchansichten. */
  author?: string;
  /** Optionale Beschreibung oder Klappentext als Text. Die Beschreibung wird auch von `search_books` durchsucht. */
  description?: string;
  /** Optionaler Status. Laut Schema `draft`, `published` oder `in_progress`. Ohne Angabe bleibt der Status leer; setze am besten `draft`, wenn du mit einem Entwurf beginnst. */
  status?: "draft" | "published" | "in_progress";
  [weiteres: string]: unknown;
}

export interface BooksUpdateBookParams {
  /** ID des zu ändernden Buchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören, sonst kommt „Buch nicht gefunden oder kein Zugriff“. */
  book_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht). Dokumentierte Felder: `title`, `subtitle`, `author`, `description`, `status` (`draft`, `published`, `in_progress`), `isbn`, `price` (Zahl), `currency` (z. B. `EUR`), `lang` (z. B. `de`), `category`, `publishDate` und `preorderDate` (jeweils ISO 8601, z. B. `2026-09-01`). Nur enthaltene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface BooksDeleteBookParams {
  /** ID des zu löschenden Buchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören; andernfalls kommt „Buch nicht gefunden oder kein Zugriff“. */
  book_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface BooksCopyBookParams {
  /** ID des Quellbuchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören. */
  book_id: number;
  /** Optionaler Titel der Kopie. Ohne Angabe wird der Originaltitel mit dem Zusatz „ (Kopie)“ verwendet. */
  title?: string;
  /** Wahrheitswert, ob die Kapitel mitkopiert werden. Standard ist `true`; mit `false` wird nur das Buch ohne Kapitel angelegt. */
  include_chapters?: boolean;
  [weiteres: string]: unknown;
}

export interface BooksGetBookChaptersParams {
  /** ID des Buchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören, sonst kommt „Buch nicht gefunden oder kein Zugriff“. */
  book_id: number;
  [weiteres: string]: unknown;
}

export interface BooksCreateChapterParams {
  /** ID des Buchs als ganze Zahl (Pflicht), zu dem das Kapitel gehört. Das Buch muss zu deinem Unternehmen gehören. */
  book_id: number;
  /** Titel des Kapitels als Text (Pflicht, nicht leer). Er dient auch als Grundlage für den internen Objektschlüssel. */
  title: string;
  /** Optionaler Inhalt des Kapitels als Text oder HTML. Ohne Angabe bleibt das Kapitel leer; der Inhalt lässt sich später mit `update_chapter` ergänzen. */
  content?: string;
  /** Optionale Position des Kapitels (ganze Zahl). Ohne Angabe wird das Kapitel hinten angefügt. Bereits vorhandene Positionen werden nicht automatisch umsortiert. */
  order?: number;
  /** Optionaler Status des Kapitels als frei wählbarer Text, z. B. `draft`. Ohne Angabe bleibt der Status leer. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface BooksUpdateChapterParams {
  /** ID des Kapitels als ganze Zahl (Pflicht). Das Kapitel muss zu einem Buch deines Unternehmens gehören. */
  chapter_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht). Erlaubt sind `title`, `subtitle`, `summary`, `introduction`, `content` (Text oder HTML), `order` (ganze Zahl) und `status` (Text). Nur enthaltene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface BooksDeleteChapterParams {
  /** ID des zu löschenden Kapitels als ganze Zahl (Pflicht). Die ID stammt aus `get_book_chapters` oder `create_chapter`; das Kapitel muss zu einem Buch deines Unternehmens gehören. */
  chapter_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface BooksReorderChaptersParams {
  /** ID des Buchs als ganze Zahl (Pflicht). Nur Kapitel dieses Buchs werden umsortiert; Kapitel anderer Bücher in der Liste werden ignoriert. */
  book_id: number;
  /** Liste von Objekten (Pflicht), jeweils mit `chapter_id` (ID des Kapitels) und `order` (neue Position als ganze Zahl). Beispiel: `[{"chapter_id": 9101, "order": 2}, {"chapter_id": 9102, "order": 1}]`. */
  ordering: Array<Record<string, unknown>>;
  [weiteres: string]: unknown;
}

export interface BooksGetBookStatisticsParams {
  [weiteres: string]: unknown;
}

export interface BooksExportBookAsPdfParams {
  /** ID des zu exportierenden Buchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören, sonst kommt „Buch nicht gefunden oder kein Zugriff“. */
  book_id: number;
  [weiteres: string]: unknown;
}

export interface BooksGetIsbnStatusParams {
  /** ID des Buchs als ganze Zahl (Pflicht). Das Buch muss zu deinem Unternehmen gehören, sonst kommt „Buch nicht gefunden oder kein Zugriff“. */
  book_id: number;
  [weiteres: string]: unknown;
}

/** Bücher — Der Bereich books verwaltet die Bücher deines Unternehmens und ihre Kapitel. */
export class BooksArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Bücher auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/get_books`
   */
  getBooks(params?: BooksGetBooksParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'get_books', params, options);
  }

  /**
   * Buch abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/get_book`
   */
  getBook(params: BooksGetBookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'get_book', params, options);
  }

  /**
   * Bücher suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/search_books`
   */
  searchBooks(params: BooksSearchBooksParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'search_books', params, options);
  }

  /**
   * Buch anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/create_book`
   */
  createBook(params: BooksCreateBookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'create_book', params, options);
  }

  /**
   * Buchdaten ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/update_book`
   */
  updateBook(params: BooksUpdateBookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'update_book', params, options);
  }

  /**
   * Buch löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/books/delete_book`
   */
  deleteBook(params: BooksDeleteBookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'delete_book', params, options);
  }

  /**
   * Buch kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/copy_book`
   */
  copyBook(params: BooksCopyBookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'copy_book', params, options);
  }

  /**
   * Kapitel eines Buchs abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/get_book_chapters`
   */
  getBookChapters(params: BooksGetBookChaptersParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'get_book_chapters', params, options);
  }

  /**
   * Kapitel anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/create_chapter`
   */
  createChapter(params: BooksCreateChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'create_chapter', params, options);
  }

  /**
   * Kapitel ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/update_chapter`
   */
  updateChapter(params: BooksUpdateChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'update_chapter', params, options);
  }

  /**
   * Kapitel löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/books/delete_chapter`
   */
  deleteChapter(params: BooksDeleteChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'delete_chapter', params, options);
  }

  /**
   * Kapitelreihenfolge ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/books/reorder_chapters`
   */
  reorderChapters(params: BooksReorderChaptersParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'reorder_chapters', params, options);
  }

  /**
   * Buchstatistiken abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/get_book_statistics`
   */
  getBookStatistics(params?: BooksGetBookStatisticsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'get_book_statistics', params, options);
  }

  /**
   * Buchexport starten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/export_book_as_pdf`
   */
  exportBookAsPdf(params: BooksExportBookAsPdfParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'export_book_as_pdf', params, options);
  }

  /**
   * ISBN-Status prüfen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/books/get_isbn_status`
   */
  getIsbnStatus(params: BooksGetIsbnStatusParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('books', 'get_isbn_status', params, options);
  }
}

export interface AudiobooksGetAudiobooksParams {
  /** Höchstzahl der Hörbücher in der Antwort (ganze Zahl, Standard 10). Eine Obergrenze erzwingt der Code nicht. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang übersprungen werden (ganze Zahl, Standard 0), für das seitenweise Blättern zusammen mit `limit`. */
  offset?: number;
  /** Optionaler Filter auf den Status als Text, z. B. `draft`, `in_production`, `ready`, `processing` oder `error`. Der Vergleich ist exakt; ohne Angabe werden alle Status geliefert. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface AudiobooksGetAudiobookParams {
  /** ID des Hörbuchs als ganze Zahl (Pflicht). Hörbücher anderer Unternehmen werden wie nicht vorhanden behandelt. */
  audiobook_id: number;
  [weiteres: string]: unknown;
}

export interface AudiobooksSearchAudiobooksParams {
  /** Suchbegriff als Text (Pflicht). Gesucht wird als Teilstring in Titel und Beschreibung. Leere Werte werden abgelehnt. */
  query: string;
  /** Höchstzahl der Treffer (ganze Zahl, Standard 10). Eine Obergrenze erzwingt der Code nicht. */
  limit?: number;
  /** Anzahl der Treffer, die übersprungen werden (ganze Zahl, Standard 0), um durch längere Trefferlisten zu blättern. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface AudiobooksCreateAudiobookParams {
  /** Titel des Hörbuchs als Text (Pflicht, nicht leer). Er dient auch als Grundlage für den internen Objektschlüssel. */
  title: string;
  /** Optionaler Untertitel als Text. Leere Werte werden ignoriert. */
  subtitle?: string;
  /** Optionale Beschreibung als Text. Sie wird von `search_audiobooks` mit durchsucht. Leere Werte werden ignoriert. */
  description?: string;
  /** Optionaler Status. Laut Schema `draft`, `in_production` oder `ready`. Ohne Angabe wird `draft` gesetzt. */
  status?: "draft" | "in_production" | "ready";
  [weiteres: string]: unknown;
}

export interface AudiobooksUpdateAudiobookParams {
  /** ID des zu ändernden Hörbuchs als ganze Zahl (Pflicht). Es muss zu deinem Unternehmen gehören, sonst kommt „Hörbuch nicht gefunden oder kein Zugriff“. */
  audiobook_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht). Wirksam sind `title`, `subtitle`, `description`, `status` (z. B. `draft`, `in_production`, `ready`), `publishDate` (ISO 8601, z. B. `2026-09-01`), `price` (Zahl), `currency` (z. B. `EUR`) und `lang` (z. B. `de`). */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AudiobooksDeleteAudiobookParams {
  /** ID des zu löschenden Hörbuchs als ganze Zahl (Pflicht). Das Hörbuch muss zu deinem Unternehmen gehören; andernfalls kommt „Hörbuch nicht gefunden oder kein Zugriff“. */
  audiobook_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface AudiobooksGetAudiobookChaptersParams {
  /** ID des Hörbuchs als ganze Zahl (Pflicht). Es muss zu deinem Unternehmen gehören, sonst kommt „Hörbuch nicht gefunden oder kein Zugriff“. */
  audiobook_id: number;
  [weiteres: string]: unknown;
}

export interface AudiobooksCreateAudiobookChapterParams {
  /** ID des Hörbuchs als ganze Zahl (Pflicht), zu dem das Kapitel gehört. Es muss zu deinem Unternehmen gehören. */
  audiobook_id: number;
  /** Titel des Kapitels als Text (Pflicht, nicht leer). Er dient auch als Grundlage für den internen Objektschlüssel. */
  title: string;
  /** Optionaler Kapiteltext als Text. Er ist die Grundlage für die spätere Sprachausgabe. Leere Werte werden ignoriert. */
  content?: string;
  /** Optionale Position des Kapitels (ganze Zahl, größer als 0). Ohne Angabe oder bei 0 wird das Kapitel hinten angefügt. */
  order?: number;
  /** Optionaler Status als Text; üblich sind `draft`, `ready` und `error`. Ohne Angabe wird `draft` gesetzt. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface AudiobooksUpdateAudiobookChapterParams {
  /** ID des Kapitels als ganze Zahl (Pflicht). Das zugehörige Hörbuch muss zu deinem Unternehmen gehören. */
  chapter_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht). Wirksam sind `title`, `content` (Text), `order` (ganze Zahl), `status` (Text, z. B. `draft`, `ready`, `error`) und `summary` (Text). Nur enthaltene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AudiobooksDeleteAudiobookChapterParams {
  /** ID des zu löschenden Kapitels als ganze Zahl (Pflicht). Die ID stammt aus `get_audiobook_chapters` oder `create_audiobook_chapter`. */
  chapter_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface AudiobooksCreateChapterAudioParams {
  /** ID des Kapitels als ganze Zahl (Pflicht). Das zugehörige Hörbuch muss zu deinem Unternehmen gehören. */
  chapter_id: number;
  /** Optionaler Persönlichkeitstyp, auf den der Text abgestimmt wird. Bekannt sind `traditionalist`, `performer`, `harmoniser`, `stimulant`, `hedonist`, `adventurer` und `disciplined`. Ohne Angabe gilt der am Hörbuch hinterlegte Typ, sonst `performer`; unbekannte Werte fallen auf `performer` zurück. */
  limbic_type?: string;
  /** Optionale ID eines linguistischen Profils. Im aktuellen Stand wird der Wert entgegengenommen, hat auf das Ergebnis aber keine Wirkung, weil beim Aufbereiten kein Profil angewendet wird. */
  linguistic_id?: number;
  [weiteres: string]: unknown;
}

/** Hörbücher — Der Bereich audiobooks verwaltet die Hörbücher deines Unternehmens und ihre Kapitel. */
export class AudiobooksArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Hörbücher auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/audiobooks/get_audiobooks`
   */
  getAudiobooks(params?: AudiobooksGetAudiobooksParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'get_audiobooks', params, options);
  }

  /**
   * Hörbuch abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/audiobooks/get_audiobook`
   */
  getAudiobook(params: AudiobooksGetAudiobookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'get_audiobook', params, options);
  }

  /**
   * Hörbücher suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/audiobooks/search_audiobooks`
   */
  searchAudiobooks(params: AudiobooksSearchAudiobooksParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'search_audiobooks', params, options);
  }

  /**
   * Hörbuch anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/audiobooks/create_audiobook`
   */
  createAudiobook(params: AudiobooksCreateAudiobookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'create_audiobook', params, options);
  }

  /**
   * Hörbuchdaten ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/audiobooks/update_audiobook`
   */
  updateAudiobook(params: AudiobooksUpdateAudiobookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'update_audiobook', params, options);
  }

  /**
   * Hörbuch löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/audiobooks/delete_audiobook`
   */
  deleteAudiobook(params: AudiobooksDeleteAudiobookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'delete_audiobook', params, options);
  }

  /**
   * Kapitel eines Hörbuchs abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/audiobooks/get_audiobook_chapters`
   */
  getAudiobookChapters(params: AudiobooksGetAudiobookChaptersParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'get_audiobook_chapters', params, options);
  }

  /**
   * Hörbuch-Kapitel anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/audiobooks/create_audiobook_chapter`
   */
  createAudiobookChapter(params: AudiobooksCreateAudiobookChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'create_audiobook_chapter', params, options);
  }

  /**
   * Hörbuch-Kapitel ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/audiobooks/update_audiobook_chapter`
   */
  updateAudiobookChapter(params: AudiobooksUpdateAudiobookChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'update_audiobook_chapter', params, options);
  }

  /**
   * Hörbuch-Kapitel löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/audiobooks/delete_audiobook_chapter`
   */
  deleteAudiobookChapter(params: AudiobooksDeleteAudiobookChapterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'delete_audiobook_chapter', params, options);
  }

  /**
   * Kapiteltext für Sprachausgabe aufbereiten
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/audiobooks/create_chapter_audio`
   */
  createChapterAudio(params: AudiobooksCreateChapterAudioParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('audiobooks', 'create_chapter_audio', params, options);
  }
}

export interface PodcastsGetPodcastsParams {
  /** Maximale Anzahl der Podcasts in dieser Antwort als ganze Zahl. Standard ist 10. Eine Obergrenze wird nicht erzwungen; wähle für Seiteneinteilung eine feste Größe und erhöhe `offset` entsprechend. */
  limit?: number;
  /** Anzahl der Podcasts, die am Anfang der Sortierung (neueste zuerst) übersprungen werden. Standard ist 0. Für die zweite Seite mit `limit` 10 setzt du 10. */
  offset?: number;
  /** Optionaler Filter auf den Status des Podcasts, z. B. `active`, `draft` oder `archived`. Es wird exakt verglichen; nicht vorhandene Werte liefern eine leere Liste. Ohne Angabe werden alle Status geliefert. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface PodcastsGetPodcastParams {
  /** Numerische ID des Podcasts, wie sie `get_podcasts`, `search_podcasts` oder `create_podcast` als `id` zurückgeben. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastsSearchPodcastsParams {
  /** Suchbegriff, der als Teilstring in Titel oder Beschreibung des Podcasts vorkommen muss. Pflichtangabe; leere Texte werden abgelehnt. */
  query: string;
  /** Maximale Anzahl der Treffer als ganze Zahl. Standard ist 10. Ohne Obergrenze; für große Treffermengen in Seiten abrufen. */
  limit?: number;
  /** Anzahl der Treffer, die am Anfang der alphabetischen Sortierung übersprungen werden. Standard ist 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface PodcastsCreatePodcastParams {
  /** Titel des Podcasts als Text. Pflichtangabe; er wird auch zur Bildung der internen Objektbezeichnung verwendet. */
  title: string;
  /** Optionaler Untertitel (Kurzbeschreibung) des Podcasts. Ohne Angabe bleibt das Feld leer. */
  subtitle?: string;
  /** Optionale ausführliche Beschreibung der Sendung, wie sie z. B. im Feed erscheint. Ohne Angabe bleibt das Feld leer. */
  description?: string;
  /** Optionaler Status des Podcasts. Dokumentiert sind `active`, `draft` und `archived`; Standard ist `active`. Der Wert wird nicht gegen eine Liste geprüft. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface PodcastsUpdatePodcastParams {
  /** Numerische ID des zu ändernden Podcasts. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  /** Objekt mit den zu ändernden Feldern. Erlaubte Schlüssel: `title`, `subtitle`, `description`, `status`, `podcastlanguage`, `frequency`, `website`, `primary_category`, `secondary_category`. Werte sind Zeichenketten, z. B. {"status": "archived"}. Nicht aufgeführte Schlüssel haben keine Wirkung. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface PodcastsDeletePodcastParams {
  /** Numerische ID des zu löschenden Podcasts. Pflichtangabe; der Podcast muss zu deiner Firma gehören, sonst kommt „Podcast nicht gefunden oder kein Zugriff“. */
  podcast_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface PodcastsCopyPodcastParams {
  /** Numerische ID des Podcasts, der kopiert werden soll. Pflichtangabe; er muss zu deiner Firma gehören. */
  podcast_id: number;
  /** Optionaler Titel der Kopie. Ohne Angabe wird „<Originaltitel> (Kopie)“ verwendet. */
  title?: string;
  /** Wahrheitswert. Bei `true` werden auch die Episodentexte des Originals kopiert, bei `false` (Standard) entsteht ein Podcast ohne Episoden. */
  include_episodes?: boolean;
  [weiteres: string]: unknown;
}

export interface PodcastsGetEpisodesParams {
  /** Numerische ID des Podcasts, dessen Episoden geliefert werden. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastsGetEpisodeParams {
  /** Numerische ID der Episode, wie sie `get_episodes`, `search_episodes` oder `create_episode` als `id` liefern. Pflichtangabe. */
  episode_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastsSearchEpisodesParams {
  /** Suchbegriff, der als Teilstring in Titel oder Beschreibung der Episode vorkommen muss. Pflichtangabe; leere Texte werden abgelehnt. */
  query: string;
  /** Maximale Anzahl der Treffer als ganze Zahl. Standard ist 10; es gibt keine feste Obergrenze. */
  limit?: number;
  /** Anzahl der Treffer, die am Anfang der Sortierung (neueste zuerst) übersprungen werden. Standard ist 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface PodcastsCreateEpisodeParams {
  /** Numerische ID des Podcasts, zu dem die Episode gehört. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  /** Titel der Episode. Pflichtangabe; er wird auch zur Bildung der internen Objektbezeichnung verwendet. */
  title: string;
  /** Optionale Folgennummer als ganze Zahl. Ohne Angabe wird die Zahl der vorhandenen Episoden des Podcasts plus 1 verwendet. */
  number?: number;
  /** Optionale Beschreibung der Episode. Ohne Angabe bleibt das Feld leer. */
  description?: string;
  [weiteres: string]: unknown;
}

export interface PodcastsUpdateEpisodeParams {
  /** Numerische ID der zu ändernden Episode. Pflichtangabe; die Episode muss zu einem Podcast deiner Firma gehören. */
  episode_id: number;
  /** Objekt mit den zu ändernden Feldern. Erlaubte Schlüssel: `title`, `description`, `summary`, `shownotes` (Texte), `number` (ganze Zahl), `status` (Fortschrittsstatus als Text) und `publishing_date` (Datum/Zeit, z. B. `2026-11-20T06:00:00+01:00`). Andere Schlüssel haben keine Wirkung. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface PodcastsDeleteEpisodeParams {
  /** Numerische ID der zu löschenden Episode. Pflichtangabe; unbekannte IDs ergeben die Fehlermeldung „Episode nicht gefunden“. */
  episode_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface PodcastsGetEpisodeStatsParams {
  /** Numerische ID des Podcasts, für den die Kennzahlen berechnet werden. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastsGetRssFeedParams {
  /** Numerische ID des Podcasts, dessen Feed-Link ermittelt wird. Pflichtangabe; der Podcast muss zu deiner Firma gehören. */
  podcast_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastsScheduleEpisodeParams {
  /** Numerische ID der Episode, die eingeplant werden soll. Pflichtangabe; sie muss zu einem Podcast deiner Firma gehören. */
  episode_id: number;
  /** Gewünschter Veröffentlichungszeitpunkt als Text, bevorzugt ISO-8601 mit Zeitzone, z. B. `2026-11-20T06:00:00+01:00`. Pflichtangabe. Ohne Zeitzone wird die Server-Zeitzone angenommen. */
  publish_at: string;
  [weiteres: string]: unknown;
}

/** Podcasts — Der Bereich podcasts verwaltet die Podcasts deines Unternehmens und ihre Episoden. */
export class PodcastsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Podcasts auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_podcasts`
   */
  getPodcasts(params?: PodcastsGetPodcastsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_podcasts', params, options);
  }

  /**
   * Podcast-Details abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_podcast`
   */
  getPodcast(params: PodcastsGetPodcastParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_podcast', params, options);
  }

  /**
   * Podcasts suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/search_podcasts`
   */
  searchPodcasts(params: PodcastsSearchPodcastsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'search_podcasts', params, options);
  }

  /**
   * Podcast anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/create_podcast`
   */
  createPodcast(params: PodcastsCreatePodcastParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'create_podcast', params, options);
  }

  /**
   * Podcast aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/update_podcast`
   */
  updatePodcast(params: PodcastsUpdatePodcastParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'update_podcast', params, options);
  }

  /**
   * Podcast löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/podcasts/delete_podcast`
   */
  deletePodcast(params: PodcastsDeletePodcastParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'delete_podcast', params, options);
  }

  /**
   * Podcast kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/copy_podcast`
   */
  copyPodcast(params: PodcastsCopyPodcastParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'copy_podcast', params, options);
  }

  /**
   * Episoden eines Podcasts
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_episodes`
   */
  getEpisodes(params: PodcastsGetEpisodesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_episodes', params, options);
  }

  /**
   * Episode-Details abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_episode`
   */
  getEpisode(params: PodcastsGetEpisodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_episode', params, options);
  }

  /**
   * Episoden suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/search_episodes`
   */
  searchEpisodes(params: PodcastsSearchEpisodesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'search_episodes', params, options);
  }

  /**
   * Episode anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/create_episode`
   */
  createEpisode(params: PodcastsCreateEpisodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'create_episode', params, options);
  }

  /**
   * Episode aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/update_episode`
   */
  updateEpisode(params: PodcastsUpdateEpisodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'update_episode', params, options);
  }

  /**
   * Episode löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/podcasts/delete_episode`
   */
  deleteEpisode(params: PodcastsDeleteEpisodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'delete_episode', params, options);
  }

  /**
   * Episoden-Kennzahlen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_episode_stats`
   */
  getEpisodeStats(params: PodcastsGetEpisodeStatsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_episode_stats', params, options);
  }

  /**
   * RSS-Feed-Link abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcasts/get_rss_feed`
   */
  getRssFeed(params: PodcastsGetRssFeedParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'get_rss_feed', params, options);
  }

  /**
   * Episode einplanen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/podcasts/schedule_episode`
   */
  scheduleEpisode(params: PodcastsScheduleEpisodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcasts', 'schedule_episode', params, options);
  }
}

export interface PodcastGuestsGetPodcastGaesteParams {
  /** Numerische ID des Podcasts. Ohne Angabe liefert die Funktion stattdessen die Liste aller Podcasts der Firma mit Gästezahl. Ein unbekannter oder fremder Podcast ergibt den Fehler „Podcast nicht gefunden.“ */
  podcast_id?: number;
  /** Optionaler Filter auf eine Phase: `eingeladen`, `vorbereitung`, `aufnahme`, `nachbereitung` oder `abgesagt`. Wirkt nur zusammen mit `podcast_id`; ohne Filter werden alle Phasen geliefert. */
  status?: "eingeladen" | "vorbereitung" | "aufnahme" | "nachbereitung" | "abgesagt";
  [weiteres: string]: unknown;
}

export interface PodcastGuestsGetPodcastAufnahmetageParams {
  /** Numerische ID des Podcasts, dessen Aufnahmetage geliefert werden. Pflichtangabe; der Podcast muss zu deiner Firma gehören, sonst kommt „Podcast nicht gefunden.“ */
  podcast_id: number;
  [weiteres: string]: unknown;
}

export interface PodcastGuestsFindPodcastGastKandidatenParams {
  /** Suchtext (mindestens 2 Zeichen): Teil eines Namens, einer Firma oder einer E-Mail-Adresse. Pflichtangabe. Kürzere Eingaben liefern eine leere Trefferliste. Das Zeichen `%` und `_` werden wörtlich gesucht. */
  query: string;
  [weiteres: string]: unknown;
}

/** Podcast-Gäste — Der Bereich podcast_guests gibt dir einen lesenden Überblick über die Gästeorganisation deiner Podcasts: Welche Gäste (Interviewpartner) sind eingeladen, wo stehen sie im Ablauf, wann und wo ist ihr Aufnahmetermin, und an welchen Aufnahmetagen sind noch Slots frei? */
export class PodcastGuestsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Podcast-Gäste auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcast_guests/get_podcast_gaeste`
   */
  getPodcastGaeste(params?: PodcastGuestsGetPodcastGaesteParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcast_guests', 'get_podcast_gaeste', params, options);
  }

  /**
   * Kommende Aufnahmetage
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcast_guests/get_podcast_aufnahmetage`
   */
  getPodcastAufnahmetage(params: PodcastGuestsGetPodcastAufnahmetageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcast_guests', 'get_podcast_aufnahmetage', params, options);
  }

  /**
   * Gast-Kandidaten suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/podcast_guests/find_podcast_gast_kandidaten`
   */
  findPodcastGastKandidaten(params: PodcastGuestsFindPodcastGastKandidatenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('podcast_guests', 'find_podcast_gast_kandidaten', params, options);
  }
}

export interface StoriesGetStoriesParams {
  /** Optionaler Filter auf den Status der Story, z. B. `draft` oder `published`. Der Wert wird exakt verglichen; ohne Angabe kommen Stories mit jedem Status. */
  status?: string;
  /** Maximale Anzahl Stories je Antwort. Standard ist 20, kleinere Werte als 1 werden auf 1 angehoben. Ganzzahl. */
  limit?: number;
  /** Anzahl der Stories, die am Anfang übersprungen werden, für das Blättern (Standard 0). Zusammen mit `limit` und `total` aus der Antwort kannst du alle Seiten abrufen. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface StoriesGetStoryParams {
  /** ID der Story als Ganzzahl. Pflichtangabe; die ID stammt aus `get_stories` oder `create_story`. Die Story muss zu deinem Unternehmen gehören. */
  story_id: number;
  [weiteres: string]: unknown;
}

export interface StoriesCreateStoryParams {
  /** Objekt mit den Feldern der Story. Erlaubt sind: `title` (Titel), `subtitle` (Untertitel), `content` (Text, HTML möglich), `status` (Status der Story; im Datenmodell vorgesehen sind `draft`, `review`, `approved`, `published`, `archived`), `storyfilter_id` (Ganzzahl, ID eines Storyfilters), `linguistic_id` (Ganzzahl, ID eines Sprachprofils), `target_channel` (Zielkanal; vorgesehen sind `website_homepage`, `website_landingpage`, `website_blog`, `email_newsletter`, `email_sequence`, `social_media_post`, `linkedin_post`, `facebook_post`, `instagram_post`, `xing_post`) und `hashtags` (ein Text, z. B. `#gastro #stammkunden`). Felder, die du weglässt oder mit `null` übergibst, bleiben unverändert; ein leerer Text `""` überschreibt den Wert. Die Felder dürfen auch direkt im Körper stehen, ohne `data` – der Server verpackt sie dann selbst. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface StoriesUpdateStoryParams {
  /** ID der zu ändernden Story als Ganzzahl. Pflichtangabe; die Story muss zu deinem Unternehmen gehören. */
  story_id: number;
  /** Objekt mit den Feldern der Story. Erlaubt sind: `title` (Titel), `subtitle` (Untertitel), `content` (Text, HTML möglich), `status` (Status der Story; im Datenmodell vorgesehen sind `draft`, `review`, `approved`, `published`, `archived`), `storyfilter_id` (Ganzzahl, ID eines Storyfilters), `linguistic_id` (Ganzzahl, ID eines Sprachprofils), `target_channel` (Zielkanal; vorgesehen sind `website_homepage`, `website_landingpage`, `website_blog`, `email_newsletter`, `email_sequence`, `social_media_post`, `linkedin_post`, `facebook_post`, `instagram_post`, `xing_post`) und `hashtags` (ein Text, z. B. `#gastro #stammkunden`). Felder, die du weglässt oder mit `null` übergibst, bleiben unverändert; ein leerer Text `""` überschreibt den Wert. Die Felder dürfen auch direkt im Körper stehen, ohne `data` – der Server verpackt sie dann selbst. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface StoriesDeleteStoryParams {
  /** ID der zu löschenden Story als Ganzzahl. Pflichtangabe; die Story muss zu deinem Unternehmen gehören und wird unwiderruflich entfernt. */
  story_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface StoriesGetStoryfiltersParams {
  [weiteres: string]: unknown;
}

export interface StoriesCreateStoryfilterParams {
  /** Objekt mit den Feldern des Storyfilters. Erlaubt sind: `title`, `description`, `core_message` (Kernbotschaft), `a_character` (Charakter, Heldenreise A), `b_wish` (Wunsch, B), `d_external_problem` (äußeres Problem, D), `e_internal_problem` (inneres Problem, E), `g_mentor_character` (Mentor, G), `value_proposition` (Wertversprechen), `customer_benefit` (Kundennutzen) und `expected_results` (erwartete Ergebnisse). Alle Werte sind Texte. Felder, die du weglässt oder mit `null` übergibst, bleiben unverändert; ein leerer Text überschreibt den Wert. Die Felder dürfen auch direkt im Körper stehen, ohne `data` – der Server verpackt sie dann selbst. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface StoriesUpdateStoryfilterParams {
  /** ID des zu ändernden Storyfilters als Ganzzahl. Pflichtangabe; den Filter findest du mit `get_storyfilters`. Er muss zu deinem Unternehmen gehören. */
  storyfilter_id: number;
  /** Objekt mit den Feldern des Storyfilters. Erlaubt sind: `title`, `description`, `core_message` (Kernbotschaft), `a_character` (Charakter, Heldenreise A), `b_wish` (Wunsch, B), `d_external_problem` (äußeres Problem, D), `e_internal_problem` (inneres Problem, E), `g_mentor_character` (Mentor, G), `value_proposition` (Wertversprechen), `customer_benefit` (Kundennutzen) und `expected_results` (erwartete Ergebnisse). Alle Werte sind Texte. Felder, die du weglässt oder mit `null` übergibst, bleiben unverändert; ein leerer Text überschreibt den Wert. Die Felder dürfen auch direkt im Körper stehen, ohne `data` – der Server verpackt sie dann selbst. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

/** Magazin und Storyfilter — Der Bereich Magazin und Storyfilter verwaltet zwei Arten von Objekten deines Unternehmens: Stories (Magazin-Beiträge mit Titel, Untertitel, Text, Status, Zielkanal und Hashtags) und Storyfilter (Vorgaben für das Erzählen: Zielperson, Wunsch, Probleme, Mentor, Wertversprechen und Nutzen nach dem Heldenreise-Schema A–G). */
export class StoriesArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Stories auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/stories/get_stories`
   */
  getStories(params?: StoriesGetStoriesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'get_stories', params, options);
  }

  /**
   * Story abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/stories/get_story`
   */
  getStory(params: StoriesGetStoryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'get_story', params, options);
  }

  /**
   * Story anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/stories/create_story`
   */
  createStory(params: StoriesCreateStoryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'create_story', params, options);
  }

  /**
   * Story ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/stories/update_story`
   */
  updateStory(params: StoriesUpdateStoryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'update_story', params, options);
  }

  /**
   * Story löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/stories/delete_story`
   */
  deleteStory(params: StoriesDeleteStoryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'delete_story', params, options);
  }

  /**
   * Storyfilter auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/stories/get_storyfilters`
   */
  getStoryfilters(params?: StoriesGetStoryfiltersParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'get_storyfilters', params, options);
  }

  /**
   * Storyfilter anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/stories/create_storyfilter`
   */
  createStoryfilter(params: StoriesCreateStoryfilterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'create_storyfilter', params, options);
  }

  /**
   * Storyfilter ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/stories/update_storyfilter`
   */
  updateStoryfilter(params: StoriesUpdateStoryfilterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('stories', 'update_storyfilter', params, options);
  }
}

export interface LandingpagesGetTemplatesParams {
  /** Optionaler Filter auf den Status des Templates, z. B. `draft` oder `active`. Wird exakt verglichen. */
  status?: string;
  /** Optionaler Suchtext; gefunden werden Templates, deren Name oder Slug diesen Text enthalten (Teilstring, Groß-/Kleinschreibung egal). */
  search?: string;
  /** Variante, auf die gefiltert wird. Standard ist `landingpage`; Templates ohne Variante werden immer mitgeliefert. Andere Werte sind z. B. `interview` oder `landingcard`. */
  variant?: string;
  /** Wahrheitswert. Bei `true` (Standard) werden zuerst die globalen Katalog-Templates aufgeführt, bei `false` nur die Templates deines Unternehmens. */
  include_catalog?: boolean;
  /** Maximale Anzahl Einträge je Antwort. Standard 20, Werte unter 1 werden auf 1 angehoben. Ganzzahl. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der zusammengeführten Liste übersprungen werden (Standard 0). */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetTemplateParams {
  /** ID des Templates als Ganzzahl. Pflichtangabe; das Template muss zu deinem Unternehmen gehören. */
  template_id: number;
  [weiteres: string]: unknown;
}

export interface LandingpagesCreateTemplateParams {
  /** Interner Name des Templates. Pflichtangabe, Text; HTML-Zeichen werden maskiert. */
  name: string;
  /** Optionaler Slug für URLs. Ohne Angabe wird er aus dem Namen abgeleitet. Der Slug wird vereinfacht: Kleinbuchstaben, alle Zeichen außer `a–z`, `0–9` und `-` werden zu `-` (auch Umlaute), Bindestriche am Rand entfallen. Bleibt nichts übrig, wird `template-<Zeitstempel>` verwendet. */
  slug?: string;
  /** Status des neuen Templates als Text, z. B. `draft` oder `active`. Standard ist `draft`. */
  status?: string;
  /** Template-Variante als Text. Standard ist `landingpage`. */
  variant?: string;
  /** Objekt mit den Farben des Templates. Erlaubte Schlüssel: `body_color` (Textfarbe), `body_background` (Seitenhintergrund), `primary` (Primärfarbe) und `secondary` (Sekundärfarbe), jeweils als Text, üblicherweise Hex-Wert wie `#1d4ed8`. Nicht angegebene Schlüssel bleiben unverändert beziehungsweise leer. */
  colors?: Record<string, unknown>;
  /** Objekt mit den Meta-Angaben für Suchmaschinen: `title` (Seitentitel) und `description` (Beschreibung). Beide sind Texte; nicht angegebene Schlüssel bleiben unverändert. */
  meta?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingpagesUpdateTemplateParams {
  /** ID des zu ändernden Templates als Ganzzahl. Pflichtangabe; das Template muss zu deinem Unternehmen gehören. */
  template_id: number;
  /** Objekt mit den zu ändernden Feldern. Erlaubt: `name`, `slug`, `status`, `variant` (jeweils Text), `colors` (Objekt mit `body_color`, `body_background`, `primary`, `secondary`) und `meta` (Objekt mit `title`, `description`). Nur angegebene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingpagesDeleteTemplateParams {
  /** ID des zu löschenden Templates als Ganzzahl. Pflichtangabe; das Template muss zu deinem Unternehmen gehören und wird unwiderruflich entfernt. */
  template_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface LandingpagesCopyTemplateParams {
  /** ID des Quell-Templates als Ganzzahl. Pflichtangabe; das Template muss zu deinem Unternehmen gehören. */
  template_id: number;
  /** Optionaler Name der Kopie. Ohne Angabe wird „<Name> (Kopie)“ verwendet. */
  name?: string;
  /** Optionaler Slug der Kopie. Ohne Angabe wird der Slug des Originals mit `-copy` verwendet. Der Slug wird vereinfacht: Kleinbuchstaben, alle Zeichen außer `a–z`, `0–9` und `-` werden zu `-` (auch Umlaute), Bindestriche am Rand entfallen. Bleibt nichts übrig, wird `template-<Zeitstempel>` verwendet. */
  slug?: string;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetPortalsParams {
  /** Optionaler Filter auf den Status des Portals. Im Datenmodell vorgesehen sind `draft` und `public`; der Wert wird exakt verglichen. */
  status?: string;
  /** Maximale Anzahl Portale je Antwort. Standard 20, Werte unter 1 werden auf 1 angehoben. */
  limit?: number;
  /** Anzahl der Portale, die am Anfang übersprungen werden (Standard 0), für das Blättern zusammen mit `total`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetPortalParams {
  /** ID des Portals als Ganzzahl. Pflichtangabe; das Portal muss zu deinem Unternehmen gehören. */
  portal_id: number;
  [weiteres: string]: unknown;
}

export interface LandingpagesCreatePortalParams {
  /** Titel des Portals. Pflichtangabe, Text. */
  title: string;
  /** Optionaler Slug für die URL des Portals. Ohne Angabe wird er aus dem Titel abgeleitet. Der Slug wird vereinfacht: Kleinbuchstaben, alle Zeichen außer `a–z`, `0–9` und `-` werden zu `-` (auch Umlaute), Bindestriche am Rand entfallen. Bleibt nichts übrig, wird `template-<Zeitstempel>` verwendet. */
  slug?: string;
  /** Status des Portals als Text. Standard `draft`; im Datenmodell vorgesehen sind `draft` und `public`. */
  status?: string;
  /** Optionale Domain oder Subdomain, unter der das Portal erreichbar sein soll, z. B. `ratgeber.example.com`. Standard ist leer. */
  domain?: string;
  /** Sprachcode des Portals, z. B. `de` oder `en`. Standard ist `de`. */
  lang?: string;
  /** ID eines vorhandenen Templates deines Unternehmens, das dem Portal zugewiesen wird. Hat Vorrang vor `create_template`. */
  template_id?: number;
  /** ID eines vorhandenen Keywords deines Unternehmens (siehe `get_keywords`), mit dem das Portal verknüpft wird. */
  keyword_id?: number;
  /** Objekt mit den Meta-Angaben für Suchmaschinen: `title` (Seitentitel) und `description` (Beschreibung). Beide sind Texte; nicht angegebene Schlüssel bleiben unverändert. */
  meta?: Record<string, unknown>;
  /** Wahrheitswert. Bei `true` und ohne `template_id` wird zusätzlich ein neues Template mit dem Namen „<Titel> Template“ (Variante `landingpage`) angelegt und dem Portal zugewiesen. */
  create_template?: boolean;
  [weiteres: string]: unknown;
}

export interface LandingpagesUpdatePortalParams {
  /** ID des zu ändernden Portals als Ganzzahl. Pflichtangabe; das Portal muss zu deinem Unternehmen gehören. */
  portal_id: number;
  /** Objekt mit den zu ändernden Feldern. Erlaubt: `title`, `slug`, `status`, `domain`, `lang` (Texte), `keyword_id` und `template_id` (Ganzzahlen, `0` löst die Verknüpfung) sowie `meta` (Objekt mit `title`, `description`). Nur angegebene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingpagesDeletePortalParams {
  /** ID des zu löschenden Portals als Ganzzahl. Pflichtangabe; das Portal muss zu deinem Unternehmen gehören und wird unwiderruflich entfernt. */
  portal_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetKeywordsParams {
  /** Optionaler Filter auf die ID einer Keyword-Gruppe (Ganzzahl). Es werden nur Keywords dieser Gruppe geliefert. */
  group_id?: number;
  /** Maximale Anzahl Keywords je Antwort. Standard 25, Werte unter 1 werden auf 1 angehoben. */
  limit?: number;
  /** Anzahl der Keywords, die am Anfang übersprungen werden (Standard 0), zum Blättern zusammen mit `total`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface LandingpagesSearchKeywordsParams {
  /** Suchtext. Pflichtangabe. Treffer sind Keywords, deren Begriff oder Vorschlagstext diesen Text enthalten; derselbe Text dient als Ausgangspunkt für die Vorschläge. */
  query: string;
  /** Maximale Gesamtzahl Einträge (gespeicherte Treffer plus Vorschläge). Standard 15, Werte unter 1 werden auf 1 angehoben. */
  limit?: number;
  /** Wahrheitswert. Bei `true` (Standard) wird die Liste mit Vorschlägen der Autovervollständigung aufgefüllt, solange weniger als `limit` Einträge vorhanden sind; bei `false` kommen nur gespeicherte Keywords. */
  include_suggestions?: boolean;
  [weiteres: string]: unknown;
}

export interface LandingpagesCreateKeywordParams {
  /** Der Suchbegriff als Text. Pflichtangabe; HTML-Zeichen werden maskiert. */
  keyword: string;
  /** Optionaler Vorschlagstext, z. B. die ausführlichere Suchanfrage. Standard ist leer. */
  suggest?: string;
  /** Monatliches Suchvolumen als Ganzzahl. Optional; ohne Angabe bleibt das Feld leer. */
  search_volume?: number;
  /** Durchschnittlicher Klickpreis als Zahl (die Währung wird nicht gespeichert; bei Abfragen wird USD angenommen). Optional. */
  cpc?: number;
  /** Hauptintention des Suchbegriffs als Text, z. B. `informational`, `commercial` oder `transactional`. Standard ist `informational`. */
  main_intent?: string;
  /** ID einer Keyword-Gruppe, der das Keyword zugeordnet wird (Ganzzahl). Optional. */
  group_id?: number;
  /** Sprachcode des Keywords, z. B. `de`. Standard ist `de`. */
  lang?: string;
  /** Konkurrenzgrad als Text, z. B. `LOW`, `MEDIUM` oder `HIGH`. Optional; der Wert wird nicht geprüft. */
  competition_level?: string;
  [weiteres: string]: unknown;
}

export interface LandingpagesUpdateKeywordParams {
  /** ID des zu ändernden Keywords als Ganzzahl. Pflichtangabe; das Keyword muss zu deinem Unternehmen gehören. */
  keyword_id: number;
  /** Objekt mit den zu ändernden Feldern. Erlaubt: `keyword`, `suggest`, `lang`, `main_intent`, `competition_level` (Texte), `search_volume` (Ganzzahl), `cpc` (Zahl) und `group_id` (Ganzzahl, `0` löst die Gruppe). Nur angegebene Felder werden geändert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingpagesDeleteKeywordParams {
  /** ID des zu löschenden Keywords als Ganzzahl. Pflichtangabe; das Keyword muss zu deinem Unternehmen gehören und wird unwiderruflich entfernt. */
  keyword_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetKeywordSearchVolumeParams {
  /** Der Suchbegriff als Text. Wird verwendet, wenn `keyword_id` fehlt oder am gespeicherten Keyword kein Suchvolumen hinterlegt ist. Eines der beiden Felder ist erforderlich. */
  keyword?: string;
  /** Alternativ zu `keyword`: ID eines gespeicherten Keywords deines Unternehmens. Ist dort ein Suchvolumen eingetragen, wird es ohne externe Abfrage zurückgegeben. */
  keyword_id?: number;
  /** Region der Abfrage. `germany` (Standard) fragt Deutschland ab, `dubai` oder `uae` die Vereinigten Arabischen Emirate; jeder andere Wert führt beide Abfragen zusammen. */
  location?: string;
  [weiteres: string]: unknown;
}

export interface LandingpagesGetKeywordCpcParams {
  /** Der Suchbegriff als Text. Wird verwendet, wenn `keyword_id` fehlt oder am gespeicherten Keyword kein CPC hinterlegt ist. Eines der beiden Felder ist erforderlich. */
  keyword?: string;
  /** Alternativ zu `keyword`: ID eines gespeicherten Keywords deines Unternehmens. Ist dort ein CPC eingetragen, wird er ohne externe Abfrage zurückgegeben. */
  keyword_id?: number;
  /** Region der Abfrage. `germany` (Standard) fragt Deutschland ab, `dubai` oder `uae` die Vereinigten Arabischen Emirate; jeder andere Wert führt beide Abfragen zusammen. */
  location?: string;
  [weiteres: string]: unknown;
}

/** Landingpages — Der Bereich Landingpages umfasst drei Objektarten deines Unternehmens: Templates (Vorlagen mit Name, Slug, Variante, Farben und Meta-Angaben), Portale (veröffentlichbare Landingpage-Portale mit Titel, Slug, Domain, Sprache und Status, optional mit einem Template und einem Keyword verknüpft) und Keywords (Suchbegriffe mit Suchvolumen, CPC, Intention und Gruppe). */
export class LandingpagesArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Templates auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_templates`
   */
  getTemplates(params?: LandingpagesGetTemplatesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_templates', params, options);
  }

  /**
   * Template abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_template`
   */
  getTemplate(params: LandingpagesGetTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_template', params, options);
  }

  /**
   * Template anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/create_template`
   */
  createTemplate(params: LandingpagesCreateTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'create_template', params, options);
  }

  /**
   * Template ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/update_template`
   */
  updateTemplate(params: LandingpagesUpdateTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'update_template', params, options);
  }

  /**
   * Template löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/landingpages/delete_template`
   */
  deleteTemplate(params: LandingpagesDeleteTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'delete_template', params, options);
  }

  /**
   * Template kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/copy_template`
   */
  copyTemplate(params: LandingpagesCopyTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'copy_template', params, options);
  }

  /**
   * Portale auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_portals`
   */
  getPortals(params?: LandingpagesGetPortalsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_portals', params, options);
  }

  /**
   * Portal abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_portal`
   */
  getPortal(params: LandingpagesGetPortalParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_portal', params, options);
  }

  /**
   * Portal anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/create_portal`
   */
  createPortal(params: LandingpagesCreatePortalParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'create_portal', params, options);
  }

  /**
   * Portal ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/update_portal`
   */
  updatePortal(params: LandingpagesUpdatePortalParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'update_portal', params, options);
  }

  /**
   * Portal löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/landingpages/delete_portal`
   */
  deletePortal(params: LandingpagesDeletePortalParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'delete_portal', params, options);
  }

  /**
   * Keywords auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_keywords`
   */
  getKeywords(params?: LandingpagesGetKeywordsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_keywords', params, options);
  }

  /**
   * Keywords suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/search_keywords`
   */
  searchKeywords(params: LandingpagesSearchKeywordsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'search_keywords', params, options);
  }

  /**
   * Keyword anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/create_keyword`
   */
  createKeyword(params: LandingpagesCreateKeywordParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'create_keyword', params, options);
  }

  /**
   * Keyword ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingpages/update_keyword`
   */
  updateKeyword(params: LandingpagesUpdateKeywordParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'update_keyword', params, options);
  }

  /**
   * Keyword löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/landingpages/delete_keyword`
   */
  deleteKeyword(params: LandingpagesDeleteKeywordParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'delete_keyword', params, options);
  }

  /**
   * Suchvolumen ermitteln
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_keyword_search_volume`
   */
  getKeywordSearchVolume(params?: LandingpagesGetKeywordSearchVolumeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_keyword_search_volume', params, options);
  }

  /**
   * Klickpreis (CPC) ermitteln
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingpages/get_keyword_cpc`
   */
  getKeywordCpc(params?: LandingpagesGetKeywordCpcParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingpages', 'get_keyword_cpc', params, options);
  }
}

export interface LandingcardsGetLandingcardsParams {
  /** Optionaler Filter auf den Zustand der Karte: `active` zeigt nur eingeschaltete Karten, jeder andere Wert (z. B. `draft`) nur ausgeschaltete. Der Zustand wird am Mitglied geführt (Einschaltung der Landingcard). Mit Filter ist `total` die Zahl der Treffer dieser Seite. */
  status?: string;
  /** Maximale Anzahl Karten je Antwort. Standard 25, Werte unter 1 werden auf 1 angehoben. */
  limit?: number;
  /** Anzahl der Karten, die am Anfang übersprungen werden (Standard 0), für das Blättern zusammen mit `total`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface LandingcardsGetLandingcardParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird die Landingcard des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  [weiteres: string]: unknown;
}

export interface LandingcardsCreateLandingcardParams {
  /** Objekt mit Profildaten, die am Mitglied gespeichert werden. Erlaubte Schlüssel (alle Texte): `title` (Berufsbezeichnung), `phone`, `mobile`, `bio`, `linkedin`, `twitter`, `facebook`, `instagram`, `xing`, `tiktok`, `website`, `skills` und `department`. Nicht genannte Felder bleiben unverändert. Das Profil gehört immer zu dem Mitglied, dem dein Schlüssel zugeordnet ist (bei Angabe von `template_id`: zu dem Mitglied dieses Templates). */
  profile?: Record<string, unknown>;
  /** Objekt mit Gestaltungs- und Textfeldern des Landingcard-Templates. Erlaubte Schlüssel: `bio_value_proposition`, `bio_tagline`, `bio_availability_status`, `bio_contact_priority` (im Datenmodell `WhatsApp`, `E-Mail` oder `Telefon`), `bio_cta_primary`, `bio_cta_secondary`, `bio_social_links_tier1`, `bio_social_links_tier2`, `bio_social_links_tier3`, `bio_social_follower_counts` (diese vier als JSON-Text, z. B. `"[]"`), `colorPrimary`, `colorSecondary`, `primaryFont`, `headingFont`, `body_color`, `body_backgroundcolor`, `section_heroshot` (Wahrheitswert), `heroshot_headline`, `heroshot_subheadline`, `heroshot_backgroundcolor`, `heroshot_color`, `metaTitle` und `metaDescription`. Farben sind Texte wie `#1d4ed8`. Unbekannte Schlüssel werden ohne Fehlermeldung übergangen. */
  template?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingcardsUpdateLandingcardParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird die Landingcard des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  /** Objekt mit Profildaten, die am Mitglied gespeichert werden. Erlaubte Schlüssel (alle Texte): `title` (Berufsbezeichnung), `phone`, `mobile`, `bio`, `linkedin`, `twitter`, `facebook`, `instagram`, `xing`, `tiktok`, `website`, `skills` und `department`. Nicht genannte Felder bleiben unverändert. Das Profil gehört immer zu dem Mitglied, dem dein Schlüssel zugeordnet ist (bei Angabe von `template_id`: zu dem Mitglied dieses Templates). */
  profile?: Record<string, unknown>;
  /** Objekt mit Gestaltungs- und Textfeldern des Landingcard-Templates. Erlaubte Schlüssel: `bio_value_proposition`, `bio_tagline`, `bio_availability_status`, `bio_contact_priority` (im Datenmodell `WhatsApp`, `E-Mail` oder `Telefon`), `bio_cta_primary`, `bio_cta_secondary`, `bio_social_links_tier1`, `bio_social_links_tier2`, `bio_social_links_tier3`, `bio_social_follower_counts` (diese vier als JSON-Text, z. B. `"[]"`), `colorPrimary`, `colorSecondary`, `primaryFont`, `headingFont`, `body_color`, `body_backgroundcolor`, `section_heroshot` (Wahrheitswert), `heroshot_headline`, `heroshot_subheadline`, `heroshot_backgroundcolor`, `heroshot_color`, `metaTitle` und `metaDescription`. Farben sind Texte wie `#1d4ed8`. Unbekannte Schlüssel werden ohne Fehlermeldung übergangen. */
  template?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface LandingcardsDeleteLandingcardParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird die Landingcard des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  /** Wahrheitswert. Bei `true` wird das Landingcard-Template endgültig gelöscht; bei `false` oder ohne Angabe (Standard) bleibt es erhalten und soll archiviert werden. */
  remove_template?: boolean;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface LandingcardsActivateLandingcardParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird das Template des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface LandingcardsDeactivateLandingcardParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird das Template des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  [weiteres: string]: unknown;
}

export interface LandingcardsGetLandingcardAnalyticsParams {
  /** ID des Landingcard-Templates als Ganzzahl. Optional; ohne Angabe wird die Landingcard des Mitglieds verwendet, dem dein Schlüssel zugeordnet ist. Das Template muss zu deinem Unternehmen gehören. */
  template_id?: number;
  [weiteres: string]: unknown;
}

export interface LandingcardsBulkCreateLandingcardsParams {
  /** Liste der Mitglieds-IDs (Ganzzahlen) aus deinem Unternehmen, für die die Landingcard eingeschaltet wird. Pflichtangabe, darf nicht leer sein. Es gibt keine Obergrenze; große Listen dauern entsprechend länger, da je Mitglied ein QR-Code erzeugt werden kann. */
  member_ids: Array<number>;
  [weiteres: string]: unknown;
}

export interface LandingcardsRegenerateLandingcardQrcodeParams {
  [weiteres: string]: unknown;
}

/** Landingcards — Der Bereich Landingcards verwaltet digitale Visitenkarten (Bio-Landingpages) für Mitglieder deines Unternehmens. */
export class LandingcardsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Landingcards auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingcards/get_landingcards`
   */
  getLandingcards(params?: LandingcardsGetLandingcardsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'get_landingcards', params, options);
  }

  /**
   * Landingcard abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingcards/get_landingcard`
   */
  getLandingcard(params?: LandingcardsGetLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'get_landingcard', params, options);
  }

  /**
   * Landingcard anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingcards/create_landingcard`
   */
  createLandingcard(params?: LandingcardsCreateLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'create_landingcard', params, options);
  }

  /**
   * Landingcard ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingcards/update_landingcard`
   */
  updateLandingcard(params?: LandingcardsUpdateLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'update_landingcard', params, options);
  }

  /**
   * Landingcard deaktivieren oder löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/landingcards/delete_landingcard`
   */
  deleteLandingcard(params: LandingcardsDeleteLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'delete_landingcard', params, options);
  }

  /**
   * Landingcard aktivieren
   *
   * Recht am Schlüssel: `veroeffentlichen` · `POST /platform/landingcards/activate_landingcard`
   */
  activateLandingcard(params: LandingcardsActivateLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'activate_landingcard', params, options);
  }

  /**
   * Landingcard deaktivieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingcards/deactivate_landingcard`
   */
  deactivateLandingcard(params?: LandingcardsDeactivateLandingcardParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'deactivate_landingcard', params, options);
  }

  /**
   * Landingcard-Kennzahlen abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/landingcards/get_landingcard_analytics`
   */
  getLandingcardAnalytics(params?: LandingcardsGetLandingcardAnalyticsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'get_landingcard_analytics', params, options);
  }

  /**
   * Landingcards für mehrere Mitglieder aktivieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingcards/bulk_create_landingcards`
   */
  bulkCreateLandingcards(params: LandingcardsBulkCreateLandingcardsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'bulk_create_landingcards', params, options);
  }

  /**
   * QR-Code neu erzeugen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/landingcards/regenerate_landingcard_qrcode`
   */
  regenerateLandingcardQrcode(params?: LandingcardsRegenerateLandingcardQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('landingcards', 'regenerate_landingcard_qrcode', params, options);
  }
}

export interface QrcodesGetQrcodesParams {
  /** Optionaler Filter auf den Aktivstatus. Erlaubt sind `active` (nur aktive Codes) und `inactive` (nur deaktivierte); Groß-/Kleinschreibung spielt keine Rolle. Jeder andere Wert wird still ignoriert und liefert alle Codes. */
  status?: string;
  /** Maximale Anzahl Einträge pro Antwort als ganze Zahl. Standard ist 25, der kleinste Wert ist 1. Es gibt keine feste Obergrenze; sehr große Werte machen die Antwort aber entsprechend groß. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der sortierten Liste übersprungen werden, für das seitenweise Blättern. Standard ist 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface QrcodesGetQrcodeParams {
  /** Die numerische ID des QR-Codes, wie sie in `id` von `get_qrcodes` oder `create_qrcode` zurückkommt. Pflichtangabe. Codes anderer Firmen werden wie nicht vorhanden behandelt. */
  qrcode_id: number;
  [weiteres: string]: unknown;
}

export interface QrcodesCreateQrcodeParams {
  /** Frei wählbarer Name des QR-Codes, zum Beispiel der Einsatzzweck. Pflichtangabe, darf nicht leer sein. Der Wert wird getrimmt und HTML-maskiert gespeichert. */
  name: string;
  /** Ziel-URL, zu der der QR-Code weiterleitet, zum Beispiel `https://www.example.com/angebot`. Pflichtangabe. Aus dieser Adresse werden beim Anlegen Seitentitel und Beschreibung gelesen. Es findet keine URL-Formatprüfung statt. */
  target: string;
  /** Optional: ID eines Dokuments, mit dem der QR-Code verknüpft wird, als ganze Zahl. Ohne Angabe wird `0` (kein Dokument) gespeichert; in der Antwort steht der Wert als Zeichenkette. */
  document_id?: number;
  /** Optional: `true` (Standard) legt den Code aktiv an, `false` legt ihn deaktiviert an. Ein deaktivierter Code bleibt gespeichert und kann mit `update_qrcode` wieder aktiviert werden. */
  is_active?: boolean;
  [weiteres: string]: unknown;
}

export interface QrcodesUpdateQrcodeParams {
  /** Die ID des zu ändernden QR-Codes, wie sie `get_qrcodes` oder `create_qrcode` liefert. Pflichtangabe; Codes anderer Firmen werden abgelehnt. */
  qrcode_id: number;
  /** Objekt mit den zu ändernden Feldern. Wirksame Schlüssel: `name` (Text), `target` (Ziel-URL als Text) und `is_active` (true/false). Pflichtangabe; ein leeres Objekt ändert nichts. Alle anderen Schlüssel werden ignoriert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface QrcodesDeleteQrcodeParams {
  /** Die ID des zu löschenden QR-Codes. Pflichtangabe. Der Code muss zu deiner Firma gehören, sonst kommt die Fehlermeldung „QR-Code nicht gefunden oder kein Zugriff“. */
  qrcode_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface QrcodesCopyQrcodeParams {
  /** Die ID des QR-Codes, der kopiert werden soll. Pflichtangabe; der Code muss zu deiner Firma gehören. */
  qrcode_id: number;
  /** Optional: Name der Kopie. Ohne Angabe wird der Originalname mit dem Zusatz „ (Kopie)“ verwendet. Der Wert wird getrimmt und HTML-maskiert gespeichert. */
  name?: string;
  /** Optional: Aktivstatus der Kopie (`true` oder `false`). Ohne Angabe übernimmt die Kopie den Status des Originals. */
  is_active?: boolean;
  [weiteres: string]: unknown;
}

export interface QrcodesGetQrcodeAnalyticsParams {
  /** Die ID des QR-Codes, für den die Kennzahlen geliefert werden sollen. Pflichtangabe; der Code muss zu deiner Firma gehören. */
  qrcode_id: number;
  [weiteres: string]: unknown;
}

export interface QrcodesGetQrcodeStatsParams {
  [weiteres: string]: unknown;
}

export interface QrcodesGetQrcodeScansParams {
  /** Die ID des QR-Codes, dessen Scan-Historie abgefragt wird. Pflichtangabe; der Code muss zu deiner Firma gehören, sonst kommt eine Fehlermeldung. */
  qrcode_id: number;
  [weiteres: string]: unknown;
}

export interface QrcodesGetQrImageParams {
  /** Die ID des QR-Codes, dessen Bild geliefert werden soll. Pflichtangabe; der Code muss zu deiner Firma gehören, sonst kommt „QR-Code nicht gefunden oder kein Zugriff“. */
  qrcode_id: number;
  [weiteres: string]: unknown;
}

/** QR-Codes — Mit diesem Bereich verwaltest du die QR-Codes deines Unternehmens. */
export class QrcodesArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * QR-Codes auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qrcodes`
   */
  getQrcodes(params?: QrcodesGetQrcodesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qrcodes', params, options);
  }

  /**
   * QR-Code abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qrcode`
   */
  getQrcode(params: QrcodesGetQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qrcode', params, options);
  }

  /**
   * QR-Code anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/qrcodes/create_qrcode`
   */
  createQrcode(params: QrcodesCreateQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'create_qrcode', params, options);
  }

  /**
   * QR-Code ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/qrcodes/update_qrcode`
   */
  updateQrcode(params: QrcodesUpdateQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'update_qrcode', params, options);
  }

  /**
   * QR-Code löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/qrcodes/delete_qrcode`
   */
  deleteQrcode(params: QrcodesDeleteQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'delete_qrcode', params, options);
  }

  /**
   * QR-Code kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/qrcodes/copy_qrcode`
   */
  copyQrcode(params: QrcodesCopyQrcodeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'copy_qrcode', params, options);
  }

  /**
   * QR-Code-Analytics abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qrcode_analytics`
   */
  getQrcodeAnalytics(params: QrcodesGetQrcodeAnalyticsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qrcode_analytics', params, options);
  }

  /**
   * QR-Code-Statistik abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qrcode_stats`
   */
  getQrcodeStats(params?: QrcodesGetQrcodeStatsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qrcode_stats', params, options);
  }

  /**
   * Scan-Historie abrufen (Platzhalter)
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qrcode_scans`
   */
  getQrcodeScans(params: QrcodesGetQrcodeScansParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qrcode_scans', params, options);
  }

  /**
   * QR-Code-Bild abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/qrcodes/get_qr_image`
   */
  getQrImage(params: QrcodesGetQrImageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('qrcodes', 'get_qr_image', params, options);
  }
}

export interface TestimonialsGetTestimonialsParams {
  /** Optional: Mindestbewertung als ganze Zahl. Es werden nur Testimonials mit `rating` größer oder gleich diesem Wert geliefert. Sinnvoll sind Werte von 1 bis 5; 0 oder keine Angabe schaltet den Filter aus. */
  min_rating?: number;
  /** Maximale Anzahl Einträge pro Antwort als ganze Zahl. Standard ist 25, der kleinste Wert ist 1. Es gibt keine feste Obergrenze. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der sortierten Liste übersprungen werden, zum seitenweisen Blättern. Standard ist 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface TestimonialsGetTestimonialParams {
  /** Die numerische ID des Testimonials, wie sie in `id` von `get_testimonials` oder `create_testimonial` zurückkommt. Pflichtangabe. Einträge anderer Firmen werden wie nicht vorhanden behandelt. */
  testimonial_id: number;
  [weiteres: string]: unknown;
}

export interface TestimonialsCreateTestimonialParams {
  /** Objekt mit den Inhalten der Kundenstimme. Wirksame Schlüssel: `name`, `company`, `city`, `ceo`, `position`, `quote`, `problem`, `solution`, `future`, `image1desc`, `image2desc` (alle Text), `rating` (ganze Zahl, üblich 1–5), `variante` (`schmerzloesung`, `process` oder `zitat`) und `state` (`past`, `present` oder `future`). Pflichtangabe als Objekt; nicht genannte Felder bleiben leer. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface TestimonialsUpdateTestimonialParams {
  /** Die ID des zu ändernden Testimonials, wie sie `get_testimonials` oder `create_testimonial` liefert. Pflichtangabe; Einträge anderer Firmen werden abgelehnt. */
  testimonial_id: number;
  /** Objekt mit den zu ändernden Feldern. Wirksame Schlüssel: `name`, `company`, `city`, `ceo`, `position`, `quote`, `problem`, `solution`, `future`, `image1desc`, `image2desc`, `rating` (ganze Zahl), `variante` und `state`. Pflichtangabe; nicht genannte Felder bleiben unverändert, unbekannte Schlüssel werden ignoriert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface TestimonialsDeleteTestimonialParams {
  /** Die ID des zu löschenden Testimonials. Pflichtangabe. Der Eintrag muss zu deiner Firma gehören, sonst kommt die Fehlermeldung „Testimonial nicht gefunden oder kein Zugriff“. */
  testimonial_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface TestimonialsScrapeTestimonialsFromUrlParams {
  /** Vollständige Adresse der Webseite mit den Kundenstimmen, zum Beispiel `https://www.example.com/referenzen`. Pflichtangabe. Die Adresse muss ein gültiges URL-Format haben und öffentlich abrufbar sein. */
  url: string;
  [weiteres: string]: unknown;
}

export interface TestimonialsFilterByRatingParams {
  /** Mindestbewertung als ganze Zahl (sinnvoll 1 bis 5). Pflichtangabe; mit 0 werden alle Stimmen geliefert. Geliefert werden alle Stimmen mit `rating` größer oder gleich diesem Wert. */
  min_rating: number;
  [weiteres: string]: unknown;
}

export interface TestimonialsGetTestimonialStatisticsParams {
  [weiteres: string]: unknown;
}

export interface TestimonialsExportTestimonialsParams {
  [weiteres: string]: unknown;
}

/** Kundenstimmen — Dieser Bereich verwaltet die Kundenstimmen (Testimonials) deines Unternehmens. */
export class TestimonialsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Kundenstimmen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/testimonials/get_testimonials`
   */
  getTestimonials(params?: TestimonialsGetTestimonialsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'get_testimonials', params, options);
  }

  /**
   * Kundenstimme abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/testimonials/get_testimonial`
   */
  getTestimonial(params: TestimonialsGetTestimonialParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'get_testimonial', params, options);
  }

  /**
   * Kundenstimme anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/testimonials/create_testimonial`
   */
  createTestimonial(params: TestimonialsCreateTestimonialParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'create_testimonial', params, options);
  }

  /**
   * Kundenstimme ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/testimonials/update_testimonial`
   */
  updateTestimonial(params: TestimonialsUpdateTestimonialParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'update_testimonial', params, options);
  }

  /**
   * Kundenstimme löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/testimonials/delete_testimonial`
   */
  deleteTestimonial(params: TestimonialsDeleteTestimonialParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'delete_testimonial', params, options);
  }

  /**
   * Kundenstimmen aus Webseite importieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/testimonials/scrape_testimonials_from_url`
   */
  scrapeTestimonialsFromUrl(params: TestimonialsScrapeTestimonialsFromUrlParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'scrape_testimonials_from_url', params, options);
  }

  /**
   * Kundenstimmen nach Bewertung filtern
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/testimonials/filter_by_rating`
   */
  filterByRating(params: TestimonialsFilterByRatingParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'filter_by_rating', params, options);
  }

  /**
   * Kennzahlen der Kundenstimmen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/testimonials/get_testimonial_statistics`
   */
  getTestimonialStatistics(params?: TestimonialsGetTestimonialStatisticsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'get_testimonial_statistics', params, options);
  }

  /**
   * Kundenstimmen als JSON exportieren
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/testimonials/export_testimonials`
   */
  exportTestimonials(params?: TestimonialsExportTestimonialsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('testimonials', 'export_testimonials', params, options);
  }
}

export interface OffersGetOffersParams {
  /** Optionaler Status-Filter als Text, zum Beispiel `present`. Es werden nur Angebote mit genau diesem Status geliefert (Groß-/Kleinschreibung nach Datenbank-Vergleich). Die bekannten Werte liefert `list_offer_states`. */
  state?: string;
  /** Optionaler Suchtext. Es werden Angebote geliefert, in deren Titel oder Inhalt der Text als Teilzeichenfolge vorkommt. Der Suchtext wird getrimmt und HTML-maskiert, Sonderzeichen wie `&` oder Anführungszeichen können deshalb nicht wie erwartet treffen. */
  search?: string;
  /** Optional: ID eines Interviews als ganze Zahl. Es werden nur Angebote geliefert, die diesem Interview zugeordnet sind. */
  interview_id?: number;
  /** Maximale Anzahl Einträge pro Antwort als ganze Zahl. Standard ist 25, der kleinste Wert ist 1. Es gibt keine feste Obergrenze. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der sortierten Liste übersprungen werden, zum seitenweisen Blättern. Standard ist 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface OffersGetOfferParams {
  /** Die numerische ID des Angebots, wie sie in `id` von `get_offers` oder `create_offer` zurückkommt. Pflichtangabe. Angebote anderer Firmen werden wie nicht vorhanden behandelt. */
  offer_id: number;
  [weiteres: string]: unknown;
}

export interface OffersCreateOfferParams {
  /** Titel des Angebots. Pflichtangabe, darf nicht leer sein. Der Wert wird getrimmt und HTML-maskiert gespeichert und dient auch als Grundlage für den internen Schlüssel. */
  title: string;
  /** Optional: Inhalt als JSON-Objekt, zum Beispiel mit den Schlüsseln `title`, `description`, `price`, `needs`, `targetAudience` und `processSteps` (Liste), die `summarize_offer` auswertet. Weitere Schlüssel sind erlaubt und bleiben erhalten. Ein reiner Text wird unverändert gespeichert. */
  content?: Record<string, unknown>;
  /** Optional: Status des Angebots als Text, zum Beispiel `present` (aktuell) oder `future` (geplant). Standard ist `present`. Die bekannten Werte nennt `list_offer_states`; eine Prüfung findet nicht statt. */
  state?: string;
  /** Optional: ID eines Interviews, mit dem das Angebot verknüpft wird, als ganze Zahl. Ohne Angabe bleibt das Feld leer. */
  interview_id?: number;
  [weiteres: string]: unknown;
}

export interface OffersUpdateOfferParams {
  /** Die ID des zu ändernden Angebots, wie sie `get_offers` oder `create_offer` liefert. Pflichtangabe; Angebote anderer Firmen werden abgelehnt. */
  offer_id: number;
  /** Objekt mit den zu ändernden Feldern. Wirksame Schlüssel: `title` (Text), `state` (Text), `interview_id` (ganze Zahl) und `content` (JSON-Objekt oder Text, ersetzt den gesamten Inhalt). Pflichtangabe und nicht leer; unbekannte Schlüssel werden ignoriert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface OffersDeleteOfferParams {
  /** Die ID des zu löschenden Angebots. Pflichtangabe. Das Angebot muss zu deiner Firma gehören, sonst kommt die Fehlermeldung „Angebot nicht gefunden oder kein Zugriff“. */
  offer_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface OffersCopyOfferParams {
  /** Die ID des Quell-Angebots, das kopiert werden soll. Pflichtangabe; das Angebot muss zu deiner Firma gehören. */
  offer_id: number;
  /** Optional: Titel der Kopie. Ohne Angabe wird der Originaltitel mit dem Zusatz „ (Kopie)“ verwendet. Der Wert wird getrimmt und HTML-maskiert gespeichert. */
  title?: string;
  /** Optional: Status der Kopie als Text, zum Beispiel `draft` oder `future`. Ohne Angabe wird der Status des Originals übernommen. */
  state?: string;
  [weiteres: string]: unknown;
}

export interface OffersSummarizeOfferParams {
  /** Die ID des Angebots, das zusammengefasst werden soll. Pflichtangabe; das Angebot muss zu deiner Firma gehören, sonst kommt eine Fehlermeldung. */
  offer_id: number;
  [weiteres: string]: unknown;
}

export interface OffersListOfferStatesParams {
  [weiteres: string]: unknown;
}

/** Angebote im Katalog — Dieser Bereich verwaltet die Angebote im Katalog deines Unternehmens, also die Leistungen und Pakete, die du anbietest (nicht die Angebotsbelege der Buchhaltung). */
export class OffersArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Angebote auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/offers/get_offers`
   */
  getOffers(params?: OffersGetOffersParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'get_offers', params, options);
  }

  /**
   * Angebot abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/offers/get_offer`
   */
  getOffer(params: OffersGetOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'get_offer', params, options);
  }

  /**
   * Angebot anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/offers/create_offer`
   */
  createOffer(params: OffersCreateOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'create_offer', params, options);
  }

  /**
   * Angebot ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/offers/update_offer`
   */
  updateOffer(params: OffersUpdateOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'update_offer', params, options);
  }

  /**
   * Angebot löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/offers/delete_offer`
   */
  deleteOffer(params: OffersDeleteOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'delete_offer', params, options);
  }

  /**
   * Angebot kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/offers/copy_offer`
   */
  copyOffer(params: OffersCopyOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'copy_offer', params, options);
  }

  /**
   * Angebot zusammenfassen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/offers/summarize_offer`
   */
  summarizeOffer(params: OffersSummarizeOfferParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'summarize_offer', params, options);
  }

  /**
   * Bekannte Angebotsstatus auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/offers/list_offer_states`
   */
  listOfferStates(params?: OffersListOfferStatesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('offers', 'list_offer_states', params, options);
  }
}

export interface ExpertiseGetExpertisesParams {
  /** Optionaler Status-Filter als Text, zum Beispiel `active`. Es werden nur Einträge mit genau diesem Status geliefert. Die bekannten Werte liefert `list_expertise_states`. */
  state?: string;
  /** Optionaler Suchtext. Es werden Einträge geliefert, in deren Titel oder Inhalt der Text als Teilzeichenfolge vorkommt. Der Suchtext wird getrimmt und HTML-maskiert, Sonderzeichen wie `&` oder Anführungszeichen können deshalb nicht wie erwartet treffen. */
  search?: string;
  /** Optional: ID eines Interviews als ganze Zahl. Es werden nur Einträge geliefert, die diesem Interview zugeordnet sind. */
  interview_id?: number;
  /** Maximale Anzahl Einträge pro Antwort als ganze Zahl. Standard ist 25, der kleinste Wert ist 1. Es gibt keine feste Obergrenze. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der sortierten Liste übersprungen werden, zum seitenweisen Blättern. Standard ist 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface ExpertiseGetExpertiseParams {
  /** Die numerische ID des Expertise-Eintrags, wie sie in `id` von `get_expertises` oder `create_expertise` zurückkommt. Pflichtangabe. Einträge anderer Firmen werden wie nicht vorhanden behandelt. */
  expertise_id: number;
  [weiteres: string]: unknown;
}

export interface ExpertiseCreateExpertiseParams {
  /** Titel des Expertise-Eintrags. Pflichtangabe, darf nicht leer sein. Der Wert wird getrimmt und HTML-maskiert gespeichert und dient auch als Grundlage für den internen Schlüssel. */
  title: string;
  /** Optional: Inhalt als JSON-Objekt, zum Beispiel mit den Schlüsseln `title`, `initial_expertise_identification`, `process_analysis`, `experience_and_learning_curve` und `recommendations_and_methods`, die `summarize_expertise` auswertet. Weitere Schlüssel sind erlaubt und bleiben erhalten. Ein reiner Text wird unverändert gespeichert. */
  content?: Record<string, unknown>;
  /** Optional: Status des Eintrags als Text, zum Beispiel `active` oder `draft`. Standard ist `active`. Die bekannten Werte nennt `list_expertise_states`; eine Prüfung findet nicht statt. */
  state?: string;
  /** Optional: ID eines Interviews, aus dem der Eintrag stammt, als ganze Zahl. Ohne Angabe bleibt das Feld leer. */
  interview_id?: number;
  [weiteres: string]: unknown;
}

export interface ExpertiseUpdateExpertiseParams {
  /** Die ID des zu ändernden Eintrags, wie sie `get_expertises` oder `create_expertise` liefert. Pflichtangabe; Einträge anderer Firmen werden abgelehnt. */
  expertise_id: number;
  /** Objekt mit den zu ändernden Feldern. Wirksame Schlüssel: `title` (Text), `state` (Text), `interview_id` (ganze Zahl) und `content` (JSON-Objekt oder Text, ersetzt den gesamten Inhalt). Pflichtangabe und nicht leer; unbekannte Schlüssel werden ignoriert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface ExpertiseDeleteExpertiseParams {
  /** Die ID des zu löschenden Expertise-Eintrags. Pflichtangabe. Der Eintrag muss zu deiner Firma gehören, sonst kommt die Fehlermeldung „Expertise nicht gefunden oder kein Zugriff“. */
  expertise_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface ExpertiseCopyExpertiseParams {
  /** Die ID des Eintrags, der kopiert werden soll. Pflichtangabe; der Eintrag muss zu deiner Firma gehören. */
  expertise_id: number;
  /** Optional: Titel der Kopie. Ohne Angabe wird der Originaltitel mit dem Zusatz „ (Kopie)“ verwendet. Der Wert wird getrimmt und HTML-maskiert gespeichert. */
  title?: string;
  /** Optional: Status der Kopie als Text, zum Beispiel `draft`. Ohne Angabe wird der Status des Originals übernommen. */
  state?: string;
  [weiteres: string]: unknown;
}

export interface ExpertiseSummarizeExpertiseParams {
  /** Die ID des Expertise-Eintrags, der zusammengefasst werden soll. Pflichtangabe; der Eintrag muss zu deiner Firma gehören, sonst kommt eine Fehlermeldung. */
  expertise_id: number;
  [weiteres: string]: unknown;
}

export interface ExpertiseListExpertiseStatesParams {
  [weiteres: string]: unknown;
}

/** Expertise — Dieser Bereich verwaltet die Expertise-Einträge deines Unternehmens: strukturiertes Fachwissen, das du zum Beispiel aus Interviews gewinnst. */
export class ExpertiseArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Expertise-Einträge auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/expertise/get_expertises`
   */
  getExpertises(params?: ExpertiseGetExpertisesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'get_expertises', params, options);
  }

  /**
   * Expertise-Eintrag abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/expertise/get_expertise`
   */
  getExpertise(params: ExpertiseGetExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'get_expertise', params, options);
  }

  /**
   * Expertise-Eintrag anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/expertise/create_expertise`
   */
  createExpertise(params: ExpertiseCreateExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'create_expertise', params, options);
  }

  /**
   * Expertise-Eintrag ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/expertise/update_expertise`
   */
  updateExpertise(params: ExpertiseUpdateExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'update_expertise', params, options);
  }

  /**
   * Expertise-Eintrag löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/expertise/delete_expertise`
   */
  deleteExpertise(params: ExpertiseDeleteExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'delete_expertise', params, options);
  }

  /**
   * Expertise-Eintrag kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/expertise/copy_expertise`
   */
  copyExpertise(params: ExpertiseCopyExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'copy_expertise', params, options);
  }

  /**
   * Expertise-Eintrag zusammenfassen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/expertise/summarize_expertise`
   */
  summarizeExpertise(params: ExpertiseSummarizeExpertiseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'summarize_expertise', params, options);
  }

  /**
   * Bekannte Expertise-Status auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/expertise/list_expertise_states`
   */
  listExpertiseStates(params?: ExpertiseListExpertiseStatesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('expertise', 'list_expertise_states', params, options);
  }
}

export interface GlossaryGetGlossaryEntriesParams {
  /** Optionaler Suchtext. Es werden Einträge geliefert, in deren deutschem oder englischem Begriff oder in deren Definition der Text als Teilzeichenfolge vorkommt. Der Suchtext wird getrimmt und HTML-maskiert. */
  search?: string;
  /** Optionaler Filter auf die Kategorie als exakter Text. Im Datenmodell vorgesehen sind `Business`, `Technology`, `Legal` und `Marketing`; es werden nur Einträge mit genau diesem Wert geliefert. */
  category?: string;
  /** Optionaler Filter auf den Status als exakter Text. Im Datenmodell vorgesehen sind `active`, `draft` und `archived`; es werden nur Einträge mit genau diesem Wert geliefert. */
  status?: string;
  /** Optional: `true` nimmt zusätzlich globale Begriffe ohne Firmenzuordnung in die Treffer auf. Standard ist `false`, dann kommen nur Einträge deiner Firma. Die Filter gelten auch für die globalen Begriffe. */
  include_global?: boolean;
  /** Maximale Anzahl Einträge pro Antwort als ganze Zahl. Standard ist 25, der kleinste Wert ist 1. Es gibt keine feste Obergrenze. */
  limit?: number;
  /** Anzahl der Einträge, die am Anfang der sortierten Liste übersprungen werden, zum seitenweisen Blättern. Standard ist 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface GlossaryGetGlossaryEntryParams {
  /** Die numerische ID des Glossar-Eintrags, wie sie in `id` von `get_glossary_entries` oder `create_glossary_entry` zurückkommt. Pflichtangabe. */
  entry_id: number;
  [weiteres: string]: unknown;
}

export interface GlossaryCreateGlossaryEntryParams {
  /** Deutscher Begriff, zum Beispiel „Lead-Qualifizierung“. Pflichtangabe, darf nicht leer sein. Aus ihm wird auch der interne Schlüssel des Eintrags gebildet. */
  term_de: string;
  /** Deutsche Definition bzw. Erklärung des Begriffs als Text. Pflichtangabe, darf nicht leer sein. In der Kurzfassung von `summarize_glossary_entry` wird sie auf 160 Zeichen gekürzt. */
  definition_de: string;
  /** Optional: englische Übersetzung des Begriffs. Ohne Angabe bleibt das Feld leer; die Suche in `get_glossary_entries` berücksichtigt es, sobald es gefüllt ist. */
  term_en?: string;
  /** Optional: englische Definition als Text. Ohne Angabe bleibt das Feld leer. Fehlt die deutsche Definition, nutzt die Kurzfassung ersatzweise diese. */
  definition_en?: string;
  /** Optional: Kategorie des Begriffs als Text. Im Datenmodell vorgesehen sind `Business`, `Technology`, `Legal` und `Marketing`; die Schreibweise muss für den Kategorie-Filter exakt passen. */
  category?: string;
  /** Optional: Status des Eintrags als Text. Im Datenmodell vorgesehen sind `active`, `draft` und `archived`. Ohne Angabe bleibt der Status leer. */
  status?: string;
  /** Optional: Priorität als Text. Im Datenmodell vorgesehen sind `high`, `medium` und `low`. Ohne Angabe bleibt die Priorität leer. */
  priority?: string;
  /** Optional: deutsche Synonyme als ein einzelner Text, zum Beispiel kommagetrennt („Anfragenbewertung, Lead-Check“). Es wird kein Listenformat erzwungen. */
  synonyms_de?: string;
  /** Optional: englische Synonyme als ein einzelner Text, zum Beispiel kommagetrennt („lead scoring, lead vetting“). Es wird kein Listenformat erzwungen. */
  synonyms_en?: string;
  [weiteres: string]: unknown;
}

export interface GlossaryUpdateGlossaryEntryParams {
  /** Die ID des zu ändernden Glossar-Eintrags, wie sie `get_glossary_entries` oder `create_glossary_entry` liefert. Pflichtangabe; Einträge anderer Firmen werden abgelehnt. */
  entry_id: number;
  /** Objekt mit den zu ändernden Feldern. Wirksame Schlüssel (alle Text): `term_de`, `term_en`, `definition_de`, `definition_en`, `examples_de`, `examples_en`, `synonyms_de`, `synonyms_en`, `category`, `priority`, `status`. Pflichtangabe und nicht leer; unbekannte Schlüssel werden ignoriert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface GlossaryDeleteGlossaryEntryParams {
  /** Die ID des zu löschenden Glossar-Eintrags. Pflichtangabe. Einträge anderer Firmen werden abgelehnt, unbekannte IDs liefern „Glossar-Eintrag nicht gefunden“. */
  entry_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface GlossarySummarizeGlossaryEntryParams {
  /** Die ID des Glossar-Eintrags, der zusammengefasst werden soll. Pflichtangabe; der Eintrag muss zu deiner Firma gehören, sonst kommt eine Fehlermeldung. */
  entry_id: number;
  [weiteres: string]: unknown;
}

/** Glossar — Dieser Bereich verwaltet das Glossar deines Unternehmens: Fachbegriffe mit Definition, zweisprachig in Deutsch und Englisch. */
export class GlossaryArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Glossar-Einträge auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/glossary/get_glossary_entries`
   */
  getGlossaryEntries(params?: GlossaryGetGlossaryEntriesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'get_glossary_entries', params, options);
  }

  /**
   * Glossar-Eintrag abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/glossary/get_glossary_entry`
   */
  getGlossaryEntry(params: GlossaryGetGlossaryEntryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'get_glossary_entry', params, options);
  }

  /**
   * Glossar-Eintrag anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/glossary/create_glossary_entry`
   */
  createGlossaryEntry(params: GlossaryCreateGlossaryEntryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'create_glossary_entry', params, options);
  }

  /**
   * Glossar-Eintrag ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/glossary/update_glossary_entry`
   */
  updateGlossaryEntry(params: GlossaryUpdateGlossaryEntryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'update_glossary_entry', params, options);
  }

  /**
   * Glossar-Eintrag löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/glossary/delete_glossary_entry`
   */
  deleteGlossaryEntry(params: GlossaryDeleteGlossaryEntryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'delete_glossary_entry', params, options);
  }

  /**
   * Glossar-Eintrag zusammenfassen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/glossary/summarize_glossary_entry`
   */
  summarizeGlossaryEntry(params: GlossarySummarizeGlossaryEntryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('glossary', 'summarize_glossary_entry', params, options);
  }
}

export interface HandbookGetHandbookPagesParams {
  /** Filtert auf genau diesen Status (Textvergleich, z. B. `draft`, `review`, `active`, `archived`). Ohne Angabe werden alle Status geliefert. */
  status?: string;
  /** Filtert auf genau diese Kategorie, z. B. `02-sops`. Es wird nur exakt verglichen, keine Teilstrings. */
  category?: string;
  /** Filtert auf den Seitentyp, z. B. `sop`, `workflow`, `training`, `documentation` oder `overview`. Exakter Vergleich. */
  page_type?: string;
  /** Im Schema als Freitextsuche beschrieben, wird von dieser Funktion aber nicht ausgewertet und hat keine Wirkung. Nutze `search_handbook_pages` für die Suche in Titel, Slug, Inhalt und Tags. */
  search?: string;
  /** Wenn `true`, werden zusätzlich Seiten ohne Unternehmenszuordnung (globale Seiten) eingeschlossen. Standard `false`. */
  include_global?: boolean;
  /** Steuert, ob systemweite Seiten (`is_internal: true`) mitgeliefert werden. Standard `true`; mit `false` erhältst du nur Seiten deines Unternehmens. */
  include_internal?: boolean;
  /** Maximale Anzahl Einträge pro Antwort. Standard 25, Minimum 1; eine feste Obergrenze gibt es im Code nicht. */
  limit?: number;
  /** Anzahl der zu überspringenden Einträge für die Seiteneinteilung. Standard 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface HandbookGetHandbookPageParams {
  /** Numerische ID der Handbuch-Seite (Pflicht). Wird als Ganzzahl interpretiert; IDs fremder Unternehmen führen zu einem Zugriffsfehler. */
  page_id: number;
  [weiteres: string]: unknown;
}

export interface HandbookSearchHandbookPagesParams {
  /** Suchbegriff (Pflicht). Wird in Titel, Slug, Inhalt und Tags als Teilstring gesucht, ohne Berücksichtigung von Wortgrenzen. */
  query: string;
  /** Maximale Trefferzahl pro Antwort. Standard 10, Minimum 1. */
  limit?: number;
  /** Anzahl zu überspringender Treffer für die Seiteneinteilung. Standard 0. */
  offset?: number;
  /** Optionaler Filter auf eine exakte Kategorie, z. B. `02-sops`. */
  category?: string;
  /** Optionaler Filter auf einen exakten Status, z. B. `active`. */
  status?: string;
  /** Wenn `false`, werden systemweite Seiten (`is_internal`) ausgeschlossen. Standard `true`. */
  include_internal?: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookSemanticSearchHandbookParams {
  /** Natürlichsprachige Suchanfrage (Pflicht), z. B. eine Frage oder ein Thema. Muss kein Stichwort enthalten, das wörtlich im Text steht. */
  query: string;
  /** Anzahl der gewünschten Treffer. Standard 5, Minimum 1. */
  limit?: number;
  /** Optionaler Filter: nur Seiten dieser exakten Kategorie bleiben im Ergebnis. */
  category?: string;
  /** Optionaler Filter auf den Seitentyp, z. B. `sop` oder `training`. */
  page_type?: string;
  /** Wenn `false`, werden systemweite Seiten ausgeschlossen, die nicht deinem Unternehmen gehören. Standard `true`. */
  include_internal?: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookGetInternalHandbookPagesParams {
  /** Optionaler Filter auf eine exakte Kategorie, z. B. `02-sops`. */
  category?: string;
  /** Optionaler Filter auf einen exakten Status, z. B. `active`. */
  status?: string;
  /** Optionaler Filter auf den Seitentyp, z. B. `sop` oder `workflow`. */
  page_type?: string;
  /** Maximale Anzahl Einträge pro Antwort. Standard 25, Minimum 1. */
  limit?: number;
  /** Anzahl der zu überspringenden Einträge. Standard 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface HandbookCreateHandbookPageParams {
  /** Titel der Seite (Pflicht, nicht leer). */
  title: string;
  /** URL-tauglicher Bezeichner. Optional; wird sonst aus dem Titel erzeugt (nur Buchstaben und Ziffern, getrennt durch Bindestriche). */
  slug?: string;
  /** Kategorie der Seite als Freitext. Standard `02-sops`. */
  category?: string;
  /** Optionale Unterkategorie als Freitext, z. B. ein Abteilungsname. */
  subcategory?: string;
  /** Seitentyp. Das Datenmodell kennt `sop`, `workflow`, `training`, `documentation` und `overview`; Standard `sop`. Der Code prüft den Wert nicht gegen diese Liste. */
  page_type?: string;
  /** Status der Seite. Das Datenmodell kennt `draft`, `review`, `active` und `archived`; Standard `draft`. Ein Abgleich mit dieser Liste findet nicht statt. */
  status?: string;
  /** Hauptinhalt der Seite als Text, üblicherweise Markdown. Wird unverändert gespeichert. */
  content?: string;
  /** Kurze Zielbeschreibung der Seite bzw. des Prozesses. */
  goal?: string;
  /** Liste von Prozessschritten, jeweils ein Objekt mit frei wählbaren Feldern (z. B. `title`, `description`). Wird als JSON gespeichert. */
  steps?: Array<Record<string, unknown>>;
  /** Checkliste als Liste von Objekten (z. B. `item`). Wird als JSON gespeichert. */
  checklist?: Array<Record<string, unknown>>;
  /** Kennzahlen als Liste von Objekten (z. B. `name`, `target`). Wird als JSON gespeichert. */
  kpis?: Array<Record<string, unknown>>;
  /** Liste von Schlagwörtern als Strings. Die Tags werden bei der Stichwortsuche mit durchsucht. */
  tags?: Array<string>;
  /** Name der verantwortlichen Person als Freitext. */
  responsible?: string;
  /** Name des Autors als Freitext. */
  author?: string;
  /** Zugriffsstufe der Seite. Das Datenmodell kennt `admin`, `employee`, `partner`, `ai` und `public`. Die Funktion prüft den Wert nicht. */
  access_level?: string;
  /** Markiert die Seite als systemweit sichtbare SOP. Standard `false`; bei `true` erscheint die Seite auch in den Listen anderer Unternehmen. */
  is_internal?: boolean;
  /** Wenn `true`, wird die Seite nach dem Speichern direkt in den Suchindex aufgenommen. Nur wirksam, wenn der Index eingerichtet ist. */
  auto_index?: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookUpdateHandbookPageParams {
  /** Numerische ID der zu ändernden Seite (Pflicht). */
  page_id: number;
  /** Objekt mit den zu ändernden Feldern in snake_case, z. B. `{"status": "active", "tags": ["sop"]}`. Muss mindestens einen Schlüssel enthalten; `null`-Werte werden übergangen. */
  data: Record<string, unknown>;
  /** Wenn `true`, wird die Seite nach dem Speichern im Suchindex aktualisiert, damit `semantic_search_handbook` die Änderung findet. Standard `false`. */
  reindex?: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookDeleteHandbookPageParams {
  /** Numerische ID der zu löschenden Seite (Pflicht). */
  page_id: number;
  /** Wenn `true`, wird der Eintrag der Seite zusätzlich aus dem Suchindex gelöscht, bevor die Seite entfällt. Standard `false`. */
  remove_index?: boolean;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookCopyHandbookPageParams {
  /** Numerische ID der Quellseite (Pflicht). */
  page_id: number;
  /** Neuer Titel für die Kopie. Ohne Angabe: Originaltitel plus ` (Kopie)`. */
  title?: string;
  /** Optionaler neuer Slug. Ohne Angabe wird er aus dem Titel der Kopie erzeugt. */
  slug?: string;
  /** Status der Kopie, Standard `draft`. Der Wert wird nicht gegen eine Liste geprüft. */
  status?: string;
  /** Wenn `true`, wird die Kopie nach dem Speichern direkt in den Suchindex aufgenommen (nur wenn der Index eingerichtet ist). */
  auto_index?: boolean;
  [weiteres: string]: unknown;
}

export interface HandbookReindexHandbookPageParams {
  /** Numerische ID der Seite (Pflicht). */
  page_id: number;
  /** Index-Aktion: `index` (neu aufnehmen), `update` (erneuern, Standard) oder `delete` (aus dem Index entfernen). */
  action?: "index" | "update" | "delete";
  [weiteres: string]: unknown;
}

export interface HandbookSummarizeHandbookPageParams {
  /** Numerische ID der Seite (Pflicht). */
  page_id: number;
  /** Optionaler Schwerpunkt der Auswertung als Freitext, z. B. `onboarding`, `qa` oder `training`. Ohne Angabe wird `standard` verwendet. */
  focus?: string;
  [weiteres: string]: unknown;
}

/** Handbuch — Das Betriebshandbuch besteht aus Handbuch-Seiten (SOPs, Richtlinien, Workflows, Schulungsunterlagen). */
export class HandbookArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Handbuch-Seiten auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/handbook/get_handbook_pages`
   */
  getHandbookPages(params?: HandbookGetHandbookPagesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'get_handbook_pages', params, options);
  }

  /**
   * Eine Handbuch-Seite abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/handbook/get_handbook_page`
   */
  getHandbookPage(params: HandbookGetHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'get_handbook_page', params, options);
  }

  /**
   * Handbuch per Stichwort durchsuchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/handbook/search_handbook_pages`
   */
  searchHandbookPages(params: HandbookSearchHandbookPagesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'search_handbook_pages', params, options);
  }

  /**
   * Handbuch semantisch durchsuchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/handbook/semantic_search_handbook`
   */
  semanticSearchHandbook(params: HandbookSemanticSearchHandbookParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'semantic_search_handbook', params, options);
  }

  /**
   * Systemweite Handbuch-Seiten auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/handbook/get_internal_handbook_pages`
   */
  getInternalHandbookPages(params?: HandbookGetInternalHandbookPagesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'get_internal_handbook_pages', params, options);
  }

  /**
   * Handbuch-Seite anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/handbook/create_handbook_page`
   */
  createHandbookPage(params: HandbookCreateHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'create_handbook_page', params, options);
  }

  /**
   * Handbuch-Seite aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/handbook/update_handbook_page`
   */
  updateHandbookPage(params: HandbookUpdateHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'update_handbook_page', params, options);
  }

  /**
   * Handbuch-Seite löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/handbook/delete_handbook_page`
   */
  deleteHandbookPage(params: HandbookDeleteHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'delete_handbook_page', params, options);
  }

  /**
   * Handbuch-Seite kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/handbook/copy_handbook_page`
   */
  copyHandbookPage(params: HandbookCopyHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'copy_handbook_page', params, options);
  }

  /**
   * Suchindex einer Seite pflegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/handbook/reindex_handbook_page`
   */
  reindexHandbookPage(params: HandbookReindexHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'reindex_handbook_page', params, options);
  }

  /**
   * Handbuch-Seite zusammenfassen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/handbook/summarize_handbook_page`
   */
  summarizeHandbookPage(params: HandbookSummarizeHandbookPageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('handbook', 'summarize_handbook_page', params, options);
  }
}

export interface SpeechanalysisGetSpeechProfilesParams {
  /** Optionaler Filter auf einen exakten Status-Text, z. B. `generated`. Ohne Angabe werden alle Status geliefert. */
  status?: string;
  /** Maximale Anzahl Profile pro Antwort. Standard 25, Minimum 1; eine feste Obergrenze gibt es im Code nicht. */
  limit?: number;
  /** Anzahl der zu überspringenden Profile für die Seiteneinteilung. Standard 0, negative Werte werden zu 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface SpeechanalysisGetSpeechProfileParams {
  /** Numerische ID des Sprachprofils (Pflicht). Die ID stammt aus `get_speech_profiles`. */
  profile_id: number;
  [weiteres: string]: unknown;
}

export interface SpeechanalysisUpdateSpeechProfileParams {
  /** Numerische ID des zu ändernden Profils (Pflicht). */
  profile_id: number;
  /** Objekt mit den zu ändernden Feldern: `name`, `status`, `lang` (Texte), `analysis` (Text) und `profile_data` (Objekt oder Text). Es muss mindestens ein Schlüssel enthalten sein. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface SpeechanalysisDeleteSpeechProfileParams {
  /** Numerische ID des zu löschenden Profils (Pflicht). */
  profile_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface SpeechanalysisSummarizeSpeechProfileParams {
  /** Numerische ID des Sprachprofils (Pflicht). */
  profile_id: number;
  [weiteres: string]: unknown;
}

/** Sprachprofile — Ein Sprachprofil (Linguistic-Profil) beschreibt, wie eine Person spricht und kommuniziert: Wortschatz, Satzbau, Kommunikationsstil und limbischer Typ. */
export class SpeechanalysisArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Sprachprofile auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/speechanalysis/get_speech_profiles`
   */
  getSpeechProfiles(params?: SpeechanalysisGetSpeechProfilesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('speechanalysis', 'get_speech_profiles', params, options);
  }

  /**
   * Ein Sprachprofil abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/speechanalysis/get_speech_profile`
   */
  getSpeechProfile(params: SpeechanalysisGetSpeechProfileParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('speechanalysis', 'get_speech_profile', params, options);
  }

  /**
   * Sprachprofil aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/speechanalysis/update_speech_profile`
   */
  updateSpeechProfile(params: SpeechanalysisUpdateSpeechProfileParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('speechanalysis', 'update_speech_profile', params, options);
  }

  /**
   * Sprachprofil löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/speechanalysis/delete_speech_profile`
   */
  deleteSpeechProfile(params: SpeechanalysisDeleteSpeechProfileParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('speechanalysis', 'delete_speech_profile', params, options);
  }

  /**
   * Sprachprofil kurz zusammenfassen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/speechanalysis/summarize_speech_profile`
   */
  summarizeSpeechProfile(params: SpeechanalysisSummarizeSpeechProfileParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('speechanalysis', 'summarize_speech_profile', params, options);
  }
}

export interface InterviewsGetTemplatesParams {
  /** Wenn `true` (Standard), werden zusätzlich die globalen Katalog-Vorlagen geliefert; bei `false` nur die Vorlagen deines Unternehmens. */
  include_catalog?: boolean;
  [weiteres: string]: unknown;
}

export interface InterviewsGetTemplateParams {
  /** Numerische ID der Vorlage (Pflicht), z. B. aus `get_templates`. */
  template_id: number;
  [weiteres: string]: unknown;
}

export interface InterviewsCreateTemplateParams {
  /** Objekt mit den Vorlagenfeldern: `name`, `status`, `interviewtype`, `userprompt`, `intro`, `outtro`, `interviewquestions` (Liste von Objekten mit `question`, `wanttoreach`, `prompt` oder JSON-Text), `locale`, `ispartner`, `iscatalog`. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface InterviewsUpdateTemplateParams {
  /** Numerische ID der zu ändernden Vorlage (Pflicht). */
  template_id: number;
  /** Objekt mit den zu ändernden Feldern (`name`, `status`, `interviewtype`, `userprompt`, `intro`, `outtro`, `interviewquestions`, `locale`, `ispartner`, `iscatalog`). `interviewquestions` ersetzt die gesamte Liste. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface InterviewsDeleteTemplateParams {
  /** Numerische ID der zu löschenden Vorlage (Pflicht). */
  template_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface InterviewsDuplicateTemplateParams {
  /** Numerische ID der Quellvorlage (Pflicht). */
  template_id: number;
  /** Optionaler Name der Kopie. Ohne Angabe: Originalname plus ` (Kopie)`. */
  name?: string;
  [weiteres: string]: unknown;
}

export interface InterviewsExportTemplateAsJsonParams {
  /** Numerische ID der zu exportierenden Vorlage (Pflicht). Zugänglich sind eigene Vorlagen und solche ohne Unternehmenszuordnung. */
  template_id: number;
  [weiteres: string]: unknown;
}

export interface InterviewsImportTemplateFromJsonParams {
  /** Objekt mit den Vorlagenfeldern (`name`, `status`, `interviewtype`, `userprompt`, `intro`, `outtro`, `interviewquestions`, `locale`, `ispartner`, `iscatalog`). Fragen sind eine Liste von Objekten mit `question`, `wanttoreach`, `prompt`. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface InterviewsGetInterviewsParams {
  /** Optionaler Filter auf einen exakten Status-Text. Neue Interviews haben den Status `new`; weitere Werte vergibst du selbst über `update_interview`. */
  status?: string;
  /** Maximale Anzahl Interviews pro Antwort. Standard 20, Minimum 1. */
  limit?: number;
  /** Anzahl zu überspringender Interviews für die Seiteneinteilung. Standard 0. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface InterviewsGetInterviewParams {
  /** Numerische ID des Interviews (Pflicht), z. B. aus `get_interviews` oder `create_interview`. */
  interview_id: number;
  [weiteres: string]: unknown;
}

export interface InterviewsCreateInterviewParams {
  /** Name des Interviews (Pflicht), z. B. ein Titel mit Gesprächspartner. */
  name: string;
  /** Optionale ID einer Vorlage. Typ und Fragen werden daraus übernommen. Muss zu deinem Unternehmen gehören oder global sein, sonst Fehler. */
  template_id?: number;
  /** Name des Gesprächspartners als Freitext. */
  interview_person?: string;
  /** Sprachcode des Interviews, z. B. `de` oder `en`. Standard `de`. */
  locale?: string;
  /** Anfangsstatus als Freitext. Standard `new`. */
  status?: string;
  /** Optionale ID eines Leads, auf den sich das Interview bezieht. Es wird nicht geprüft, ob der Lead existiert. */
  lead_id?: number;
  [weiteres: string]: unknown;
}

export interface InterviewsUpdateInterviewParams {
  /** Numerische ID des zu ändernden Interviews (Pflicht). */
  interview_id: number;
  /** Objekt mit den zu ändernden Feldern: `name`, `status`, `interview_person`, `locale`, `template_id` (Ganzzahl), `transcript` (Text), `insights` (Text). Mindestens ein bekannter Schlüssel ist sinnvoll. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface InterviewsDeleteInterviewParams {
  /** Numerische ID des zu löschenden Interviews (Pflicht). */
  interview_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface InterviewsGetInterviewInsightsParams {
  /** Numerische ID des Interviews (Pflicht). Es muss zu deinem Unternehmen gehören. */
  interview_id: number;
  [weiteres: string]: unknown;
}

/** Interviews — Der Bereich verwaltet Interviews und deren Vorlagen (Templates). */
export class InterviewsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Interview-Vorlagen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/get_templates`
   */
  getTemplates(params?: InterviewsGetTemplatesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'get_templates', params, options);
  }

  /**
   * Eine Interview-Vorlage abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/get_template`
   */
  getTemplate(params: InterviewsGetTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'get_template', params, options);
  }

  /**
   * Interview-Vorlage anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/create_template`
   */
  createTemplate(params: InterviewsCreateTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'create_template', params, options);
  }

  /**
   * Interview-Vorlage ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/update_template`
   */
  updateTemplate(params: InterviewsUpdateTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'update_template', params, options);
  }

  /**
   * Interview-Vorlage löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/interviews/delete_template`
   */
  deleteTemplate(params: InterviewsDeleteTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'delete_template', params, options);
  }

  /**
   * Interview-Vorlage duplizieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/duplicate_template`
   */
  duplicateTemplate(params: InterviewsDuplicateTemplateParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'duplicate_template', params, options);
  }

  /**
   * Interview-Vorlage exportieren
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/export_template_as_json`
   */
  exportTemplateAsJson(params: InterviewsExportTemplateAsJsonParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'export_template_as_json', params, options);
  }

  /**
   * Interview-Vorlage importieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/import_template_from_json`
   */
  importTemplateFromJson(params: InterviewsImportTemplateFromJsonParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'import_template_from_json', params, options);
  }

  /**
   * Interviews auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/get_interviews`
   */
  getInterviews(params?: InterviewsGetInterviewsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'get_interviews', params, options);
  }

  /**
   * Ein Interview abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/get_interview`
   */
  getInterview(params: InterviewsGetInterviewParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'get_interview', params, options);
  }

  /**
   * Interview anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/create_interview`
   */
  createInterview(params: InterviewsCreateInterviewParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'create_interview', params, options);
  }

  /**
   * Interview aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/interviews/update_interview`
   */
  updateInterview(params: InterviewsUpdateInterviewParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'update_interview', params, options);
  }

  /**
   * Interview löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/interviews/delete_interview`
   */
  deleteInterview(params: InterviewsDeleteInterviewParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'delete_interview', params, options);
  }

  /**
   * Insights und Qualitätswerte lesen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/interviews/get_interview_insights`
   */
  getInterviewInsights(params: InterviewsGetInterviewInsightsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('interviews', 'get_interview_insights', params, options);
  }
}

export interface AcademyGetCoursesParams {
  /** Optionaler Statusfilter, exakte Übereinstimmung, z. B. `draft`. Leer oder weggelassen: alle Status. Welche Werte tatsächlich vorkommen, siehst du in den Kursen selbst; `list_course_statuses` liefert nur eine feste Beispielliste. */
  status?: string;
  /** Optionaler Suchbegriff. Gefunden werden Kurse, deren Titel oder Beschreibung den Begriff enthalten (Teilstring, ohne Beachtung weiterer Felder). Leer oder weggelassen: keine Einschränkung. */
  search?: string;
  /** Maximale Anzahl Kurse pro Antwort, ganze Zahl. Standard 25, Mindestwert 1 (kleinere Werte werden auf 1 angehoben). Eine feste Obergrenze gibt es nicht. */
  limit?: number;
  /** Anzahl Kurse, die übersprungen werden, ganze Zahl ab 0 (Standard 0, negative Werte werden zu 0). Zum Blättern setzt du `offset` auf das Vielfache von `limit`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface AcademyGetCourseParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  [weiteres: string]: unknown;
}

export interface AcademyCreateCourseParams {
  /** Titel des Kurses (Pflicht, nicht leer). Wird getrimmt und HTML-maskiert gespeichert; aus dem Titel entsteht auch der interne Objektschlüssel. */
  title: string;
  /** Optionaler Kursstatus als Text, z. B. `draft`. Im Datenmodell sind `draft` und `publish` als Auswahlwerte vorgesehen. Weggelassen bleibt der Status leer. */
  status?: string;
  /** Optionale Sprache des Kurses als Text, z. B. `de` oder `en`. Es wird kein Format geprüft; der Wert wird so gespeichert (getrimmt, HTML-maskiert). */
  lang?: string;
  /** Optionaler Preis als Zahl, z. B. `490` oder `49.9`. Wird als Dezimalzahl übernommen; die Währung gibst du getrennt in `currency` an. */
  price?: number;
  /** Optionale Währung als Text, z. B. `EUR`. Es erfolgt keine Prüfung gegen eine Währungsliste. */
  currency?: string;
  /** Optional `true`, wenn der Kurs kostenlos ist, sonst `false`. Wird nur gesetzt, wenn der Schlüssel im Körper vorhanden ist; weggelassen bleibt der Standard des Datenmodells. */
  is_free?: boolean;
  /** Optionales Objekt mit Inhaltsfeldern. Erkannt werden die Schlüssel `short_description`, `description`, `meta_description`, `learnings`, `target_audience`, `benefit`, `image_prompt` und `video_prompt` (jeweils Text, HTML bei description/learnings möglich). Unbekannte Schlüssel werden ignoriert. */
  content?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AcademyUpdateCourseParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht, nicht leer). Erkannt werden title, status, lang, coursetype, accessibility, price (Zahl), currency, is_free (boolean), duration (Text) sowie `content` als Unterobjekt mit short_description, description, meta_description, learnings, target_audience, benefit, image_prompt und video_prompt. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AcademyDeleteCourseParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface AcademyGetCourseModulesParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  [weiteres: string]: unknown;
}

export interface AcademyGetModuleParams {
  /** ID des Moduls (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_course_modules` oder aus der Antwort von `create_module`. Zugriff besteht nur, wenn der zugehörige Kurs zur Firma deines Schlüssels gehört. */
  module_id: number;
  [weiteres: string]: unknown;
}

export interface AcademyCreateModuleParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  /** Titel des Moduls (Pflicht, nicht leer). Wird getrimmt und HTML-maskiert gespeichert. */
  title: string;
  /** Optionale Position im Kurs als ganze Zahl, z. B. `1` für das erste Modul. Es wird nicht auf Doppelungen geprüft. Weggelassen bleibt die Position leer. */
  order?: number;
  /** Optionale Beschreibung des Moduls als Text. Wird unverändert gespeichert (kein Maskieren). */
  description?: string;
  [weiteres: string]: unknown;
}

export interface AcademyUpdateModuleParams {
  /** ID des Moduls (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_course_modules` oder aus der Antwort von `create_module`. Zugriff besteht nur, wenn der zugehörige Kurs zur Firma deines Schlüssels gehört. */
  module_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht, nicht leer). Erkannt werden `title` (Text), `description` (Text) und `order` (ganze Zahl). Andere Schlüssel haben keine Wirkung. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AcademyDeleteModuleParams {
  /** ID des Moduls (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_course_modules` oder aus der Antwort von `create_module`. Zugriff besteht nur, wenn der zugehörige Kurs zur Firma deines Schlüssels gehört. */
  module_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface AcademyGetModuleLessonsParams {
  /** ID des Moduls (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_course_modules` oder aus der Antwort von `create_module`. Zugriff besteht nur, wenn der zugehörige Kurs zur Firma deines Schlüssels gehört. */
  module_id: number;
  [weiteres: string]: unknown;
}

export interface AcademyCreateLessonParams {
  /** ID des Moduls (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_course_modules` oder aus der Antwort von `create_module`. Zugriff besteht nur, wenn der zugehörige Kurs zur Firma deines Schlüssels gehört. */
  module_id: number;
  /** Titel der Lektion (Pflicht, nicht leer). Wird getrimmt und HTML-maskiert gespeichert. */
  title: string;
  /** Optionale Position innerhalb des Moduls als ganze Zahl, z. B. `1`. Doppelte Positionen werden nicht geprüft. Weggelassen bleibt die Position leer. */
  order?: number;
  /** Optionale Beschreibung der Lektion als Text. Wird unverändert gespeichert (kein Maskieren). */
  description?: string;
  /** Optionale Lernziele der Lektion als Text (im Datenmodell ein Formatierungsfeld, HTML ist möglich). Wird unverändert gespeichert. */
  learnings?: string;
  [weiteres: string]: unknown;
}

export interface AcademyUpdateLessonParams {
  /** ID der Lektion (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_module_lessons` oder `get_module` (Feld lessons) bzw. aus der Antwort von `create_lesson`. Zugriff besteht nur, wenn Modul und Kurs zur Firma deines Schlüssels gehören. */
  lesson_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht, nicht leer). Erkannt werden `title` (Text), `description` (Text), `order` (ganze Zahl) und `learnings` (Text). Andere Schlüssel haben keine Wirkung. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface AcademyDeleteLessonParams {
  /** ID der Lektion (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_module_lessons` oder `get_module` (Feld lessons) bzw. aus der Antwort von `create_lesson`. Zugriff besteht nur, wenn Modul und Kurs zur Firma deines Schlüssels gehören. */
  lesson_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface AcademySummarizeCourseParams {
  /** ID des Kurses (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_courses` oder aus der Antwort von `create_course`. Der Kurs muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kurs nicht gefunden oder kein Zugriff“. */
  course_id: number;
  [weiteres: string]: unknown;
}

export interface AcademyListCourseStatusesParams {
  [weiteres: string]: unknown;
}

/** Akademie — Der Bereich Academy verwaltet die Lerninhalte deiner Firma in drei Ebenen: Kurse enthalten Module, Module enthalten Lektionen. */
export class AcademyArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Kurse auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/get_courses`
   */
  getCourses(params?: AcademyGetCoursesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'get_courses', params, options);
  }

  /**
   * Kurs im Detail abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/get_course`
   */
  getCourse(params: AcademyGetCourseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'get_course', params, options);
  }

  /**
   * Kurs anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/create_course`
   */
  createCourse(params: AcademyCreateCourseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'create_course', params, options);
  }

  /**
   * Kurs aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/update_course`
   */
  updateCourse(params: AcademyUpdateCourseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'update_course', params, options);
  }

  /**
   * Kurs löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/academy/delete_course`
   */
  deleteCourse(params: AcademyDeleteCourseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'delete_course', params, options);
  }

  /**
   * Module eines Kurses auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/get_course_modules`
   */
  getCourseModules(params: AcademyGetCourseModulesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'get_course_modules', params, options);
  }

  /**
   * Modul im Detail abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/get_module`
   */
  getModule(params: AcademyGetModuleParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'get_module', params, options);
  }

  /**
   * Modul anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/create_module`
   */
  createModule(params: AcademyCreateModuleParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'create_module', params, options);
  }

  /**
   * Modul aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/update_module`
   */
  updateModule(params: AcademyUpdateModuleParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'update_module', params, options);
  }

  /**
   * Modul löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/academy/delete_module`
   */
  deleteModule(params: AcademyDeleteModuleParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'delete_module', params, options);
  }

  /**
   * Lektionen eines Moduls auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/get_module_lessons`
   */
  getModuleLessons(params: AcademyGetModuleLessonsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'get_module_lessons', params, options);
  }

  /**
   * Lektion anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/create_lesson`
   */
  createLesson(params: AcademyCreateLessonParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'create_lesson', params, options);
  }

  /**
   * Lektion aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/academy/update_lesson`
   */
  updateLesson(params: AcademyUpdateLessonParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'update_lesson', params, options);
  }

  /**
   * Lektion löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/academy/delete_lesson`
   */
  deleteLesson(params: AcademyDeleteLessonParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'delete_lesson', params, options);
  }

  /**
   * Kurs zusammenfassen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/summarize_course`
   */
  summarizeCourse(params: AcademySummarizeCourseParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'summarize_course', params, options);
  }

  /**
   * Bekannte Kursstatus auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/academy/list_course_statuses`
   */
  listCourseStatuses(params?: AcademyListCourseStatusesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('academy', 'list_course_statuses', params, options);
  }
}

export interface CampaignsGetCampaignsParams {
  /** Optionaler Filter auf den Aktivstatus: `active` (nur aktive) oder `inactive` (nur inaktive); Groß-/Kleinschreibung egal. Andere Werte und leer: kein Statusfilter. */
  status?: string;
  /** Optionaler Filter auf den Provider, exakte Übereinstimmung, z. B. `google`. Im Datenmodell sind google, facebook, instagram, tiktok, linkedin und x vorgesehen. Leer oder weggelassen: alle Provider. */
  provider?: string;
  /** Maximale Anzahl Kampagnen pro Antwort, ganze Zahl. Standard 20, Mindestwert 1 (kleinere Werte werden auf 1 angehoben). Eine feste Obergrenze gibt es nicht. */
  limit?: number;
  /** Anzahl Kampagnen, die übersprungen werden, ganze Zahl ab 0 (Standard 0, negative Werte werden zu 0). Zum Blättern setzt du `offset` auf das Vielfache von `limit`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface CampaignsGetCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  [weiteres: string]: unknown;
}

export interface CampaignsCreateCampaignParams {
  /** Name der Kampagne (Pflicht, nicht leer). Wird getrimmt und HTML-maskiert gespeichert. */
  name: string;
  /** Optionaler Provider als Text, z. B. `google`. Standard `custom`. Im Datenmodell vorgesehen sind google, facebook, instagram, tiktok, linkedin und x; es wird nicht gegen diese Liste geprüft. */
  provider?: string;
  /** Optionaler Kampagnentyp als Text, z. B. `search`. Standard `custom`. Im Datenmodell vorgesehen sind image, video, lead, text und search; es wird nicht gegen diese Liste geprüft. */
  campaign_type?: string;
  /** Optionaler Kampagneninhalt als Text (z. B. Anzeigentext oder JSON als Zeichenkette). Wird unverändert gespeichert. Standard: leere Zeichenkette. */
  content?: string;
  /** Optionale ID eines Keyword-Objekts als ganze Zahl. Sie wird nur gespeichert; es erfolgt keine Prüfung, ob das Keyword existiert oder zu deiner Firma gehört. */
  keyword_id?: number;
  /** Optionale ID einer Landingpage-Vorlage als ganze Zahl. Sie wird nur gespeichert, ohne Existenz- oder Zugehörigkeitsprüfung. */
  template_id?: number;
  /** Optionale ID des verknüpften Dokuments (Landingpage) als ganze Zahl. Sie wird nur gespeichert, ohne Existenz- oder Zugehörigkeitsprüfung. */
  document_id?: number;
  /** Optionales Budget als Zahl, z. B. `25` oder `49.9`. Die Funktion gibt die Zahl ohne Währungs- oder Zeitraumangabe weiter; die Bedeutung (z. B. Tagesbudget) legst du selbst fest. */
  budget?: number;
  /** Optionale Kanalangabe als Text. Im Datenmodell ist ein Auswahlfeld mit den Werten `ppc`, `socialmedia` und `email` vorgesehen; der Wert wird nicht gegen diese Liste geprüft. */
  channels?: string;
  /** Aktivstatus der neuen Kampagne, `true` oder `false`. Standard `true`. Wird nur ausgewertet, wenn der Schlüssel im Körper steht. */
  is_active?: boolean;
  [weiteres: string]: unknown;
}

export interface CampaignsUpdateCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  /** Objekt mit den zu ändernden Feldern (Pflicht). Erkannt werden `name`, `provider`, `campaign_type`, `content` (Text), `is_active` (boolean), `keyword_id`, `template_id`, `document_id` (ganze Zahlen), `budget` (Zahl), `channels` (Text) und `description` (Text). Andere Schlüssel haben keine Wirkung. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface CampaignsDeleteCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface CampaignsCopyCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  /** Optionaler Name der Kopie. Weggelassen heißt sie „<Name der Quelle> (Kopie)“. Wird getrimmt und HTML-maskiert gespeichert. */
  name?: string;
  /** Optionaler Aktivstatus der Kopie, `true` oder `false`. Weggelassen übernimmt die Kopie den Aktivstatus der Quellkampagne. */
  is_active?: boolean;
  [weiteres: string]: unknown;
}

export interface CampaignsCreateGoogleSearchCampaignParams {
  /** ID der Landingpage-Vorlage (ganze Zahl, Pflicht). Sie wird an der Kampagne gespeichert und dient zusammen mit dem Keyword zum Wiederfinden der angelegten Kampagne. Es wird nicht geprüft, ob die Vorlage existiert. */
  template_id: number;
  /** ID des Keyword-Objekts (ganze Zahl, Pflicht). Aus dem Keyword (Suchbegriff, Intention, Schmerz, Lösung) entstehen die Anzeigentexte; der Suchbegriff wird als Keyword der Anzeigengruppe eingetragen. */
  keyword_id: number;
  /** ID des verknüpften Dokuments bzw. der Landingpage (ganze Zahl, Pflicht). Sie wird an der Kampagne gespeichert; die Ziel-URL der Anzeige wird dadurch nicht gesetzt. */
  document_id: number;
  [weiteres: string]: unknown;
}

export interface CampaignsUpdateGoogleSearchCampaignParams {
  /** ID der Kampagne (ganze Zahl, Pflicht). Sie muss zu deiner Firma gehören und ein Keyword (`keyword_id`) hinterlegt haben, aus dem die neuen Texte entstehen. Typischerweise ist es eine Kampagne aus `create_google_search_campaign`. */
  campaign_id: number;
  [weiteres: string]: unknown;
}

export interface CampaignsActivateCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface CampaignsPauseCampaignParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  [weiteres: string]: unknown;
}

export interface CampaignsGetCampaignPerformanceParams {
  /** ID der Kampagne (Pimcore-Objekt-ID, ganze Zahl). Du bekommst sie aus `get_campaigns` oder aus der Antwort von `create_campaign`. Die Kampagne muss zur Firma deines Schlüssels gehören, sonst antwortet die Funktion mit „Kampagne nicht gefunden oder kein Zugriff“. */
  campaign_id: number;
  [weiteres: string]: unknown;
}

export interface CampaignsGetCampaignStatsParams {
  [weiteres: string]: unknown;
}

/** Werbekampagnen — Der Bereich Kampagnen verwaltet die Werbekampagnen deiner Firma. */
export class CampaignsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Kampagnen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/campaigns/get_campaigns`
   */
  getCampaigns(params?: CampaignsGetCampaignsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'get_campaigns', params, options);
  }

  /**
   * Kampagne im Detail abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/campaigns/get_campaign`
   */
  getCampaign(params: CampaignsGetCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'get_campaign', params, options);
  }

  /**
   * Kampagne manuell anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/create_campaign`
   */
  createCampaign(params: CampaignsCreateCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'create_campaign', params, options);
  }

  /**
   * Kampagne aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/update_campaign`
   */
  updateCampaign(params: CampaignsUpdateCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'update_campaign', params, options);
  }

  /**
   * Kampagne löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/campaigns/delete_campaign`
   */
  deleteCampaign(params: CampaignsDeleteCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'delete_campaign', params, options);
  }

  /**
   * Kampagne kopieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/copy_campaign`
   */
  copyCampaign(params: CampaignsCopyCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'copy_campaign', params, options);
  }

  /**
   * Google-Suchkampagne mit KI-Texten anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/create_google_search_campaign`
   */
  createGoogleSearchCampaign(params: CampaignsCreateGoogleSearchCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'create_google_search_campaign', params, options);
  }

  /**
   * Google-Suchkampagne neu texten
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/update_google_search_campaign`
   */
  updateGoogleSearchCampaign(params: CampaignsUpdateGoogleSearchCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'update_google_search_campaign', params, options);
  }

  /**
   * Kampagne aktivieren
   *
   * Recht am Schlüssel: `veroeffentlichen` · `POST /platform/campaigns/activate_campaign`
   */
  activateCampaign(params: CampaignsActivateCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'activate_campaign', params, options);
  }

  /**
   * Kampagne pausieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/campaigns/pause_campaign`
   */
  pauseCampaign(params: CampaignsPauseCampaignParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'pause_campaign', params, options);
  }

  /**
   * Kampagnen-Performance abrufen (Platzhalter)
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/campaigns/get_campaign_performance`
   */
  getCampaignPerformance(params: CampaignsGetCampaignPerformanceParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'get_campaign_performance', params, options);
  }

  /**
   * Kampagnen-Statistik der Firma
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/campaigns/get_campaign_stats`
   */
  getCampaignStats(params?: CampaignsGetCampaignStatsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('campaigns', 'get_campaign_stats', params, options);
  }
}

export interface CrmGetLeadsParams {
  /** Exakter Status-Wert, nach dem gefiltert wird, z. B. `new`, `won` oder `lost`. Welche Werte vorkommen, hängt von deiner Pipeline ab; es wird nur auf Gleichheit geprüft. Leer lassen für alle Status. */
  status?: string;
  /** ID der CRM-Pipeline, deren Leads du sehen willst (Ganzzahl). Die IDs liefert `list_pipelines`. Ohne Angabe werden Leads aller Pipelines geliefert. */
  pipeline_id?: number;
  /** Suchbegriff, der als Teilstring in Vorname, Nachname, E-Mail-Adresse oder Firma gesucht wird (ohne Beachtung der Groß-/Kleinschreibung, je nach Datenbank-Einstellung). Sonderzeichen wie & oder Anführungszeichen werden vor der Suche HTML-codiert. */
  search?: string;
  /** Exakter Marketplace-Status des Leads, z. B. wenn Leads im Lead-Marktplatz angeboten werden. Es wird nur auf Gleichheit geprüft; leer lassen für alle. */
  marketplace_status?: string;
  /** Maximale Anzahl der zurückgegebenen Leads (Ganzzahl ab 1, Standard 25). Werte unter 1 werden auf 1 angehoben; ein Maximum gibt es nicht. */
  limit?: number;
  /** Anzahl der Leads, die übersprungen werden (Ganzzahl ab 0, Standard 0). Zusammen mit `limit` zum Blättern: Seite 2 bei `limit` 25 ist `offset` 25. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface CrmGetLeadParams {
  /** Numerische ID des Leads, wie sie in `id` von `get_leads` und `create_lead` steht. Leads anderer Unternehmen werden nicht herausgegeben und führen zum selben Fehler wie eine unbekannte ID. */
  lead_id: number;
  [weiteres: string]: unknown;
}

export interface CrmCreateLeadParams {
  /** Objekt mit den Lead-Feldern, z. B. `firstname`, `lastname`, `email`, `phone`, `company`, `status`, `description`, `pipeline_id`. Muss mindestens ein Feld enthalten, sonst Fehler „Leaddaten fehlen“. Text als String senden; Zahlenfelder wie `price` oder `keyword_id` als Zahl; `chatdata` und `ipdata` dürfen auch Objekte sein und werden als JSON gespeichert. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface CrmUpdateLeadParams {
  /** Numerische ID des Leads, den du ändern willst (aus `get_leads`). Der Lead muss zu deinem Unternehmen gehören. */
  lead_id: number;
  /** Objekt mit den zu ändernden Feldern, z. B. `{"phone": "+49 211 5550199", "status": "contacted"}`. Nicht genannte Felder bleiben unverändert. Zum Leeren eines Textfelds sende einen leeren String. Ohne `data` werden die übrigen Körperfelder als Änderungen verwendet. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface CrmDeleteLeadParams {
  /** Numerische ID des zu löschenden Leads (aus `get_leads`). Leads anderer Unternehmen und unbekannte IDs führen zu einem Fehler und werden nicht gelöscht. */
  lead_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface CrmChangeLeadStatusParams {
  /** Numerische ID des Leads (aus `get_leads`). Pflichtangabe; der Lead muss zu deinem Unternehmen gehören. */
  lead_id: number;
  /** Neuer Status als Text, z. B. `contacted`, `qualified`, `won` oder `lost`. Die zulässigen Werte hängen von deiner Pipeline ab und werden nicht serverseitig geprüft. Weglassen, um den Status zu behalten. */
  status?: string;
  /** ID der Pipeline, in die der Lead verschoben wird (Ganzzahl, siehe `list_pipelines`). Weglassen, um die Pipeline zu behalten. */
  pipeline_id?: number;
  /** Neuer Marketplace-Status als Text. Weglassen, um den bisherigen Wert zu behalten. */
  marketplace_status?: string;
  [weiteres: string]: unknown;
}

export interface CrmGetAppointmentsParams {
  /** Exakter Termin-Status, z. B. `scheduled`, `confirmed`, `cancelled`. Es wird auf Gleichheit geprüft; leer lassen für alle Status (abgesagte Termine eingeschlossen). */
  status?: string;
  /** ID des Leads, dessen Termine du sehen willst (Ganzzahl, aus `get_leads`). Ohne Angabe werden Termine aller Leads geliefert. */
  lead_id?: number;
  /** Beginn des Zeitraums als ISO-8601-Zeitpunkt, z. B. `2026-11-01T00:00:00+01:00`; auch ein reines Datum `2026-11-01` oder ein Unix-Zeitstempel wird verstanden. Es werden Termine ab diesem Zeitpunkt geliefert. Ungültige Werte führen zu einem Fehler. */
  from?: string;
  /** Ende des Zeitraums, gleiches Format wie `from`. Es werden Termine bis einschließlich diesem Zeitpunkt geliefert; ein reines Datum bedeutet 00:00 Uhr dieses Tages. */
  to?: string;
  /** Maximale Anzahl der Termine (Ganzzahl ab 1, Standard 25). Ein Maximum gibt es nicht. */
  limit?: number;
  /** Anzahl der zu überspringenden Termine (Ganzzahl ab 0, Standard 0), zum Blättern zusammen mit `limit`. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface CrmScheduleAppointmentParams {
  /** Startzeit des Termins als ISO-8601-Zeitpunkt mit Offset, z. B. `2026-11-12T10:00:00+01:00`. Ohne Offset gilt die Zeitzone des Servers. Auch Unix-Zeitstempel werden akzeptiert. Pflichtangabe. */
  date: string;
  /** Art des Termins als Text, z. B. `firstcall`, `followup`, `interview`, `consulting`. Der Wert wird auch zur Bildung des internen Schlüssels verwendet. Frei wählbar, es gibt keine feste Liste. */
  appointment_type?: string;
  /** Status des Termins, z. B. `scheduled` (Standard, wenn weggelassen) oder `confirmed`. Es wird nicht gegen eine feste Liste geprüft. */
  status?: string;
  /** Dauer in Minuten (Ganzzahl), z. B. 45. Fehlt sie, bleibt das Feld leer; `check_availability` rechnet bei leerer Dauer mit 45 Minuten. */
  duration?: number;
  /** ID des verknüpften Leads (Ganzzahl, aus `get_leads`). Es wird nicht geprüft, ob der Lead zu deinem Unternehmen gehört – übergib nur eigene IDs. */
  lead_id?: number;
  /** Optionale ID eines bestehenden Interviews, das mit dem Termin verknüpft wird (Ganzzahl). Es wird kein Interview angelegt. */
  interview_id?: number;
  /** Kanal des Termins als Text, z. B. `video`, `phone`, `onsite`. Frei wählbar. */
  channel?: string;
  /** Link zum Online-Meeting oder Adresse des Treffpunkts als Text. Wird unverändert (HTML-codiert) gespeichert, nicht auf Gültigkeit geprüft. */
  meeting_link?: string;
  /** Kontaktperson oder Kurzbeschreibung als Text, z. B. `Mira Beispiel (mira.beispiel@example.com)`. Erscheint in `check_availability` unter den belegten Zeitfenstern. */
  contact?: string;
  /** Interne Notizen zum Termin. HTML-Tags werden entfernt. Spätere Absagegründe (`cancel_appointment`) werden an diesen Text angehängt. */
  notes?: string;
  /** Wahrheitswert: `true`, wenn nach dem Termin eine Nachbearbeitung nötig ist. Standard ist `false`. */
  follow_up_required?: boolean;
  [weiteres: string]: unknown;
}

export interface CrmUpdateAppointmentParams {
  /** Numerische ID des Termins (Feld `id` aus `get_appointments`). Der Termin muss zu deinem Unternehmen gehören, sonst Fehler „Termin nicht gefunden oder kein Zugriff“. */
  appointment_id: number;
  /** Objekt mit den zu ändernden Feldern, z. B. `{"date": "2026-11-13T14:00:00+01:00", "status": "confirmed"}`. Datumsfelder als ISO-8601-Zeitpunkt, Wahrheitswerte als `true`/`false`, `duration` in Minuten. Mit `null` bei `lead_id`, `member_id` oder `interview_id` löst du die Verknüpfung. */
  changes: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface CrmCancelAppointmentParams {
  /** Numerische ID des Termins (Feld `id` aus `get_appointments`). Pflichtangabe; der Termin muss zu deinem Unternehmen gehören. */
  appointment_id: number;
  /** Grund der Absage als Text. Wird mit Datum und Uhrzeit an die Notizen des Termins angehängt; HTML-Tags werden entfernt. Leerer Text wird ignoriert. */
  reason?: string;
  /** Optional ein eigener Status statt `cancelled`, z. B. `no-show`. Ist der Wert leer, gilt `cancelled`. `cancelled` und `no-show` gelten in `check_availability` als frei. */
  status?: string;
  [weiteres: string]: unknown;
}

export interface CrmListPipelinesParams {
  [weiteres: string]: unknown;
}

export interface CrmListWorkflowsParams {
  [weiteres: string]: unknown;
}

export interface CrmListEmailTemplatesParams {
  /** Wahrheitswert. Bei `true` werden nur aktive Vorlagen geliefert, bei `false` oder ohne Angabe alle Vorlagen, auch deaktivierte. */
  active_only?: boolean;
  [weiteres: string]: unknown;
}

export interface CrmSummarizeLeadParams {
  /** Numerische ID des Leads (aus `get_leads`). Pflichtangabe; der Lead muss zu deinem Unternehmen gehören. */
  lead_id: number;
  [weiteres: string]: unknown;
}

export interface CrmCheckAvailabilityParams {
  /** Der zu prüfende Tag im Format `YYYY-MM-DD`, z. B. `2026-11-12`. Muss genau in dieser Schreibweise angegeben werden, da sie direkt mit dem Terminbestand verglichen wird. Pflichtangabe. */
  date: string;
  /** Gewünschte Startzeit im Format `HH:MM` (24 Stunden), z. B. `14:00`. Mit der Angabe liefert die Antwort `preferred_time_available` und eine passende Empfehlung samt bis zu drei Alternativen. Ohne Angabe ist der Wert `false`. */
  preferred_time?: string;
  /** Gewünschte Dauer in Minuten (Ganzzahl). Standard 45, Werte unter 15 werden auf 15 angehoben. Bestimmt, welche Startzeiten als frei gelten. */
  duration?: number;
  /** Im Schema vorgesehene Terminart (z. B. `firstcall`, `interview`). Der Wert wird derzeit nicht ausgewertet; das Ergebnis ist für alle Arten gleich. */
  appointment_type?: string;
  [weiteres: string]: unknown;
}

export interface CrmTriggerWebsiteCrawlParams {
  /** Adresse der zu analysierenden Webseite, mit oder ohne `https://` (z. B. `www.example.com`). Optional; ohne Angabe wird die bei der Firma gespeicherte Domain bzw. URL genommen. Der Text wird getrimmt und HTML-codiert. */
  url?: string;
  [weiteres: string]: unknown;
}

/** CRM — Der Bereich CRM gibt dir Zugriff auf die Leads, Termine und Firmen deines Unternehmens. */
export class CrmArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Leads auflisten und filtern
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/get_leads`
   */
  getLeads(params?: CrmGetLeadsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'get_leads', params, options);
  }

  /**
   * Einen Lead im Detail abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/get_lead`
   */
  getLead(params: CrmGetLeadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'get_lead', params, options);
  }

  /**
   * Lead anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/create_lead`
   */
  createLead(params: CrmCreateLeadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'create_lead', params, options);
  }

  /**
   * Lead aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/update_lead`
   */
  updateLead(params: CrmUpdateLeadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'update_lead', params, options);
  }

  /**
   * Lead dauerhaft löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/crm/delete_lead`
   */
  deleteLead(params: CrmDeleteLeadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'delete_lead', params, options);
  }

  /**
   * Status oder Pipeline eines Leads ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/change_lead_status`
   */
  changeLeadStatus(params: CrmChangeLeadStatusParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'change_lead_status', params, options);
  }

  /**
   * Termine auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/get_appointments`
   */
  getAppointments(params?: CrmGetAppointmentsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'get_appointments', params, options);
  }

  /**
   * Termin anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/schedule_appointment`
   */
  scheduleAppointment(params: CrmScheduleAppointmentParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'schedule_appointment', params, options);
  }

  /**
   * Termin ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/update_appointment`
   */
  updateAppointment(params: CrmUpdateAppointmentParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'update_appointment', params, options);
  }

  /**
   * Termin absagen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/cancel_appointment`
   */
  cancelAppointment(params: CrmCancelAppointmentParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'cancel_appointment', params, options);
  }

  /**
   * CRM-Pipelines auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/list_pipelines`
   */
  listPipelines(params?: CrmListPipelinesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'list_pipelines', params, options);
  }

  /**
   * CRM-Workflows auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/list_workflows`
   */
  listWorkflows(params?: CrmListWorkflowsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'list_workflows', params, options);
  }

  /**
   * E-Mail-Vorlagen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/list_email_templates`
   */
  listEmailTemplates(params?: CrmListEmailTemplatesParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'list_email_templates', params, options);
  }

  /**
   * Lead zusammenfassen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/summarize_lead`
   */
  summarizeLead(params: CrmSummarizeLeadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'summarize_lead', params, options);
  }

  /**
   * Freie Termine an einem Tag prüfen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/crm/check_availability`
   */
  checkAvailability(params: CrmCheckAvailabilityParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'check_availability', params, options);
  }

  /**
   * Website-Analyse starten
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/crm/trigger_website_crawl`
   */
  triggerWebsiteCrawl(params?: CrmTriggerWebsiteCrawlParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('crm', 'trigger_website_crawl', params, options);
  }
}

export interface ArangoGetCompanyKnowledgeGraphParams {
  /** Traversierungstiefe als Ganzzahl von 1 bis 3, Standard 2. Werte außerhalb des Bereichs werden auf 1 bzw. 3 begrenzt, 0 oder nicht angegeben ergibt 2. Tiefe 1 zählt nur direkte Nachbarn der Firma, höhere Werte auch deren Nachbarn. */
  depth?: number;
  [weiteres: string]: unknown;
}

export interface ArangoGetCompanySummaryParams {
  [weiteres: string]: unknown;
}

export interface ArangoFindConnectionsParams {
  /** Name der Sammlung des Startdatensatzes in Kleinschreibung, z. B. `leads`, `books`, `members`. Die möglichen Namen liefert `get_company_summary`. */
  from_collection: string;
  /** Schlüssel (`_key`) des Startdatensatzes innerhalb der Sammlung, z. B. `lead_12345`. Wird aus `search_graph` oder `get_entity_context` übernommen. */
  from_key: string;
  /** Name der Sammlung des Zieldatensatzes, z. B. `books`. Gleiche Schreibweise wie bei `from_collection`. */
  to_collection: string;
  /** Schlüssel (`_key`) des Zieldatensatzes, z. B. `book_67890`. Der Datensatz muss zu deinem Unternehmen gehören. */
  to_key: string;
  [weiteres: string]: unknown;
}

export interface ArangoGetEntityContextParams {
  /** Name der Sammlung des Startdatensatzes in Kleinschreibung, z. B. `members`, `books`, `leads`. Die vorhandenen Sammlungen siehst du in `get_company_summary`. */
  collection: string;
  /** Schlüssel (`_key`) des Startdatensatzes, z. B. `member_123`. Erlaubt sind Buchstaben, Ziffern und einige Sonderzeichen wie `_`, `-` und `:`. */
  key: string;
  /** Traversierungstiefe, Ganzzahl bis 3, Standard 1. Tiefe 1 liefert direkte Nachbarn, 2 auch deren Nachbarn usw. Mit der Tiefe wächst die Treffermenge schnell; gedeckelt bei 200 Knoten. */
  depth?: number;
  [weiteres: string]: unknown;
}

export interface ArangoSearchGraphParams {
  /** Name der Sammlung in Kleinschreibung, z. B. `leads`, `books`, `offers`, `testimonials`, `interviews`, `appointments`, `podcasts`, `courses`. Welche Sammlungen bei dir Daten haben, zeigt `get_company_summary`. */
  collection: string;
  /** Liste von Bedingungen, höchstens 8 (weitere werden ignoriert); alle müssen zutreffen. Jede Bedingung ist ein Objekt mit `field` (Feldname, nur Buchstaben, Ziffern, Unterstrich, höchstens 64 Zeichen) und `op`; `value` ist bei Vergleichen Pflicht. Ohne Filter werden alle Datensätze der Sammlung berücksichtigt. Erlaubte Operatoren: `==`, `!=`, `<`, `<=`, `>`, `>=`, `contains` (Teilstring ohne Beachtung der Groß-/Kleinschreibung), `exists` (Feld ist nicht leer) und `missing` (Feld fehlt oder ist leer). Bei `exists`/`missing` entfällt `value`; sonst muss es Text, Zahl oder Wahrheitswert sein. */
  filters?: Array<Record<string, unknown>>;
  /** Liste der Feldnamen, die je Treffer zurückgegeben werden, höchstens 20. `_key` und `_className` kommen immer mit. Fehlt die Angabe, werden Standardfelder geliefert (name, firstname, lastname, title, email, status, _modificationDate). */
  fields?: Array<string>;
  /** Feldname, nach dem sortiert wird, z. B. `_modificationDate` für die zuletzt geänderten Datensätze zuerst. Optional; muss ein gültiger Feldname sein. */
  sort_field?: string;
  /** Sortierrichtung `ASC` (aufsteigend) oder `DESC` (absteigend, Standard). Wirkt nur, wenn `sort_field` gesetzt ist. */
  sort_dir?: "ASC" | "DESC";
  /** Maximale Zahl der zurückgegebenen Treffer, Ganzzahl. Standard 25, größter Wert 50; kleinere Werte als 1 ergeben den Standard. `count` in der Antwort nennt trotzdem die Gesamtzahl. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface ArangoGetActivityTimelineParams {
  /** Anzahl der zurückgegebenen Einträge, Ganzzahl. Standard 20, größter Wert 50. Nicht angegeben oder 0 ergibt 20. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface ArangoWissenSucheParams {
  /** Suchanfrage in natürlicher Sprache oder als Stichwort, z. B. `Garantie Werkzeugwartung`. Pflichtangabe, nicht leer. Für die Bedeutungssuche sind ganze Fragen geeignet, für die Textsuche in den Unternehmensdaten kurze Begriffe. */
  query: string;
  /** Maximale Anzahl der Treffer aus Wissensartikeln und Unternehmensdaten, Ganzzahl. Standard 5, größter Wert 15. Dateifunde (bis zu 3) kommen zusätzlich dazu. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface ArangoWissenGraphParams {
  /** Sammlung des Ausgangsdokuments in Kleinschreibung, z. B. `stories` oder `handbook_pages`. Bei Treffern aus `wissen_suche` steht der Wert in `collection`; Sammlungsnamen mit Daten liefert `get_company_summary`. */
  collection: string;
  /** Schlüssel des Ausgangsdokuments (`_key`) im Graph-Format, z. B. `handbook_page_204`. Bei Treffern aus `wissen_suche` steht er in `id`. */
  key: string;
  /** Tiefe der Verknüpfungssuche als Ganzzahl bis 3, Standard 2. Tiefe 1 liefert nur direkt verbundene Inhalte; größere Werte liefern deutlich mehr Knoten (gedeckelt bei 200). */
  depth?: number;
  [weiteres: string]: unknown;
}

/** Wissensgraph — Der Bereich Wissensgraph bildet die Daten deines Unternehmens als Netz ab: Datensätze (Leads, Termine, Bücher, Angebote, Mitglieder, Kurse …) liegen in Sammlungen und sind über Kanten miteinander verbunden. */
export class ArangoArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Überblick über den Wissensgraphen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/get_company_knowledge_graph`
   */
  getCompanyKnowledgeGraph(params?: ArangoGetCompanyKnowledgeGraphParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'get_company_knowledge_graph', params, options);
  }

  /**
   * Kompakte Firmenübersicht mit Zählungen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/get_company_summary`
   */
  getCompanySummary(params?: ArangoGetCompanySummaryParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'get_company_summary', params, options);
  }

  /**
   * Kürzeste Verbindung zwischen zwei Datensätzen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/find_connections`
   */
  findConnections(params: ArangoFindConnectionsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'find_connections', params, options);
  }

  /**
   * Nachbarn eines Datensatzes anzeigen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/get_entity_context`
   */
  getEntityContext(params: ArangoGetEntityContextParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'get_entity_context', params, options);
  }

  /**
   * Datensätze einer Sammlung filtern
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/search_graph`
   */
  searchGraph(params: ArangoSearchGraphParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'search_graph', params, options);
  }

  /**
   * Letzte Änderungen im Unternehmen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/get_activity_timeline`
   */
  getActivityTimeline(params?: ArangoGetActivityTimelineParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'get_activity_timeline', params, options);
  }

  /**
   * Unternehmenswissen durchsuchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/wissen_suche`
   */
  wissenSuche(params: ArangoWissenSucheParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'wissen_suche', params, options);
  }

  /**
   * Verknüpfte Inhalte zu einem Dokument
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/arango/wissen_graph`
   */
  wissenGraph(params: ArangoWissenGraphParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('arango', 'wissen_graph', params, options);
  }
}

export interface BusinessModelGetBusinessModelParams {
  [weiteres: string]: unknown;
}

export interface BusinessModelUpdateBusinessModelParams {
  /** Objekt mit den zu ändernden Feldern. `offer_components`: Liste von `{name, role (mandatory|optional|alternative), cycle (once|monthly|yearly), note}`. `calculation_basis`: `{hourly_rate (Cent), target_margin_pct, notes, positions: [{ref (offer:<id>|product:<id>|article:<id>|null), name, cycle, price (Cent), cost (Cent), effort_hours_internal, effort_hours_external}]}`. `story_defaults`: `{mentor{g_mentor_character,h_friendship,i_competence[]}, plan{j_mentor_plan,k_process_plan[3],l_security_plan[3]}, motive[], bild{briefing}, sprache{person_bezeichnung}}`. `default_contract_months`: Ziffern und Kommas (z. B. `12` oder `12,24`). Texte werden getrimmt, leere Texte setzen das Feld auf leer. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

/** Geschäftsmodell — Das Geschäftsmodell beschreibt, wie dein Unternehmen Geld verdient und Angebote kalkuliert. */
export class BusinessModelArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Geschäftsmodell lesen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/business_model/get_business_model`
   */
  getBusinessModel(params?: BusinessModelGetBusinessModelParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('business_model', 'get_business_model', params, options);
  }

  /**
   * Geschäftsmodell ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/business_model/update_business_model`
   */
  updateBusinessModel(params: BusinessModelUpdateBusinessModelParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('business_model', 'update_business_model', params, options);
  }
}

export interface ProductsSearchProductsParams {
  /** Suchtext, z. B. „Roboter mit langer Akkulaufzeit“. Optional, wenn `filters` gesetzt ist; dann bestimmt der Text nur die Reihenfolge der gefilterten Produkte. */
  query?: string;
  /** Maximale Anzahl gelieferter Treffer. Ganzzahl von 1 bis 20, Standard 12; Werte außerhalb werden auf diesen Bereich begrenzt. */
  limit?: number;
  /** Liste von bis zu 4 Zahlenfiltern, alle müssen erfüllt sein. Jeder Filter ist ein Objekt mit `attr` (`akkulaufzeit_min`, `akkukapazitaet_wh`, `ladezeit_min`, `gewicht_kg`, `flaechenleistung_m2h`, `arbeitsbreite_cm`, `steigung_pct`, `laerm_db`, `preis_eur`), `op` (`gte` ≥, `lte` ≤, `eq` =) und `value` (Zahl in der Einheit des Attributs). */
  filters?: Array<Record<string, unknown>>;
  [weiteres: string]: unknown;
}

/** Produkte — Der Bereich durchsucht den Produktkatalog deines Unternehmens. */
export class ProductsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Produkte suchen und filtern
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/products/search_products`
   */
  searchProducts(params?: ProductsSearchProductsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('products', 'search_products', params, options);
  }
}

export interface SparringGetContentIdeasParams {
  /** Optionaler Statusfilter, exakt verglichen: `active`, `in_progress` oder `archived`. Ohne Angabe werden alle Ideen außer archivierten geliefert. */
  status?: string;
  /** Optionaler Filter auf den Ziel-Typ: `podcast_episode`, `book_chapter`, `blog_post`, `social_media` oder `landingpage`. Wird nach der Begrenzung durch `limit` angewendet. */
  content_type?: string;
  /** Optionale Mindestgrenze für den Composite-Score als Zahl zwischen 0.0 und 1.0. Ideen mit niedrigerem oder fehlendem Score (zählt als 0) werden aussortiert; die Prüfung erfolgt nach der Begrenzung durch `limit`. */
  min_score?: number;
  /** Maximale Zahl der zunächst geladenen Ideen als ganze Zahl, mindestens 1. Standard ist 10. Beachte, dass die übrigen Filter danach greifen und die Antwort kleiner ausfallen kann. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface SparringGetIdeaBacklogParams {
  /** Anzahl der zurückgegebenen Ideen als ganze Zahl, mindestens 1. Standard ist 5. Mehr als 50 Ideen kann der Backlog nie enthalten. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface SparringCreateContentIdeaParams {
  /** Titel der Content-Idee als Text. Pflichtangabe. */
  title: string;
  /** Ziel-Typ der Idee. Dokumentierte Werte: `podcast_episode`, `book_chapter`, `blog_post`, `social_media`, `landingpage`. Pflichtangabe; andere Werte werden zwar gespeichert, aber ohne sprechende Beschriftung ausgegeben. */
  content_type: string;
  /** Optionale Beschreibung oder Begründung der Idee. Ohne Angabe bleibt das Feld leer. */
  description?: string;
  /** Optionales Haupt-Keyword, auf das die Idee zielt. Es wird als `keyword` der Idee gespeichert und für die Anreicherung herangezogen. */
  keyword?: string;
  /** Optionale Zielgruppe, für die der Inhalt gedacht ist, z. B. „Inhaber kleiner Betriebe“. Wird im Feld `target_audience` ausgegeben. */
  target_audience?: string;
  /** Optionale Dringlichkeit als Zahl von 0.0 (nicht dringend) bis 1.0 (sehr dringend). Werte außerhalb werden auf diesen Bereich begrenzt. Standard 0.5; bestimmt die Sortierung in `get_content_ideas`. */
  urgency?: number;
  /** Optionaler erwarteter Geschäftsnutzen als Zahl von 0.0 bis 1.0. Werte außerhalb werden begrenzt. Standard 0.5. Wird in `business_impact` ausgegeben. */
  impact?: number;
  [weiteres: string]: unknown;
}

export interface SparringApproveIdeaParams {
  /** Numerische ID der Content-Idee, wie sie `get_content_ideas`, `get_idea_backlog` oder `create_content_idea` als `id` liefern. Pflichtangabe. */
  idea_id: number;
  [weiteres: string]: unknown;
}

export interface SparringArchiveIdeaParams {
  /** Numerische ID der Content-Idee, die archiviert werden soll. Pflichtangabe; die Idee muss zu deiner Firma gehören. */
  idea_id: number;
  /** Optionale Begründung als Text, z. B. „Thema inzwischen bereits veröffentlicht“. Wird bei der Idee abgelegt und HTML-maskiert gespeichert. Leere Angaben werden ignoriert. */
  reason?: string;
  [weiteres: string]: unknown;
}

/** Content-Ideen — Der Bereich sparring verwaltet Content-Ideen, die aus Sparring-Gesprächen entstehen oder manuell angelegt werden. */
export class SparringArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Content-Ideen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/sparring/get_content_ideas`
   */
  getContentIdeas(params?: SparringGetContentIdeasParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('sparring', 'get_content_ideas', params, options);
  }

  /**
   * Beste Ideen (Backlog)
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/sparring/get_idea_backlog`
   */
  getIdeaBacklog(params?: SparringGetIdeaBacklogParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('sparring', 'get_idea_backlog', params, options);
  }

  /**
   * Content-Idee anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/sparring/create_content_idea`
   */
  createContentIdea(params: SparringCreateContentIdeaParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('sparring', 'create_content_idea', params, options);
  }

  /**
   * Content-Idee genehmigen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/sparring/approve_idea`
   */
  approveIdea(params: SparringApproveIdeaParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('sparring', 'approve_idea', params, options);
  }

  /**
   * Content-Idee archivieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/sparring/archive_idea`
   */
  archiveIdea(params: SparringArchiveIdeaParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('sparring', 'archive_idea', params, options);
  }
}

export interface BaukastenCanvasOeffnenParams {
  /** Name der Anwendung, z. B. „Inbetriebnahme Reinigungsroboter“. Wird auf 160 Zeichen gekürzt; ein leerer Text ergibt „Neue Anwendung“. Wird ignoriert, wenn die Funktion einen jungen vorhandenen Entwurf zurückgibt. */
  titel: string;
  /** Optionale Beschreibung in ein bis zwei Sätzen, was die Anwendung leistet. Wird auf 600 Zeichen gekürzt und später in der Anwendungsliste angezeigt. */
  beschreibung?: string;
  /** Optional: Für welchen Datensatz die Anwendung gestartet wird. Erlaubt sind `geraet` (ein Gerät) und `lead` (ein Lead). Dann stehen beim Ausführen die Daten dieses Objekts über Platzhalter wie `{{kontext.…}}` bereit. Ohne Angabe hat die Anwendung keinen Kontext. */
  kontext_typ?: "geraet" | "lead";
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasLesenParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasSetzenParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  /** Vollständige Liste der Bausteine als Array von Objekten, jeweils `{id, typ, …Felder des Typs}`. Beispiele: `text {titel, inhalt (Markdown)}`, `hinweis {ton: info|tipp|warnung|pflicht, inhalt}`, `checkliste {punkte[{id, text, pflicht, foto, kommentar}]}`, `formular {felder[{id, label, art, optionen, pflicht}]}` mit `art` text, langtext, zahl, datum, auswahl, janein oder foto, `aktion {titel, werkzeug, parameter, bestaetigung}`. Optional hat jeder Baustein `sichtbar_wenn {wert, op, vergleich}`; erlaubte `op`: gleich, ungleich, leer, nicht_leer, angehakt, groesser, kleiner, enthaelt. Platzhalter: `{{kontext.…}}`, `{{<checkliste>.<punkt>}}`, `{{<formular>.<feld>}}`. */
  bausteine: Array<Record<string, unknown>>;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasBausteinEinfuegenParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  /** Der neue Baustein als Objekt `{id, typ, …Felder des Typs}`. Erlaubte Typen: text, hinweis, ablauf, tabelle, bild, checkliste, formular, schritte, liste, kennzahl, eintraege, aktion, abschnitt, spalten. Die `id` besteht aus a-z, 0-9 und _ (höchstens 40 Zeichen); Pflichtfelder hängen vom Typ ab, z. B. braucht `text` einen `inhalt` und `checkliste` mindestens einen Punkt. */
  baustein: Record<string, unknown>;
  /** Optional: ID des Bausteins, hinter den der neue gesetzt wird (auch ein verschachtelter). Der Sonderwert `anfang` setzt ihn an die erste Stelle. Fehlt die Angabe, landet der Baustein am Ende der obersten Ebene. */
  nach?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasBausteinAendernParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  /** ID des Bausteins, der geändert werden soll, z. B. `intro`. Die IDs erfährst du aus `canvas_lesen` oder aus der Kurzliste `bausteine` der letzten Antwort. */
  id: string;
  /** Objekt mit nur den Feldern, die sich ändern, z. B. `{"inhalt": "Neuer Text"}` oder `{"titel": "Neuer Titel"}`. Die Werte ersetzen die bisherigen komplett. `id` und `typ` in diesem Objekt werden ignoriert. */
  felder: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasBausteinEntfernenParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  /** ID des Bausteins, der entfernt werden soll, z. B. `warnhinweis`. Sie steht in der Kurzliste `bausteine` jeder Antwort und im Ergebnis von `canvas_lesen`. */
  id: string;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasBausteinVerschiebenParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  /** ID des Bausteins, der verschoben werden soll, z. B. `pruefung`. */
  id: string;
  /** Optional: ID des Bausteins, hinter den der verschobene gesetzt wird. `anfang` bedeutet ganz nach vorn. Ohne Angabe wird der Baustein ans Ende der obersten Ebene gestellt. */
  nach?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenCanvasRueckgaengigParams {
  /** ID der Anwendung (des Canvas) als ganze Zahl. Du bekommst sie aus `canvas_oeffnen` (Feld `app_id`) oder aus `anwendungen_liste` (Feld `id`). Bearbeiten darf die Anwendung nur ihr Ersteller oder ein Administrator der Firma; für eine fremde oder unbekannte ID kommt `success: false` mit einem Satz. */
  app_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenBaukastenWerkzeugeParams {
  /** Welche Sorte Werkzeug du suchst: `lesen` für Datenquellen (Liste, Kennzahl, lesende Agenten-Schritte) oder `schreiben` für Aktionen, die Daten verändern. Pflichtangabe im Schema; ein anderer Wert wird wie „keine Angabe“ behandelt und liefert Werkzeuge beider Arten. */
  art: "lesen" | "schreiben";
  /** Optionales Stichwort, z. B. `ticket` oder `wartung`. Gesucht wird in Name und Beschreibung der Werkzeuge. Ohne Angabe kommen die ersten Werkzeuge der gewählten Art. */
  suche?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenAnwendungenListeParams {
  [weiteres: string]: unknown;
}

export interface BaukastenAnwendungOeffnenParams {
  /** ID der Anwendung als ganze Zahl (aus `anwendungen_liste`). Im Chat der Zentrale wird die Anwendung damit an den aktuellen Chat gebunden; über die API wird der Wert nicht ausgewertet, weil vorher der Chat-Fehler kommt. */
  app_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentEntwurfParams {
  /** Name des Agenten, z. B. „Anfragen sichten“. Wird auf 160 Zeichen gekürzt; ein leerer Name ergibt „Neuer Agent“. Der Name wird in Listen und beim Start über `agent_starten` verwendet. */
  name: string;
  /** Optionale Beschreibung, wozu der Agent da ist, in ein bis zwei Sätzen. Wird auf 600 Zeichen gekürzt und in der Agentenliste gezeigt. */
  beschreibung?: string;
  /** Optional: Was der Agent wissen muss, in ganzen Sätzen (Fachbegriffe, Regeln des Hauses, Tonfall). Wird auf 6000 Zeichen gekürzt und jedem KI-Schritt als Hintergrundwissen mitgegeben. */
  anweisungen?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentOeffnenParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentBriefingParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  /** Objekt mit `ziel` (wozu es den Agenten gibt) und `fertig_wenn` (woran man erkennt, dass die Arbeit erledigt ist), jeweils bis 1000 Zeichen. Beide Felder werden zusammen gesetzt; ein fehlendes wird leer. */
  briefing?: Record<string, unknown>;
  /** Wissen des Agenten in ganzen Sätzen, bis 6000 Zeichen. Ersetzt den bisherigen Text. Wird jedem KI-Schritt als Hintergrund mitgegeben. */
  anweisungen?: string;
  /** Liste kurzer Regeln wie „Nie …“, „Immer …“, „Nur …“; höchstens 20 Einträge zu je 300 Zeichen. Die Liste ersetzt die bisherigen Leitplanken vollständig. Sie gelten in KI-Schritten vor jeder anderen Anweisung; verletzt eine Aufgabe eine Leitplanke, soll der Agent sie nicht ausführen. */
  leitplanken?: Array<string>;
  /** KI-Stufe des Agenten als Standard für alle KI-Schritte: `schnell` (Standard), `ausgewogen`, `gruendlich` oder `tiefgang`. Eine unbekannte Stufe wird mit dem Satz „Das KI-Modell … gibt es nicht.“ abgelehnt. */
  modell?: "schnell" | "ausgewogen" | "gruendlich" | "tiefgang";
  [weiteres: string]: unknown;
}

export interface BaukastenAgentSetzenParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  /** Vollständige Liste der Schritte, jeweils `{key, typ, titel, …}`. `key`: a-z, 0-9, _ (höchstens 40 Zeichen), eindeutig; `ende`, `eingabe`, `kontext` und `schritte` sind reserviert. `typ` und seine Felder: `werkzeug {werkzeug, parameter}` (fest); `ki {anweisung, eingaben, ergebnis[{name, art: text|zahl|liste|objekt|janein, beschreibung}], modell}` (ergebnis ist Pflicht); `datei {quelle, auszug{anweisung, ergebnis[]}}` liest Dateien des Laufs; `browser {start_url (https), ziel, domains[], zugang, max_aktionen (bis 50), dateien_holen}`; `frei {ziel, werkzeuge[], max_runden (1–12)}` (die KI wählt selbst); `frage {frage, art: freigabe|eingabe, felder}`; `entscheidung {bedingung{wert, op, vergleich}, dann, sonst}` mit Schritt-Keys oder `ende`; `tabelle` (Tabelle umformen, ohne KI); außerdem `pdf_werte` und `berechnen`. Optional `weiter` (Key des nächsten Schritts oder `ende`); ohne `weiter` folgt der nächste in der Liste. Werte wie `{{eingabe.lead_id}}` und `{{schritte.<key>.<feld>}}` werden zur Laufzeit eingesetzt. */
  schritte: Array<Record<string, unknown>>;
  /** Liste der Werkzeuge, die der Agent benutzen darf, als Objekte `{name, ohne_rueckfrage, aussen_bestaetigt}` (beide Schalter Standard `false`). Jedes in einem `werkzeug`- oder `frei`-Schritt benutzte Werkzeug muss hier stehen. Gesperrt sind Namen mit `delete_`, `remove_`, `ui_`, `canvas_`, `baukasten_`, `anwendung` sowie `find_tool`, `call_tool` und `delegate_background`. Namen findest du mit `baukasten_werkzeuge`. Lässt du das Feld weg, bleibt die bisherige Liste. */
  werkzeuge?: Array<Record<string, unknown>>;
  /** Wann Läufe entstehen. `hand` ist immer wahr. `ereignisse`: Liste von Ereignissen der Plattform, z. B. `lead.neu`, `rueckruf.gewuenscht`, `mail.neu`, `ticket.neu`, `angebot.angenommen`, `rechnung.bezahlt`, `rechnung.ueberfaellig`, `datei.neu`; unbekannte Namen fallen weg, die Daten stehen im Lauf als `{{eingabe.<feld>}}` bereit (bei `lead.neu` z. B. `lead_id`). `zeitplaene`: höchstens 10 Pläne der Form `{takt: einmalig, datum: "JJJJ-MM-TT", uhrzeit: "HH:MM"}`, `{takt: taeglich, uhrzeit}`, `{takt: woechentlich, wochentage: [1-7], uhrzeit}`, `{takt: monatlich, tag: 1-31 oder "letzter", uhrzeit}`, `{takt: jaehrlich, monat, tag, uhrzeit}` oder `{takt: intervall, alle: N, einheit: minuten|stunden|tage|wochen, ab: "JJJJ-MM-TT HH:MM"}` (Intervall mindestens 15 Minuten, Zeitzone Berlin). Fehlt das Feld, bleiben die bisherigen Auslöser. */
  ausloeser?: Record<string, unknown>;
  /** Obergrenzen je Lauf als Objekt `{schritte, ki, minuten}`: `schritte` 1–200 (Standard 60), `ki` 0–100 KI-Aufrufe (Standard 40), `minuten` 1–120 (Standard 30). Werte außerhalb werden begrenzt. Ist ein Limit erreicht, wird der Lauf mit dem Grund „Budget erreicht“ angehalten bzw. der KI-Schritt scheitert. Fehlt das Feld, bleibt das bisherige Budget. */
  budget?: Record<string, unknown>;
  /** Wissen des Agenten in ganzen Sätzen, bis 6000 Zeichen. Fehlt das Feld, bleibt der bisherige Text. */
  anweisungen?: string;
  /** Objekt `{ziel, fertig_wenn}` mit je bis zu 1000 Zeichen: wozu es den Agenten gibt und woran man erkennt, dass er fertig ist. Fehlt das Feld, bleibt das bisherige Briefing. */
  briefing?: Record<string, unknown>;
  /** Liste kurzer Regeln („Nie …“, „Immer …“, „Nur …“), höchstens 20 zu je 300 Zeichen. Ersetzt die bisherigen. Fehlt das Feld, bleiben die bisherigen. */
  leitplanken?: Array<string>;
  /** KI-Stufe des Agenten: `schnell` (Standard), `ausgewogen`, `gruendlich` oder `tiefgang`. Einzelne KI-, Datei-, Browser- und freie Schritte können mit ihrem Feld `modell` eine eigene Stufe wählen. */
  modell?: "schnell" | "ausgewogen" | "gruendlich" | "tiefgang";
  /** Wer nach einem Lauf Bescheid bekommt: Objekt `{glocke: bool, email: bool, auch_fehler: bool}`. Benachrichtigt wird der Inhaber der Firma (Glocke oben bzw. E-Mail); mit `auch_fehler: true` auch bei Fehler oder Anhalten, Simulationen melden nichts. Fehlt das Feld, bleibt die bisherige Einstellung (neue Agenten: Glocke an). */
  benachrichtigung?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentSchrittEinfuegenParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  /** Der neue Schritt als Objekt `{key, typ, titel, …Felder des Typs}`. `typ` ist einer von werkzeug, ki, datei, browser, frei, frage, entscheidung, tabelle, pdf_werte, berechnen. Der `key` besteht aus a-z, 0-9, _ (höchstens 40 Zeichen) und darf im Agenten nur einmal vorkommen. Die Felder je Typ stehen bei `agent_setzen` im Parameter `schritte`. */
  schritt: Record<string, unknown>;
  /** Optional: Key des Schritts, hinter den der neue gesetzt wird. `anfang` bedeutet ganz nach vorn, ohne Angabe wird der Schritt ans Ende gehängt. Ein unbekannter Key ergibt den Satz „Den Schritt „…“ gibt es nicht.“ */
  nach?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentSchrittAendernParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  /** Key des Schritts, der geändert werden soll, z. B. `einschaetzen`. Die Keys stehen in der Liste `schritte` jeder Antwort und in `agent_lesen`. */
  key: string;
  /** Objekt mit den zu ändernden Feldern, z. B. `{"anweisung": "…"}`, `{"parameter": {…}}` oder `{"titel": "…"}`. Unbekannte Felder des Schritttyps werden bei der Prüfung verworfen; `key` und `typ` in diesem Objekt werden ignoriert. */
  felder: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentSchrittEntfernenParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  /** Key des Schritts, der entfernt werden soll, z. B. `freigabe`. Er steht in der Liste `schritte` jeder Antwort und in `agent_lesen`. */
  key: string;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentLesenParams {
  /** ID des Agenten als ganze Zahl. Du bekommst sie aus `agent_entwurf` (Feld `agent_id`) oder `agenten_liste` (Feld `id`). Ändern darf den Agenten nur sein Ersteller oder ein Administrator der Firma; eine fremde, archivierte oder unbekannte ID liefert `success: false` mit „Diesen Agenten gibt es nicht.“ */
  agent_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentenListeParams {
  [weiteres: string]: unknown;
}

export interface BaukastenAgentStartenParams {
  /** ID des Agenten als ganze Zahl (aus `agent_entwurf` oder `agenten_liste`). Alternativ kannst du `name` angeben. Fehlen beide oder passt keiner, kommt „Diesen Agenten gibt es nicht.“ bzw. „Einen Agenten mit diesem Namen gibt es nicht.“ */
  agent_id?: number;
  /** Name oder Namensteil des Agenten, Groß-/Kleinschreibung egal. Es muss genau ein sichtbarer Agent passen; bei mehreren Treffern nennt `error` die Namen und fragt, welcher gemeint ist. Wird nur ausgewertet, wenn `agent_id` fehlt. */
  name?: string;
  /** Objekt mit den Eingabewerten des Laufs. Im Ablauf sind sie als `{{eingabe.<name>}}` abrufbar, z. B. `{"lead_id": 2088}` als `{{eingabe.lead_id}}`. Passwörter und ähnliche Felder werden im Protokoll geschwärzt. Ohne Angabe ist die Eingabe leer. */
  eingabe?: Record<string, unknown>;
  /** Boolean, Standard `false`. Bei `true` läuft der gespeicherte Entwurf als Probe: nichts wird verändert, nichts geht nach außen, Rückfragen werden automatisch bejaht. Nur Verwalter des Agenten dürfen das („Simulieren dürfen nur die Verwalter des Agenten.“). */
  simulation?: boolean;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentLaufStatusParams {
  /** ID des Laufs als ganze Zahl. Du bekommst sie aus der Antwort von `agent_starten` (Feld `lauf_id`) oder aus `agent_rueckfragen` (Feld `lauf_id`). Eingreifen darf die Person, die den Lauf gestartet hat, sowie die Verwalter des Agenten. */
  lauf_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentRueckfragenParams {
  [weiteres: string]: unknown;
}

export interface BaukastenAgentAnhaltenParams {
  /** ID des Laufs als ganze Zahl. Du bekommst sie aus der Antwort von `agent_starten` (Feld `lauf_id`) oder aus `agent_rueckfragen` (Feld `lauf_id`). Eingreifen darf die Person, die den Lauf gestartet hat, sowie die Verwalter des Agenten. */
  lauf_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentFortsetzenParams {
  /** ID des Laufs als ganze Zahl. Du bekommst sie aus der Antwort von `agent_starten` (Feld `lauf_id`) oder aus `agent_rueckfragen` (Feld `lauf_id`). Eingreifen darf die Person, die den Lauf gestartet hat, sowie die Verwalter des Agenten. */
  lauf_id: number;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentPausierenParams {
  /** ID des Agenten */
  agent_id?: number;
  /** Name oder Teil des Namens, wenn die ID nicht bekannt ist */
  name?: string;
  [weiteres: string]: unknown;
}

export interface BaukastenAgentAktivierenParams {
  /** ID des Agenten */
  agent_id?: number;
  /** Name oder Teil des Namens, wenn die ID nicht bekannt ist */
  name?: string;
  [weiteres: string]: unknown;
}

/** Agenten und Anwendungen — Der Baukasten ist die Werkstatt für Anwendungen (kleine Bildschirmabläufe aus festen Bausteinen) und Agenten (Abläufe, die Schritt für Schritt ohne Menschen laufen). */
export class BaukastenArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Canvas anlegen oder weiterbauen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_oeffnen`
   */
  canvasOeffnen(params: BaukastenCanvasOeffnenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_oeffnen', params, options);
  }

  /**
   * Canvas lesen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/canvas_lesen`
   */
  canvasLesen(params: BaukastenCanvasLesenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_lesen', params, options);
  }

  /**
   * Alle Bausteine setzen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_setzen`
   */
  canvasSetzen(params: BaukastenCanvasSetzenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_setzen', params, options);
  }

  /**
   * Baustein einfügen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_baustein_einfuegen`
   */
  canvasBausteinEinfuegen(params: BaukastenCanvasBausteinEinfuegenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_baustein_einfuegen', params, options);
  }

  /**
   * Baustein ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_baustein_aendern`
   */
  canvasBausteinAendern(params: BaukastenCanvasBausteinAendernParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_baustein_aendern', params, options);
  }

  /**
   * Baustein entfernen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_baustein_entfernen`
   */
  canvasBausteinEntfernen(params: BaukastenCanvasBausteinEntfernenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_baustein_entfernen', params, options);
  }

  /**
   * Baustein verschieben
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_baustein_verschieben`
   */
  canvasBausteinVerschieben(params: BaukastenCanvasBausteinVerschiebenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_baustein_verschieben', params, options);
  }

  /**
   * Letzte Änderung rückgängig machen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/canvas_rueckgaengig`
   */
  canvasRueckgaengig(params: BaukastenCanvasRueckgaengigParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'canvas_rueckgaengig', params, options);
  }

  /**
   * Erlaubte Werkzeuge suchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/baukasten_werkzeuge`
   */
  baukastenWerkzeuge(params: BaukastenBaukastenWerkzeugeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'baukasten_werkzeuge', params, options);
  }

  /**
   * Anwendungen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/anwendungen_liste`
   */
  anwendungenListe(params?: BaukastenAnwendungenListeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'anwendungen_liste', params, options);
  }

  /**
   * Anwendung im Chat öffnen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/anwendung_oeffnen`
   */
  anwendungOeffnen(params: BaukastenAnwendungOeffnenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'anwendung_oeffnen', params, options);
  }

  /**
   * Agenten-Entwurf anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_entwurf`
   */
  agentEntwurf(params: BaukastenAgentEntwurfParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_entwurf', params, options);
  }

  /**
   * Agent im Chat öffnen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_oeffnen`
   */
  agentOeffnen(params: BaukastenAgentOeffnenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_oeffnen', params, options);
  }

  /**
   * Briefing, Leitplanken und KI-Stufe setzen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_briefing`
   */
  agentBriefing(params: BaukastenAgentBriefingParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_briefing', params, options);
  }

  /**
   * Schritte, Auslöser und Werkzeuge setzen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_setzen`
   */
  agentSetzen(params: BaukastenAgentSetzenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_setzen', params, options);
  }

  /**
   * Schritt einfügen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_schritt_einfuegen`
   */
  agentSchrittEinfuegen(params: BaukastenAgentSchrittEinfuegenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_schritt_einfuegen', params, options);
  }

  /**
   * Schritt ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_schritt_aendern`
   */
  agentSchrittAendern(params: BaukastenAgentSchrittAendernParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_schritt_aendern', params, options);
  }

  /**
   * Schritt entfernen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_schritt_entfernen`
   */
  agentSchrittEntfernen(params: BaukastenAgentSchrittEntfernenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_schritt_entfernen', params, options);
  }

  /**
   * Agenten lesen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/agent_lesen`
   */
  agentLesen(params: BaukastenAgentLesenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_lesen', params, options);
  }

  /**
   * Agenten auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/agenten_liste`
   */
  agentenListe(params?: BaukastenAgentenListeParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agenten_liste', params, options);
  }

  /**
   * Agenten starten oder simulieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_starten`
   */
  agentStarten(params?: BaukastenAgentStartenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_starten', params, options);
  }

  /**
   * Stand eines Laufs
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/agent_lauf_status`
   */
  agentLaufStatus(params: BaukastenAgentLaufStatusParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_lauf_status', params, options);
  }

  /**
   * Offene Rückfragen der Agenten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/baukasten/agent_rueckfragen`
   */
  agentRueckfragen(params?: BaukastenAgentRueckfragenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_rueckfragen', params, options);
  }

  /**
   * Lauf anhalten
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_anhalten`
   */
  agentAnhalten(params: BaukastenAgentAnhaltenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_anhalten', params, options);
  }

  /**
   * Lauf fortsetzen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_fortsetzen`
   */
  agentFortsetzen(params: BaukastenAgentFortsetzenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_fortsetzen', params, options);
  }

  /**
   * Pausiert einen Agenten ganz: er startet nicht mehr von selbst (Zeitplan, Ereignisse), bis er wieder eingeschal
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_pausieren`
   */
  agentPausieren(params?: BaukastenAgentPausierenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_pausieren', params, options);
  }

  /**
   * Schaltet einen pausierten Agenten wieder ein.
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/baukasten/agent_aktivieren`
   */
  agentAktivieren(params?: BaukastenAgentAktivierenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('baukasten', 'agent_aktivieren', params, options);
  }
}

export interface AgentTeamsListTeamsParams {
  [weiteres: string]: unknown;
}

export interface AgentTeamsCreateTeamParams {
  /** Name des Teams, z. B. „Angebots-Taskforce“. Pflichtfeld. Der Text wird getrimmt und HTML-bereinigt gespeichert. */
  name: string;
  /** Typ des Teams. Die Klasse kennt `optimization`, `implementation`, `process`, `strategy` und `custom`. Ohne Angabe wird `custom` verwendet. Nutze nur diese Werte. */
  team_type?: string;
  /** Ziel des Teams in einem oder zwei Sätzen, z. B. „Angebote in unter 24 Stunden versenden“. Wird als `teamGoal` gespeichert und im Team-Chat als Ausgangspunkt benutzt. Ohne Angabe bleibt das Ziel leer. */
  goal?: string;
  /** Mitglieder als Liste von Objekten, z. B. `{"chatAgentId": 1201, "teamRole": "Texter", "roleDescription": "Formuliert den Angebotstext"}`. `chatAgentId` verweist auf einen Chat-Agenten, `avatarId` auf einen Avatar, `teamRole` und `roleDescription` beschreiben die Rolle im Team. Die Objekte werden ohne Prüfung gespeichert. Ohne Angabe ist das Team leer. */
  members?: Array<Record<string, unknown>>;
  [weiteres: string]: unknown;
}

/** Agent-Teams — Agent-Teams fassen mehrere Chat-Agenten und Avatare zu einer Gruppe mit gemeinsamem Ziel und festen Rollen zusammen. */
export class AgentTeamsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Agent-Teams auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/agent_teams/list_teams`
   */
  listTeams(params?: AgentTeamsListTeamsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('agent_teams', 'list_teams', params, options);
  }

  /**
   * Agent-Team anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/agent_teams/create_team`
   */
  createTeam(params: AgentTeamsCreateTeamParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('agent_teams', 'create_team', params, options);
  }
}

export interface ReflectionsGetReflectionsParams {
  /** Optional: exakter Status als Text, z. B. `pending`, `ready`, `in_progress` oder `completed`. Es wird exakt verglichen; ohne Angabe kommen alle Status. */
  status?: string;
  /** Optional: exakte Emotion als Text, z. B. `frustration` oder `neutral`. Gefiltert wird auf Gleichheit. */
  emotion?: string;
  /** Optional: Mindest-Dringlichkeit als ganze Zahl. Beachte, dass die Dringlichkeit intern zwischen 0 und 1 liegt; praktisch wirkt nur 1 (nur Höchstwerte), 0 deaktiviert den Filter. */
  urgency_min?: number;
  /** Optional: Suchtext, der als Teilstring in Titel oder Beschreibung gesucht wird. Der Text wird HTML-escaped und getrimmt. */
  search?: string;
  /** Optional (Wahrheitswert, Standard `false`). Mit `true` kommen auch als privat markierte Reflexionen zurück (soweit sie dir gehören); ohne Angabe nur nicht private. */
  include_private?: boolean;
  /** Optional: Höchstzahl der Reflexionen in der Antwort (ganze Zahl, Standard 25, mindestens 1). Eine Obergrenze erzwingt der Code nicht. */
  limit?: number;
  /** Optional: Anzahl der Reflexionen, die am Anfang übersprungen werden (ganze Zahl, Standard 0). Mit `limit` blätterst du seitenweise. */
  offset?: number;
  [weiteres: string]: unknown;
}

export interface ReflectionsGetNotificationsParams {
  /** Optional (Wahrheitswert, Standard `false`). Mit `true` werden nur ungelesene Benachrichtigungen geliefert, ebenfalls begrenzt durch `limit`. */
  nur_ungelesen?: boolean;
  /** Optional: Höchstzahl der Einträge (ganze Zahl, Standard 20). Werte unter 1 werden zu 1, Werte über 100 zu 100. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface ReflectionsGetNotificationCountParams {
  [weiteres: string]: unknown;
}

export interface ReflectionsMarkNotificationReadParams {
  /** Optional: Datenbank-ID der Benachrichtigung (ganze Zahl), wie sie in `get_notifications` unter `notifications[].id` steht. Ohne diese Angabe musst du `alle` setzen. */
  notification_id?: number;
  /** Optional (Wahrheitswert): mit `true` werden alle ungelesenen Benachrichtigungen der Person als gelesen markiert, `notification_id` wird dann nicht beachtet. */
  alle?: boolean;
  [weiteres: string]: unknown;
}

export interface ReflectionsCreateNotificationParams {
  /** Kurze Überschrift der Benachrichtigung (Text, Pflichtangabe). Sie wird getrimmt und HTML-escaped. */
  titel: string;
  /** Fließtext der Benachrichtigung (Pflichtangabe). Er wird getrimmt und HTML-escaped gespeichert. */
  nachricht: string;
  /** Optional: technischer Typ als Text, z. B. `crm_lead`. Standard ist `external`. Der Typ dient der Einordnung in der Oberfläche. */
  typ?: string;
  /** Optional: Symbolname als Text, z. B. `bell`, `phone`, `mail` oder `calendar`. Standard ist `bell`. */
  icon?: string;
  /** Optional: Ziel beim Anklicken als interner Pfad, z. B. `/crm`. Ohne Angabe ist die Meldung nicht anklickbar. */
  link?: string;
  [weiteres: string]: unknown;
}

export interface ReflectionsDeleteNotificationParams {
  /** Datenbank-ID der zu löschenden Benachrichtigung (ganze Zahl, Pflichtangabe), wie sie in `get_notifications` unter `notifications[].id` steht. */
  notification_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface ReflectionsGetReflectionParams {
  /** ID der Reflexion (ganze Zahl, Pflichtangabe), wie sie in `get_reflections` unter `items[].id` steht. Eine unbekannte ID führt zu `Reflexion nicht gefunden`. */
  reflection_id: number;
  [weiteres: string]: unknown;
}

export interface ReflectionsCreateReflectionParams {
  /** Kurzer Titel der Reflexion (Pflichtangabe). Er dient auch als Grundlage für den Objektschlüssel. */
  title: string;
  /** Die Kernerkenntnis in ein bis drei Sätzen (Pflichtangabe). Sie wird als Beschreibung der Reflexion gespeichert, sofern du nicht zusätzlich `description` angibst. */
  core_insight: string;
  /** Optional: Originaltranskript oder Notizen, aus denen die Erkenntnis stammt. Wird in den Zusatzdaten der Reflexion abgelegt. */
  raw_input?: string;
  /** Optional: ausführlichere Beschreibung oder Kontext. Überschreibt die aus `core_insight` übernommene Beschreibung. */
  description?: string;
  /** Optional: Emotion als Text, z. B. `frustration`. Standard ist `neutral`. */
  emotion?: string;
  /** Optional: Bewertung 0 bis 10 (ganze Zahl, Standard 5). Der Wert wird beim Anlegen auf eine Skala von 0 bis 1 umgerechnet. Beachte den Hinweis zur doppelten Verarbeitung. */
  urgency?: number;
  /** Optional: Status als Text. Beim Anlegen steht er auf `pending`; ein hier angegebener Wert überschreibt ihn danach (z. B. `ready` oder `completed`). */
  status?: string;
  /** Optional: Thema oder Kategorie der Reflexion als Text, z. B. `Prozesse`. */
  theme?: string;
  /** Optional (Wahrheitswert): markiert die Reflexion als privat. Private Reflexionen erscheinen in `get_reflections` nur mit `include_private`. */
  is_private?: boolean;
  /** Optional (Wahrheitswert): kennzeichnet, dass eine Nachverfolgung nötig ist. */
  needs_follow_up?: boolean;
  /** Optional: Quelle der Erkenntnis, z. B. `voice_chat`, `note` oder `meeting`. Standard ist `assistant`. */
  source_type?: string;
  /** Optional: ID des Ursprungs (ganze Zahl), z. B. eines Gesprächs. Wird in den Zusatzdaten der Reflexion gespeichert. */
  source_id?: number;
  /** Optional: empfohlene Handlung als Text. */
  potential_action?: string;
  /** Optional: vermutete Ursache als Text. */
  root_cause?: string;
  [weiteres: string]: unknown;
}

export interface ReflectionsUpdateReflectionParams {
  /** ID der Reflexion (ganze Zahl, Pflichtangabe), wie sie in `get_reflections` unter `items[].id` steht. */
  reflection_id: number;
  /** Objekt mit den Feldern, die geändert werden sollen, z. B. `{"status": "completed", "measured_impact": "Freigabezeit von 2 auf 1 Tag gesunken"}`. Erlaubt sind die oben genannten Schlüssel; Wahrheitswerte für `is_private` und `needs_follow_up`, sonst Texte. */
  data: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface ReflectionsDeleteReflectionParams {
  /** ID der zu löschenden Reflexion (ganze Zahl, Pflichtangabe), wie sie in `get_reflections` unter `items[].id` steht. */
  reflection_id: number;
  /** Muss `true` sein, damit die Aktion ausgeführt wird. Ohne Bestätigung antwortet die Schnittstelle mit `409` und führt nichts aus. */
  bestaetigt: boolean;
  [weiteres: string]: unknown;
}

export interface ReflectionsGetReflectionStatisticsParams {
  [weiteres: string]: unknown;
}

/** Reflexionen und Benachrichtigungen — Der Bereich hat zwei Teile. */
export class ReflectionsArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Reflexionen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/reflections/get_reflections`
   */
  getReflections(params?: ReflectionsGetReflectionsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'get_reflections', params, options);
  }

  /**
   * Benachrichtigungen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/reflections/get_notifications`
   */
  getNotifications(params?: ReflectionsGetNotificationsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'get_notifications', params, options);
  }

  /**
   * Ungelesene Benachrichtigungen zählen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/reflections/get_notification_count`
   */
  getNotificationCount(params?: ReflectionsGetNotificationCountParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'get_notification_count', params, options);
  }

  /**
   * Benachrichtigung als gelesen markieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/reflections/mark_notification_read`
   */
  markNotificationRead(params?: ReflectionsMarkNotificationReadParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'mark_notification_read', params, options);
  }

  /**
   * Benachrichtigung anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/reflections/create_notification`
   */
  createNotification(params: ReflectionsCreateNotificationParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'create_notification', params, options);
  }

  /**
   * Benachrichtigung löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/reflections/delete_notification`
   */
  deleteNotification(params: ReflectionsDeleteNotificationParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'delete_notification', params, options);
  }

  /**
   * Reflexion im Detail abrufen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/reflections/get_reflection`
   */
  getReflection(params: ReflectionsGetReflectionParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'get_reflection', params, options);
  }

  /**
   * Reflexion anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/reflections/create_reflection`
   */
  createReflection(params: ReflectionsCreateReflectionParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'create_reflection', params, options);
  }

  /**
   * Reflexion aktualisieren
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/reflections/update_reflection`
   */
  updateReflection(params: ReflectionsUpdateReflectionParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'update_reflection', params, options);
  }

  /**
   * Reflexion löschen
   *
   * Recht am Schlüssel: `loeschen` · `POST /platform/reflections/delete_reflection`
   */
  deleteReflection(params: ReflectionsDeleteReflectionParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'delete_reflection', params, options);
  }

  /**
   * Statistik der Reflexionen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/reflections/get_reflection_statistics`
   */
  getReflectionStatistics(params?: ReflectionsGetReflectionStatisticsParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('reflections', 'get_reflection_statistics', params, options);
  }
}

export interface VerbindungenListEmailVorlagenParams {
  /** Optionales Stichwort. Es bleiben Vorlagen, in deren Namen oder Betreff das Wort vorkommt (Groß-/Kleinschreibung egal). Ohne Angabe kommen alle Vorlagen. */
  suche?: string;
  [weiteres: string]: unknown;
}

export interface VerbindungenPreviewEmailVorlageParams {
  /** ID der Vorlage aus `list_email_vorlagen`. Pflicht. Die Vorlage muss dir gehören oder für alle Firmen gelten. */
  vorlage_id: number;
  /** Optional: ID eines Leads deiner Firma. Dessen Daten füllen die `{lead.…}`-Platzhalter und `an`. Ohne Angabe werden Beispieldaten genutzt. */
  lead_id?: number;
  /** Optionales Objekt mit eigenen Werten für `{wert.name}` in Betreff und Text, zum Beispiel `{"termin": "Dienstag, 10. November, 14 Uhr"}`. Einfache Werte werden als Text eingesetzt, Listen und Objekte als JSON. */
  werte?: Record<string, unknown>;
  [weiteres: string]: unknown;
}

export interface VerbindungenCreateEmailVorlageParams {
  /** Anzeigename der Vorlage, höchstens 120 Zeichen. Pflicht. Er erscheint in den Auswahllisten des Dashboards. */
  name: string;
  /** Betreffzeile der Mail. Pflicht. Platzhalter wie `{lead.lastname}` und eigene Werte `{wert.name}` sind erlaubt. */
  betreff: string;
  /** Text der Mail. Pflicht. Platzhalter: `{lead.gruss}`, `{lead.anrede}`, `{lead.firstname}`, `{lead.lastname}`, `{lead.company}`, `{company.company}`, `{member.name}`, `{system.date}`; eigene Werte als `{wert.name}`; Bedingungen wie `{if lead.titel}…{/if}`. */
  text: string;
  /** Verwendungszweck der Vorlage: `general` (Allgemein), `callback` (Rückruf) oder `followup` (Follow-up). Standard ist `general`. */
  typ?: "general" | "callback" | "followup";
  [weiteres: string]: unknown;
}

export interface VerbindungenUpdateEmailVorlageParams {
  /** ID der eigenen Vorlage aus `list_email_vorlagen`. Pflicht. Vorlagen anderer Firmen werden als nicht vorhanden gemeldet. */
  vorlage_id: number;
  /** Neuer Anzeigename, höchstens 120 Zeichen. Ein leerer Wert lässt den Namen unverändert. */
  name?: string;
  /** Neue Betreffzeile. Platzhalter und `{wert.name}` sind erlaubt. Wird sie weggelassen, bleibt der bisherige Betreff. */
  betreff?: string;
  /** Neuer Mailtext mit denselben Platzhaltern und Bedingungen wie bei `create_email_vorlage`. Wird er weggelassen, bleibt der bisherige Text. */
  text?: string;
  /** `true` schaltet die Vorlage ein, `false` aus. Ohne Angabe bleibt der Zustand unverändert. */
  aktiv?: boolean;
  [weiteres: string]: unknown;
}

export interface VerbindungenListWebhookZieleParams {
  [weiteres: string]: unknown;
}

export interface VerbindungenCreateDateiParams {
  /** Dateiformat: `docx`, `xlsx`, `csv`, `json`, `md` oder `txt`. Pflicht. Das Format bestimmt, wie `inhalt` gelesen wird. */
  format: "docx" | "xlsx" | "csv" | "json" | "md" | "txt";
  /** Dateiname ohne Endung, zum Beispiel `Leads Oktober`. Pflicht. Sonderzeichen wie `/ \ : * ? " < > |` werden durch Leerzeichen ersetzt; die Endung ergänzt die Funktion. */
  name: string;
  /** Der Inhalt. Bei `txt`, `md`, `docx` ein Text (in `docx` bedeuten `# Überschrift` eine Überschrift, `- Punkt` eine Liste, eine Leerzeile einen neuen Absatz). Bei `csv`, `xlsx` eine Liste von Zeilen: Objekte ergeben Spalten aus den Schlüsseln, Listen von Listen werden direkt übernommen. Bei `xlsx` auch `{"blaetter": [{"name": "…", "zeilen": […]}]}` mit bis zu 20 Blättern. Bei `json` beliebige Daten. */
  inhalt: unknown;
  [weiteres: string]: unknown;
}

/** E-Mail-Vorlagen und Webhooks — Dieser Bereich verbindet deine Abläufe mit E-Mail, Webhooks und Dateien. */
export class VerbindungenArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * E-Mail-Vorlagen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/verbindungen/list_email_vorlagen`
   */
  listEmailVorlagen(params?: VerbindungenListEmailVorlagenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'list_email_vorlagen', params, options);
  }

  /**
   * E-Mail-Vorlage als Vorschau füllen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/verbindungen/preview_email_vorlage`
   */
  previewEmailVorlage(params: VerbindungenPreviewEmailVorlageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'preview_email_vorlage', params, options);
  }

  /**
   * E-Mail-Vorlage anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/verbindungen/create_email_vorlage`
   */
  createEmailVorlage(params: VerbindungenCreateEmailVorlageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'create_email_vorlage', params, options);
  }

  /**
   * E-Mail-Vorlage ändern
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/verbindungen/update_email_vorlage`
   */
  updateEmailVorlage(params: VerbindungenUpdateEmailVorlageParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'update_email_vorlage', params, options);
  }

  /**
   * Webhook-Ziele auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/verbindungen/list_webhook_ziele`
   */
  listWebhookZiele(params?: VerbindungenListWebhookZieleParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'list_webhook_ziele', params, options);
  }

  /**
   * Datei erzeugen und ablegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/verbindungen/create_datei`
   */
  createDatei(params: VerbindungenCreateDateiParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('verbindungen', 'create_datei', params, options);
  }
}

export interface KundensupportKundensupportSucheParams {
  /** Wonach gesucht wird, in eigenen Worten, zum Beispiel `Kommentare zur Lieferzeit`. Pflicht. Ein leerer Text liefert den Fehler „Wonach soll ich suchen?“. */
  frage: string;
  /** Optional: `beitrag` (nur Postings), `nachricht` (nur Kundennachrichten und Kommentare) oder `antwort` (nur eure Antworten). Ohne Angabe wird alles durchsucht. */
  art?: "beitrag" | "nachricht" | "antwort";
  /** Optional: nur ein Kanal, angegeben als Kanalart wie `email`, `instagram`, `linkedin`, `amazon` oder als Name eines Kanals deiner Firma. Gibt es den Kanal nicht, kommt keine Trefferliste. */
  kanal?: string;
  [weiteres: string]: unknown;
}

export interface KundensupportKundensupportMusterParams {
  /** Thema, zu dem Muster gesucht werden, zum Beispiel `Fragen unter Postings zum Preis`. Pflicht. Ein leerer Text liefert den Fehler „Zu welchem Thema soll ich Muster suchen?“. */
  frage: string;
  /** Zeitraum in Tagen, den die Nachrichten höchstens zurückliegen dürfen. Ganze Zahl von 1 bis 730, Standard 90. Werte außerhalb werden auf diesen Bereich begrenzt. */
  tage?: number;
  [weiteres: string]: unknown;
}

/** Kundensupport — Der Kundensupport führt Kundennachrichten, Kommentare unter Postings, eure Antworten und die Postings selbst aus E-Mail und Social-Media-Kanälen zusammen. */
export class KundensupportArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Kundensupport nach Themen durchsuchen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/kundensupport/kundensupport_suche`
   */
  kundensupportSuche(params: KundensupportKundensupportSucheParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('kundensupport', 'kundensupport_suche', params, options);
  }

  /**
   * Wiederkehrende Muster finden
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/kundensupport/kundensupport_muster`
   */
  kundensupportMuster(params: KundensupportKundensupportMusterParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('kundensupport', 'kundensupport_muster', params, options);
  }
}

export interface BuchhaltungOffeneRechnungenParams {
  /** Wie viele Rechnungen die Liste höchstens enthält. Ganze Zahl von 1 bis 50, Standard 10. Werte außerhalb werden auf diesen Bereich begrenzt. */
  limit?: number;
  [weiteres: string]: unknown;
}

export interface BuchhaltungRechnungLesenParams {
  /** Rechnungsnummer genau so, wie sie auf der Rechnung steht, zum Beispiel `RE-2026-0142`. Pflicht. Führende und nachfolgende Leerzeichen werden entfernt, sonst wird exakt verglichen. */
  nummer: string;
  [weiteres: string]: unknown;
}

/** Rechnungen lesen — Dieser Bereich liest die Rechnungen deiner Firma aus der Buchhaltung, ohne etwas zu verändern. */
export class BuchhaltungArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Offene Rechnungen auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/buchhaltung/offene_rechnungen`
   */
  offeneRechnungen(params?: BuchhaltungOffeneRechnungenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('buchhaltung', 'offene_rechnungen', params, options);
  }

  /**
   * Rechnung anhand der Nummer lesen
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/buchhaltung/rechnung_lesen`
   */
  rechnungLesen(params: BuchhaltungRechnungLesenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('buchhaltung', 'rechnung_lesen', params, options);
  }
}

export interface ToniCallListTelefonAgentenParams {
  [weiteres: string]: unknown;
}

/** Telefon-Agenten — Toni Call lässt Agenten deiner Firma telefonieren, eingehend und ausgehend, über ein eigenes Telefonkonto oder eine Nebenstelle der Firma. */
export class ToniCallArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Telefon-Agenten auflisten
   *
   * Recht am Schlüssel: `lesen` · `POST /platform/toni_call/list_telefon_agenten`
   */
  listTelefonAgenten(params?: ToniCallListTelefonAgentenParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('toni_call', 'list_telefon_agenten', params, options);
  }
}

export interface QuoteCreateInvoiceDraftParams {
  /** ID des Leads (Kunden) in deinem CRM. Pflicht. Der Lead liefert Name, Anschrift und E-Mail für den Rechnungsempfänger. */
  lead_id: number;
  /** Liste der Rechnungspositionen. Jede Position ist ein Objekt mit `titel` (Text, Pflicht), `menge` (Zahl, Standard 1), `preis_netto` (Einzelpreis netto in Euro), `steuersatz` (Prozent, zum Beispiel 19 oder 7, Standard 19) und `einheit` (Text, Standard „Stück“). Mindestens eine Position mit Titel ist nötig. */
  positionen: Array<Record<string, unknown>>;
  /** Optionaler Betreff der Rechnung, höchstens 200 Zeichen. Ohne Angabe bleibt er leer. */
  betreff?: string;
  /** Optional: Beginn des Leistungszeitraums im Format `JJJJ-MM-TT`, zum Beispiel `2026-10-01`. Andere Formate werden ignoriert. */
  leistungszeitraum_von?: string;
  /** Optional: Ende des Leistungszeitraums im Format `JJJJ-MM-TT`, zum Beispiel `2026-10-31`. Andere Formate werden ignoriert. */
  leistungszeitraum_bis?: string;
  [weiteres: string]: unknown;
}

export interface QuoteDraftQuoteParams {
  /** Kurze Beschreibung dessen, was das Angebot enthalten oder berücksichtigen soll, zum Beispiel Umfang, Standorte, Starttermin. Pflicht. Das Briefing steht an erster Stelle der Grundlage und genügt auch, wenn es sonst keine Gespräche gibt. */
  briefing: string;
  /** ID des Leads (Kunden) deiner Firma, falls bekannt. Eine fremde oder unbekannte ID gilt als nicht gefunden; ist zusätzlich `company_name` gesetzt, wird damit weitergesucht. */
  lead_id?: number;
  /** Firmenname des Kunden, falls die `lead_id` nicht bekannt ist; mindestens 2 Zeichen. Ein genauer Treffer (Groß-/Kleinschreibung egal) gewinnt gegen mehrere Teiltreffer, mehrere Teiltreffer ohne genauen Treffer sind mehrdeutig. */
  company_name?: string;
  [weiteres: string]: unknown;
}

/** Angebote und Rechnungsentwürfe — Dieser Bereich legt Entwürfe in der Buchhaltung deiner Firma an. */
export class QuoteArea {
  constructor(private readonly platform: PlatformCaller) {}

  /**
   * Rechnungsentwurf anlegen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/quote/create_invoice_draft`
   */
  createInvoiceDraft(params: QuoteCreateInvoiceDraftParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('quote', 'create_invoice_draft', params, options);
  }

  /**
   * Angebotsentwurf aus Gesprächen erstellen
   *
   * Recht am Schlüssel: `schreiben` · `POST /platform/quote/draft_quote`
   */
  draftQuote(params: QuoteDraftQuoteParams, options?: CallOptions): Promise<FunctionResult> {
    return this.platform.call('quote', 'draft_quote', params, options);
  }
}

/** Alle Bereiche der Plattform als Eigenschaften des Clients. */
export interface Areas {
  /** Bücher */
  readonly books: BooksArea;
  /** Hörbücher */
  readonly audiobooks: AudiobooksArea;
  /** Podcasts */
  readonly podcasts: PodcastsArea;
  /** Podcast-Gäste */
  readonly podcastGuests: PodcastGuestsArea;
  /** Magazin und Storyfilter */
  readonly stories: StoriesArea;
  /** Landingpages */
  readonly landingpages: LandingpagesArea;
  /** Landingcards */
  readonly landingcards: LandingcardsArea;
  /** QR-Codes */
  readonly qrcodes: QrcodesArea;
  /** Kundenstimmen */
  readonly testimonials: TestimonialsArea;
  /** Angebote im Katalog */
  readonly offers: OffersArea;
  /** Expertise */
  readonly expertise: ExpertiseArea;
  /** Glossar */
  readonly glossary: GlossaryArea;
  /** Handbuch */
  readonly handbook: HandbookArea;
  /** Sprachprofile */
  readonly speechanalysis: SpeechanalysisArea;
  /** Interviews */
  readonly interviews: InterviewsArea;
  /** Akademie */
  readonly academy: AcademyArea;
  /** Werbekampagnen */
  readonly campaigns: CampaignsArea;
  /** CRM */
  readonly crm: CrmArea;
  /** Wissensgraph */
  readonly arango: ArangoArea;
  /** Geschäftsmodell */
  readonly businessModel: BusinessModelArea;
  /** Produkte */
  readonly products: ProductsArea;
  /** Content-Ideen */
  readonly sparring: SparringArea;
  /** Agenten und Anwendungen */
  readonly baukasten: BaukastenArea;
  /** Agent-Teams */
  readonly agentTeams: AgentTeamsArea;
  /** Reflexionen und Benachrichtigungen */
  readonly reflections: ReflectionsArea;
  /** E-Mail-Vorlagen und Webhooks */
  readonly verbindungen: VerbindungenArea;
  /** Kundensupport */
  readonly kundensupport: KundensupportArea;
  /** Rechnungen lesen */
  readonly buchhaltung: BuchhaltungArea;
  /** Telefon-Agenten */
  readonly toniCall: ToniCallArea;
  /** Angebote und Rechnungsentwürfe */
  readonly quote: QuoteArea;
}

export function createAreas(platform: PlatformCaller): Areas {
  return {
    books: new BooksArea(platform),
    audiobooks: new AudiobooksArea(platform),
    podcasts: new PodcastsArea(platform),
    podcastGuests: new PodcastGuestsArea(platform),
    stories: new StoriesArea(platform),
    landingpages: new LandingpagesArea(platform),
    landingcards: new LandingcardsArea(platform),
    qrcodes: new QrcodesArea(platform),
    testimonials: new TestimonialsArea(platform),
    offers: new OffersArea(platform),
    expertise: new ExpertiseArea(platform),
    glossary: new GlossaryArea(platform),
    handbook: new HandbookArea(platform),
    speechanalysis: new SpeechanalysisArea(platform),
    interviews: new InterviewsArea(platform),
    academy: new AcademyArea(platform),
    campaigns: new CampaignsArea(platform),
    crm: new CrmArea(platform),
    arango: new ArangoArea(platform),
    businessModel: new BusinessModelArea(platform),
    products: new ProductsArea(platform),
    sparring: new SparringArea(platform),
    baukasten: new BaukastenArea(platform),
    agentTeams: new AgentTeamsArea(platform),
    reflections: new ReflectionsArea(platform),
    verbindungen: new VerbindungenArea(platform),
    kundensupport: new KundensupportArea(platform),
    buchhaltung: new BuchhaltungArea(platform),
    toniCall: new ToniCallArea(platform),
    quote: new QuoteArea(platform),
  };
}
