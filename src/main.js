// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _ from 'lodash'
import './../node_modules/bulma/css/bulma.css'
import 'vue-select/dist/vue-select.css'

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$_', { value: _ })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
