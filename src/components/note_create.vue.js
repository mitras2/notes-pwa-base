import { getNotesStore, createNote } from "../store/note_store.js";

const template = `
  <section class="create_note">
    <label>
        Neue Notiz:
        <span class="primary bold textButton" @click="saveNote">+</span>
      <textarea v-model="text" rows="7"></textarea>
    </label>
  </section>
`;

export default {
  template: template,
  setup() {

    const _store = getNotesStore();
    /** @type {{value: string}} */
    const text = Vue.ref("");

    const isSaveDisabled = Vue.computed(() => {
      if(text.value == null || text.value.trim().length < 1) {
        return true;
      }

      return false;
    });

    function saveNote() {
      if(isSaveDisabled.value) {
        return;
      }

      console.log(`Saving "${text.value}"`);

      const noteAndTitleArray = text.value.split("\n");
      let title = noteAndTitleArray.splice(0, 1)[0] ?? ""
      title = title.trim();
      let noteText = noteAndTitleArray.join("\n") ?? ""
      noteText = noteText.trim();

      const note = createNote(noteText, title);
      _store.storeNote(note);
      text.value = "";
    }

    return {text, saveNote, isSaveDisabled};
  }
}
