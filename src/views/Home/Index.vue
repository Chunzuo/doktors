<template>
  <div>
    <home-search></home-search>

    <home-doctors></home-doctors>

    <home-specialities></home-specialities>

    <home-features></home-features>
  </div>
</template>

<script>
import HomeSearch from "./components/HomeSearch";
import HomeSpecialities from "./components/HomeSpecialities";
import HomeDoctors from "./components/HomeDoctors";
import HomeFeatures from "./components/HomeFeatures";

export default {
  components: {
    HomeSearch,
    HomeSpecialities,
    HomeDoctors,
    HomeFeatures
  },
  data() {
    return {};
  },
  created() {
    this.$store.commit("updateSelectItem", "Home");
  }
};
</script>
