import { NotesDb } from "./note_db.js";

let _storeInstance;

/**
 * Gets the NotesStore singelton instance
 * @returns {NotesStore}
 */
export function getNotesStore() {
  if(_storeInstance === undefined) {
    _storeInstance = new NotesStore();
  }

  return _storeInstance;
}

class NotesStore {

  #db;
  #notes = Vue.reactive(new Map());

  constructor() {
    this.#db = new NotesDb();
    this.#db.init().then((result) => {
      if(result !== true) {
        console.error("Failed to open the database - We can not use the app correctly")
        console.dir(result);
        return;
      }

      this.#db.readNotes().then((result) => {
        if(result === false) {
          console.error("Failed to read the notes from the database - App can not be used correctly. Maybe a reload helps");
          return;
        }

        console.log("Notes from database:");
        console.dir(result);
        for(const note of result) {
          this.#notes.set(note.id, note);
        }
      });
    });
  }

  /**
   * Returns an Array of all notes
   * @returns {Array<Note>} Array of all notes
   */
  get Notes() {
    return this.#notes
  }

  /**
   * Returns a single note by id
   * @param {string} id The id of the requested note
   * @returns {Note} the note
   */
  getNote(id) {
    if(this.#notes.has(id)) {
      return this.#notes.get(id);
    }

    return undefined;
  }

  /**
   * Store a note into this in-memory store and into the persistant store (currently indexed db)
   * @param {Note} note
   */
  async storeNote(note) {
    if(note.id === undefined) {
      note.id = _createNoteId();
    }

    this.#notes.set(note.id, note);
    setTimeout(() => {
      console.dir(this.#notes)
    }, 50);
    await this.#db.storeNote(note);
  }

  async deleteNote(id) {
    if(this.#notes.has(id)) {
      await this.#db.deleteNote(id);
      return this.#notes.delete(id);
    }
  }

}

/**
 * Returns a standardized note object from text and optionally title and id.
 * @param {string} text The text content of the note
 * @param {string | undefined} title The title of the note, if there is any
 * @param {string | undefined} id The id of the note, if there is one
 * @returns {Note} The note object in it's standard form
 */
export function createNote(text, title, id) {
  if(id === undefined) {
    id = _createNoteId();
  }

  if(title === undefined) {
    let titleFromText = text.split('\\n')[0];

    if(titleFromText.length > 20) {
      titleFromText.substring(0,19);
      titleFromText += '…';
    }

    title = titleFromText;
  }

  return {
    id: id,
    title: title,
    text: text
  }
}

function _createNoteId() {
  return Date.now().toString();
}

/**
 * A Note
 * @typedef {{title: string, text: string, id: string}} Note
 */
