export default {
  state: {
    selectedItem: 'Home',
    loginStatus: false
  },
  mutations: {
    updateSelectItem(state, value) {
      state.selectedItem = value
    },
    updateLoginStatus(state, value) {
      state.loginStatus = value
    }
  }
}
