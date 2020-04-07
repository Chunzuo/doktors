<template>
  <div>
    <div class="content">
      <div class="container-fluid">
        <div class="row justify-content-center text-center">
          <div class="col-md-8">
            <a href="/" class="navbar-brand logo">
              <img src="@/assets/img/logo_new.png" class="img-fluid" alt="Logo" />
            </a>

            <h5>{{$tc('about_description')}}</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-top">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-3 col-md-6">
              <div class="footer-widget footer-about">
                <div class="footer-logo">
                  <img src="@/assets/img/logo_new.png" alt="logo" />
                </div>
                <div class="footer-about-content"></div>
              </div>
            </div>

            <div class="col-lg-3 col-md-6"></div>

            <div class="col-lg-3 col-md-6"></div>

            <div class="col-lg-3 col-md-6">
              <div class="footer-widget footer-contact">
                <h2 class="footer-title">Contact Us</h2>
                <div class="footer-contact-info">
                  <div class="footer-address">
                    <span>
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <p>
                      3556 Beech Street, San Francisco,
                      <br />California, CA 94108
                    </p>
                  </div>
                  <p>
                    <i class="fas fa-phone-alt"></i>
                    +1 315 369 5943
                  </p>
                  <p class="mb-0">
                    <i class="fas fa-envelope"></i>
                    admin@doktors.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit('updateSelectItem', 'About')
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
