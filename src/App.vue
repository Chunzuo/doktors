<template>
  <router-view />
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    const language = localStorage.getItem('language') || 'en'
    if (language == 'en') {
      import('../public/assets/css/bootstrap.min.css')
      import('../public/assets/css/style.css')
    } else {
      import('../public/assets/plugins/bootstrap-rtl/css/bootstrap.min.css')
      import('../public/assets/css/style_rtl.css')
    }
  }
}
</script>

<style lang="scss"></style>
