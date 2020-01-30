<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <h2 class="breadcrumb-title">About Page</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="row justify-content-center text-center">
          <div class="col-md-8">
            <a href="/" class="navbar-brand logo">
              <img src="@/assets/img/logo.png" class="img-fluid" alt="Logo" />
            </a>

            <h5>
              This App is for improving doctors experience.
              It facilitates the task of keeping the history of the patients, recording their medications and appointments.
              This app can bring doctors talents to the right patients as they can search for the right one near the area.
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("updateSelectItem", "About");
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>