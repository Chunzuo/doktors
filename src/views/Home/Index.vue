<template>
  <div>
    <home-search v-if="!isManager"></home-search>

    <home-doctors></home-doctors>

    <home-features></home-features>
    <home-specialities></home-specialities>
  </div>
</template>

<script>
import HomeSearch from './components/HomeSearch'
import HomeSpecialities from './components/HomeSpecialities'
import HomeDoctors from './components/HomeDoctors'
import HomeFeatures from './components/HomeFeatures'

export default {
  components: {
    HomeSearch,
    HomeSpecialities,
    HomeDoctors,
    HomeFeatures
  },
  data() {
    return {}
  },
  created() {
    this.$store.commit('updateSelectItem', 'Home')
    this.loadWebStructureInfo()
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    },
    isManager() {
      return (
        this.userInfo.role == 'userManager' ||
        this.userInfo.role == 'adsManager'
      )
    }
  },
  methods: {
    async loadWebStructureInfo() {
      this.$vs.loading()
      await this.$store.dispatch('getWebStructure')
      this.$vs.loading.close()
    }
  }
}
</script>
