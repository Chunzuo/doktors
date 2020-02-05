export default {
  state: {
    sidebarItem: "My Patients"
  },
  mutations: {
    updateDoctorSidebarItem(state, value) {
      state.sidebarItem = value;
    }
  }
};
