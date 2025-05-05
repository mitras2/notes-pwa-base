const template = `
<span class="material-symbols-outlined">
  {{icon}}
</span>
`;

export default {
  name: "MaterialIcon",
  template: template,
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
