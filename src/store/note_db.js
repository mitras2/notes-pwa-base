export class NotesDb {

  #db;

  constructor() {
  }

  async init() {
    try {
      const db = await this.openDbConnection();
      this.#db = db;
      return true;
    } catch (e) {
      return e;
    }
  }

  async openDbConnection() {

    const promise = new Promise((resolve, reject) => {
      const openReq = window.indexedDB.open("NoteDb", 2);

      openReq.onblocked = (event) => {
        // If some other tab is loaded with the database, then it needs to be closed
        // before we can proceed.
        console.log("Please close all other tabs with this site open!");
      };

      openReq.onupgradeneeded = (event) => {
        const db = event.target.result;
        // All other databases have been closed. Set everything up.
        const notesStore = db.createObjectStore("notes", { keyPath: "id" });
      };

      openReq.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        reject(event.target);
      };

      openReq.onsuccess = (event) => {
        const db = event.target.result;
        useDatabase(db);
        resolve(db);
      };

      function useDatabase(db) {
        // Make sure to add a handler to be notified if another page requests a version
        // change. We must close the database. This allows the other page to upgrade the database.
        // If you don't do this then the upgrade won't happen until the user closes the tab.
        db.onversionchange = (event) => {
          db.close();
          console.log(
            "A new version of this page is ready. Please reload or close this tab!",
          );
        };
      }
    });

    return promise;
  }

  async storeNote(note) {
    const promise = new Promise((resolve, reject) => {
      const transaction = this.#db.transaction("notes", "readwrite");

      transaction.oncomplete = (event) => {
        resolve(true);
      };

      transaction.onerror = (event) => {
        resolve(false);
      };

      // Store values in the objectStore.
      const notesStore = transaction.objectStore("notes");
      console.log("Trying to save note to the indexedDB");
      console.dir(note);
      notesStore.put(note);
    });

    return promise;
  }

  async deleteNote(id) {
    const promise = new Promise((resolve, reject) => {
      const transaction = this.#db.transaction("notes", "readwrite");

      transaction.oncomplete = (event) => {
        resolve(true);
      };

      transaction.onerror = (event) => {
        resolve(false);
      };

      // Store values in the objectStore.
      const notesStore = transaction.objectStore("notes");
      notesStore.delete(id);
    });

    return promise;
  }

  async readNotes() {
    const promise = new Promise((resolve, reject) => {
      const transaction = this.#db.transaction("notes");

      transaction.onerror = (event) => {
        resolve(false);
      };

      // Store values in the objectStore.
      const notesStore = transaction.objectStore("notes");
      notesStore.getAll().onsuccess = (event) => {
        resolve(event.target.result);
      };;

    });

    return promise;
  }

}

