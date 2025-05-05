import { getNotesStore } from "../store/note_store.js";
import AppHeaderbar from './app_headerbar.vue.js'

const template = `
<AppHeaderbar back="Übersicht" :title="title" />
<article class="page_note">
  <h2 contenteditable="true" @input="inputTitle" @blur="saveNote" placeholder="Titel" >{{title}}</h2>
  <p contenteditable="true" @input="inputText" @blur="saveNote" >{{text}}</p>
</article>
`;

export default {
  template: template,
  components: {
    AppHeaderbar
  },
  setup() {
    const _route = VueRouter.useRoute();
    const noteId = _route.params.id;

    const _store = getNotesStore();

    const _originalNote = Vue.ref(null);
    const _modifiedTitle = Vue.ref(null);
    const _isTitleModified = Vue.computed(() => {
      return _modifiedTitle.value !== null && _modifiedTitle.value.trim().length > 0;
    })
    const _modifiedText = Vue.ref(null);
    const _isTextModified = Vue.computed(() => {
      return _modifiedText.value !== null && _modifiedText.value.trim().length > 0;
    })

    Vue.onMounted(() => {
      const note = _store.getNote(noteId);
      _originalNote.value = note;
    });

    const isModified = Vue.computed(() => {
      return _isTitleModified.value || _isTextModified.value
    })

    const title = Vue.computed(() => {
      return _originalNote.value?.title ?? "";
    })

    const text = Vue.computed(() => {
      let text = _originalNote.value?.text ?? "";
      text.replaceAll('\n', '<br>');
      return text;
    })

    function inputTitle(e) {
      /** @type {HTMLElement} */
      const element = e.target;
      const newValue = element.textContent;

      if(newValue === _originalNote.value?.title) {
        _modifiedTitle.value = null;
        return;
      }

      _modifiedTitle.value = newValue;
    }

    function inputText(e) {
      /** @type {HTMLElement} */
      const element = e.target;
      const newValue = element.innerHTML;

      console.log('Neuer Text')
      console.log(newValue);

      const processedValue = processText(newValue);
      console.log('Eingabe verarbeitet')
      console.log(processedValue);

      if(processedValue === _originalNote.value?.text) {
        _modifiedText.value = null;
        return;
      }

      _modifiedText.value = processedValue;
    }

    /**
     * Converts the text input from the html element to standardized text (replacing br-Tags with \n)
     * @param {string} inputText The text that should be converted from raw html-input to valid text
     * @returns The converted text
     */
    function processText(inputText) {
      return inputText.replaceAll('<br>', '\n');
    }

    async function saveNote() {
      if (!isModified) return;

      /** @type {import("../store/note_store.js").Note} */
      const newNote = {..._originalNote.value};
      if(_isTitleModified.value) {
        newNote.title = _modifiedTitle.value;
      }
      if(_isTextModified.value) {
        newNote.text = _modifiedText.value;
      }

      await _store.storeNote(newNote);

      const updatdNote = _store.getNote(noteId);
      _originalNote.value = updatdNote;

      _modifiedTitle.value = null;
      _modifiedText.value = null
    }

    return {
      title,
      text,
      _modifiedTitle,
      _modifiedText,
      _originalNote,
      _isTitleModified,
      _isTextModified,
      inputTitle,
      inputText,
      saveNote,
      isModified,
    }

  }
}
