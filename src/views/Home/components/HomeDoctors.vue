<template>
  <section class="section section-specialities">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <slick :options="slickOptions" class="doctor-slider slider" v-if="adsList.length > 0">
            <div
              class="profile-widget"
              v-for="(ads, index) in adsList"
              :key="index"
              style="min-height: "
            >
              <div class="doc-img">
                <a :href="ads.link">
                  <img
                    class="img-fluid"
                    alt="User Image"
                    :src="ads.image"
                    style="height: 150px !important"
                  />
                </a>
              </div>
              <div class="pro-content" style="height: 120px; min-height: 120px;">
                <h3 class="title">
                  <a :href="ads.link">{{ ads.title }}</a>
                  <!-- <i class="fas fa-check-circle verified"></i> -->
                </h3>
                <p class="speciality">{{ ads.description }}</p>
              </div>
            </div>
          </slick>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slick from 'vue-slick'
import { db } from '@/firebase'
export default {
  components: {
    Slick
  },
  data() {
    return {
      slickOptions: {
        dots: false,
        autoplay: false,
        infinite: true,
        variableWidth: true,
        adaptiveHeight: true,
        prevArrow:
          '<button type="button" class="slick-prev" style="top: 80%">Previous</button>',
        nextArrow:
          '<button type="button" class="slick-next" style="top: 80%">Next</button>',
        rtl: false,
        arrows: true
      },
      adsList: []
    }
  },
  mounted() {
    this.getAdsList()
    const language = localStorage.getItem('language') || 'en'
    this.slickOptions['rtl'] = language == 'en' ? false : true
    this.slickOptions['arrows'] = language == 'en'
  },
  methods: {
    async getAdsList() {
      const ref = await db.collection('Ads').get()
      this.adsList = []
      ref.docs.forEach(doc => {
        let data = doc.data()
        data['id'] = doc.id
        this.adsList.push(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.section-specialities {
  padding: 10px 0px;
}

.slick-prev,
.slick-next {
  top: 80%;
}
</style>
