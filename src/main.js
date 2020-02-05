import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

import "firebaseui/dist/firebaseui.css";
import "./firebase";

// Google Maps
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    // Add your API key here
    key: "AIzaSyAaPzZ6FPtWRqBIW5OlHrdGuCLBuLLk9uM",
    libraries: "places" // This is required if you use the Auto complete plug-in
  }
});

// Feather font icon
require("./assets/css/iconfont.css");

import "./filter";
import "./registerServiceWorker";

import FullCalendar from "vue-full-calendar";
import "fullcalendar/dist/fullcalendar.min.css";
Vue.use(FullCalendar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
