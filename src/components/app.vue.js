const template = `
<main class="app" >
  <RouterView />
</main>
`;

export default {
  template: template,
  components: {
    RouterView: VueRouter.RouterView,
    RouterLink: VueRouter.RouterLink
  }
}
