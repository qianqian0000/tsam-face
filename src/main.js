// 兼容 IE
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueX from 'vuex'

import confirmComponents from './components/common/index'
import common from './assets/js/common.js'
import Vconsole from 'vconsole'
import './assets/fonts/iconfont.css'


Vue.use(VueX)
Vue.use(confirmComponents)
Vue.prototype.common = common

const vConsole = new Vconsole()
Vue.use(vConsole)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
