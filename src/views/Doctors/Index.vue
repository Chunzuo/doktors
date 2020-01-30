<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <h2 class="breadcrumb-title">{{sidebarItem}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar" sticky-container>
            <doctors-sidebar v-sticky="true" sticky-offset="{top: 30}"></doctors-sidebar>
          </div>
          <div class="col-md-7 col-lg-8 col-xl-9">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DoctorsSidebar from "./DoctorsSidebar";
import Sticky from "vue-sticky-directive";
export default {
  components: {
    DoctorsSidebar
  },
  computed: {
    sidebarItem() {
      return this.$store.state.doctor.sidebarItem;
    }
  },
  directives: { Sticky },
  mounted() {
    const role = localStorage.getItem("role");
    if (role != "doctor") {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>