<template>
  <section class="section section-doctor">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-5 features-img">
          <img src="@/assets/img/login-banner.png" class="img-fluid" alt="Feature" />
        </div>
        <div class="col-md-7">
          <div class="section-header">
            <h2 class="mt-2">{{$tc('find_service')}}</h2>
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
        autoplay: true,
        infinite: false,
        variableWidth: true,
        arrows: false,
        rtl: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
          {
            breakpoint: 600,
            settings: {
              dots: false,
              arrows: true,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ],
        centerMode: true
      },
      features: [
        {
          image: '../assets/img/features/feature-01.jpg',
          text: 'Hospitals',
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
        role: feature,
        city: '',
        speciality: '',
        name: ''
      }
      this.$store.commit('updateHomeSearchKeyword', keyword)
      this.$router.push('/find-doctors')
    }
  },
  mounted() {
    const language = localStorage.getItem('language') || 'en'
    this.slickOptions.rtl = language == 'en' ? false : true
    this.slickOptions.responsive[0].arrows = language == 'en'
  }
}
</script>

<style lang="scss" scoped>
.feature-item {
  cursor: pointer;
}
.section-doctor {
  padding: 40px 0px;
}
</style>
