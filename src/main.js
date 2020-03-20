import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)

import 'firebaseui/dist/firebaseui.css'
import './firebase'

// Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    // Add your API key here
    key: 'AIzaSyAaPzZ6FPtWRqBIW5OlHrdGuCLBuLLk9uM',
    libraries: 'places' // This is required if you use the Auto complete plug-in
  }
})

// Feather font icon
require('./assets/css/iconfont.css')

import './filter'

import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.min.css'
Vue.use(FullCalendar)

// Vue Mask
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

Vue.config.productionTip = false
Vue.config.errorHandler = function() {}

// Print
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
