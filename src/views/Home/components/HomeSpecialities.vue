<template>
  <section class="section section-features" id="features">
    <div class="container-fluid">
      <div class="section-header text-center">
        <h2>Find a Specialist</h2>
        <!-- <h2>Clinic and Specialities</h2> -->
        <!-- <p
          class="sub-title"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>-->
      </div>
      <div class="row justify-content-center">
        <div class="col-md-9">
          <!-- Slider -->
          <slick
            class="specialities-slider slider"
            :options="slickOptions"
            v-if="specialityList.length > 0"
          >
            <!-- Slider Item -->
            <div
              class="speicality-item text-center"
              v-for="(speciality, index) in specialityList"
              :key="`speciality-${index}`"
              @click="gotoSearchResult(speciality)"
            >
              <div class="speicality-img">
                <img
                  :src="getImagePath(speciality)"
                  class="img-fluid"
                  alt="Speciality"
                />
                <span>
                  <i class="fa fa-circle" aria-hidden="true"></i>
                </span>
              </div>
              <p>{{ speciality }}</p>
            </div>
            <!-- /Slider Item -->
          </slick>
          <!-- /Slider -->
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
        infinite: true,
        variableWidth: true,
        arrows: false,
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
        ]
      }
    }
  },
  computed: {
    specialityList() {
      return this.$store.state.webStructure.specialityList
    }
  },
  mounted() {},
  methods: {
    getImagePath(name) {
      var images = require.context(
        '../../../assets/img/specialities/',
        false,
        /\.png$/
      )
      return images('./' + name.toLowerCase() + '.png')
    },
    gotoSearchResult(item) {
      const keyword = {
        speciality: item,
        city: '',
        name: '',
        role: ''
      }

      this.$store.commit('updateHomeSearchKeyword', keyword)
      this.$router.push('/find-doctors')
    }
  }
}
</script>

<style lang="scss" scoped>
.speicality-item {
  cursor: pointer;
}
.section-features {
  padding: 40px 0px;
}
</style>
