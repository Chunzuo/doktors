<template>
  <section class="section section-features" id="features">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-5 features-img">
          <img
            src="@/assets/img/features/feature.png"
            class="img-fluid"
            alt="Feature"
          />
        </div>
        <div class="col-md-7">
          <div class="section-header">
            <h2 class="mt-2">Availabe Features in this platform</h2>
            <!-- <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p> -->
          </div>
          <slick :options="slickOptions" class="features-slider slider">
            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-01.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Hospital</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-02.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Clinics</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-03.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Pharmacy</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-04.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Labs</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-05.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>X-Ray</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-06.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Cosmetics</p>
            </div>

            <div class="feature-item text-center">
              <img
                src="@/assets/img/features/feature-04.jpg"
                class="img-fluid"
                alt="Feature"
              />
              <p>Sonar</p>
            </div>
          </slick>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slick from "vue-slick";
export default {
  components: {
    Slick
  },
  data() {
    return {
      slickOptions: {
        dots: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 3,
        speed: 500,
        variableWidth: true,
        arrows: false,
        autoplay: false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped></style>
