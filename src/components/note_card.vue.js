const template = `
<router-link :to="{name: 'note', params: {id: id}}" >
  <article class="note">
    <h3>{{title}}</h3>
    <p>{{text}}</p>
  </article>
</router-link>
`;

export default {
  template: template,
  components: {
    RouterLink: VueRouter.RouterLink
  },
  props: {
    id: String,
    title: String,
    text: String
  },
}
