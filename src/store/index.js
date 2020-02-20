import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Modules
import headerModule from './modules/headerModule'
import userModule from './modules/userModule'
import doctorModule from './modules/doctorModule'
import webStructureModule from './modules/webStructureModule'

export default new Vuex.Store({
  state: {
    homeSearchKeyword: null,
    windowWidth: 0
  },
  mutations: {
    updateHomeSearchKeyword(state, value) {
      state.homeSearchKeyword = value
    },
    setWindowWidth(state, value) {
      state.windowWidth = value
    }
  },
  getters: {
    isMobile(state) {
      return state.windowWidth < 992
    }
  },
  actions: {},
  modules: {
    header: headerModule,
    user: userModule,
    doctor: doctorModule,
    webStructure: webStructureModule
  }
})
