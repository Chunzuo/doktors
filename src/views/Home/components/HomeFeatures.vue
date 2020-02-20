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
            <div
              class="feature-item text-center"
              v-for="(feature, index) in features"
              :key="index"
              @click="searchFeature(feature.keyword)"
            >
              <img :src="feature.image" class="img-fluid" alt="Feature" />
              <p>{{ feature.text }}</p>
            </div>
          </slick>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slick from 'vue-slick'
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
      },
      features: [
        {
          image: '../assets/img/features/feature-01.jpg',
          text: 'Hospital',
          keyword: 'hospital'
        },
        {
          image: '../assets/img/features/feature-02.jpg',
          text: 'Clinics',
          keyword: 'clinics'
        },
        {
          image: '../assets/img/features/feature-03.jpg',
          text: 'Pharmacy',
          keyword: 'pharmacy'
        },
        {
          image: '../assets/img/features/feature-04.jpg',
          text: 'Labs',
          keyword: 'labs'
        },
        {
          image: '../assets/img/features/feature-05.jpg',
          text: 'X-Ray',
          keyword: 'xray'
        },
        {
          image: '../assets/img/features/feature-06.jpg',
          text: 'Cosmetics',
          keyword: 'cosmetics'
        },
        {
          image: '../assets/img/features/feature-04.jpg',
          text: 'Sonar',
          keyword: 'sonar'
        }
      ]
    }
  },
  methods: {
    searchFeature(feature) {
      const keyword = {
        role: feature
      }
      this.$store.commit('updateHomeSearchKeyword', keyword)
      this.$router.push('/find-role')
    }
  }
}
</script>

<style lang="scss" scoped>
.feature-item {
  cursor: pointer;
}
</style>
