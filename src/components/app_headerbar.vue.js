import MaterialIcon from './app_material_icon.vue.js'

const template = `
<div class="headerBar" >
  <div class="headerSpacer"></div>
  <header>
    <div class="left" >
      <span v-if="back !== null" @click="navigateBack" >< {{back}}</span>
    </div>
    <div class="center">
    </div>
    <div class="rigth">
      <MaterialIcon icon="delete" />
    </div>
  </header>
</div>
`;

export default {
  template: template,
  components: {
    MaterialIcon
  },
  props: {
    title: {
      type: String,
      required: false,
      default: () => ""
    },
    back: {
      type: String,
      required: false,
      default: () => null
    },
    actions: {
      type: [Object],
      required: false,
      default: () => []
    }
  },
  setup() {

    const _router = VueRouter.useRouter();

    function navigateBack() {
      _router.go(-1);
    }

    return {
      navigateBack,
    }
  }
}
