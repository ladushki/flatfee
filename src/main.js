// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _ from 'lodash'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import 'vue-select/dist/vue-select.css'

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$_', { value: _ })
Vue.use(Buefy)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
