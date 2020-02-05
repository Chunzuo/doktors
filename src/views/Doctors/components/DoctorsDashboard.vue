<template>
  <div>
    <div class="row">
      <div class="col-md-12"></div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("updateDoctorSidebarItem", "Dashboard");
    this.$store.commit("updateSelectItem", "Dashboard");
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
