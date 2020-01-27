<template>
  <section class="section section-specialities">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4">
          <div class="section-header">
            <h2>Welcome to Doktors</h2>
            <!-- <p>Lorem Ipsum is simply dummy text</p> -->
          </div>
          <div class="about-content">
            <p>
              This App is for improving doctors experience.
              It facilitates the task of keeping the history of the patients, recording their medications and appointments.
              This app can bring doctors talents to the right patients as they can search for the right one near the area.
            </p>
            <!-- <p>web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes</p>
            <a href="javascript:;">Read More..</a>-->
          </div>
        </div>
        <div class="col-lg-8">
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
                  <a :href="ads.link">{{ads.title}}</a>
                  <!-- <i class="fas fa-check-circle verified"></i> -->
                </h3>
                <p class="speciality">{{ads.description}}</p>
              </div>
            </div>
          </slick>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slick from "vue-slick";
import { db } from "@/firebase";
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
        adaptiveHeight: true
      },
      adsList: []
    };
  },
  mounted() {
    this.getAdsList();
  },
  methods: {
    async getAdsList() {
      const ref = await db.collection("Ads").get();
      this.adsList = [];
      ref.docs.forEach(doc => {
        let data = doc.data();
        data["id"] = doc.id;
        this.adsList.push(data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>