import Vue from 'vue'
import Router from 'vue-router'
import FeeCalculator from '@/components/FeeCalculator'
import organisation from '../json/organisation.json'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FeeCalculator',
      component: FeeCalculator,
      props: { data: organisation }
    }
  ]
})
