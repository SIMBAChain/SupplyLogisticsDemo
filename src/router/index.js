import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Shipment from '@/components/Shipment'
import Log from '@/components/Log'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/customer/:customerId/shipment',
      name: 'Shipment',
      component: Shipment
    },
    {
      path: '/customer/:customerId/shipment/:shipmentId/',
      name: 'Log',
      component: Log
    }
  ]
})
