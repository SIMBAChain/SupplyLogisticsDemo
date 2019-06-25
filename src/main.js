// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-dark.css'
import App from './App'
import router from './router'
import TreeView from 'vue-json-tree-view'
import Adal from 'vue-adal'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(TreeView)

Vue.use(Adal, {
  config: {
    tenant: process.env.VUE_APP_ADAL_TENANT_ID,
    clientId: process.env.VUE_APP_ADAL_CLIENT_ID,
    cacheLocation: process.env.VUE_APP_ADAL_CACHE_LOCATION,
    redirectUri: process.env.VUE_APP_ADAL_REDIRECT_URI

  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
