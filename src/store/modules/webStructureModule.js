import { db } from '@/firebase'

export default {
  state: {
    cityList: [],
    specialityList: [],
    helpList: []
  },
  mutations: {
    updateCityList(state, value) {
      state.cityList = value
    },
    updateSpecialityList(state, value) {
      state.specialityList = value
    },
    updateHelpList(state, value) {
      state.helpList = value
    }
  },
  actions: {
    async getWebStructure({ commit }) {
      const webStructure = await db.collection('WebStructure').doc('en').get()

      let data = webStructure.data()

      let cityList = []
      let specialityList = []
      let helpers = []
      const help = data.help
      const keys = Object.keys(help)
      const values = Object.values(help)
      keys.forEach((key, index) => {
        helpers.push({
          question: keys[index],
          answer: values[index]
        })
      })

      data['doctorCity'].forEach(item => {
        cityList.push(item.text)
      })

      data['doctorSpeciality'].forEach(item => {
        specialityList.push(item)
      })

      commit('updateCityList', cityList)
      commit('updateSpecialityList', specialityList)
      commit('updateHelpList', helpers)
    }
  }
}
