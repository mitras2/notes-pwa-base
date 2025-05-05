import { getNotesStore } from '../store/note_store.js';
import NoteCreate from './note_create.vue.js'
import NoteCard from './note_card.vue.js'

const template = `
  <div class="main start_page">
    <h1>Web Notes</h1>
    <p>Teste coole PWA-Technologie und lege deine Notizen an</p>
    <NoteCreate />
    <hr v-if="notesList.length > 0" >
    <NoteCard
      v-for="note in notesList"
      :key="note.id"
      :id="note.id"
      :title="note.title ?? ''"
      :text="note.text"
    />
  </div>
`;

export default {
  template: template,
  components: {
    NoteCreate,
    NoteCard
  },
  setup() {
    const _store = getNotesStore();
    const notesList = Vue.computed(() => {
      return [..._store.Notes.values()] ?? [];
    });

    console.log("NoteList:", notesList)

    return {
      s: _store,
      notesList,
    }
  }
}
