import AppVue from './components/app.vue.js'
import PageStart from './components/page_start.vue.js'
import PageNote from './components/page_note.vue.js'

//#region Initialize and prepare the Vue-Router

const routes = [
  { name: "home", path: '/', component: PageStart },
  { name: "homeIndex", path: '/index.html', component: PageStart },
  { name: "note", path: '/note/:id', component: PageNote },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

//#endregion

const app = Vue.createApp(AppVue)
app.use(router);
app.mount('#app')
