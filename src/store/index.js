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
    homeSearchKeyword: null
  },
  mutations: {
    updateHomeSearchKeyword(state, value) {
      state.homeSearchKeyword = value
    }
  },
  actions: {
  },
  modules: {
    'header': headerModule,
    'user': userModule,
    'doctor': doctorModule,
    'webStructure': webStructureModule
  }
})
