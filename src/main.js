import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import  VueResource  from 'vue-resource'
import * as echarts from 'echarts';
import * as utils from "./utils/index.js"
Vue.prototype.$utils = utils
Vue.prototype.$echarts = echarts
Vue.use(VueResource)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
