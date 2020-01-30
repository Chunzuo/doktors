<template>
  <div>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 col-lg-4 col-xl-3 theiaStickySidebar" sticky-container>
            <div v-sticky="true" sticky-offset="stickyOffset">
              <!-- Search Filter -->
              <div class="card search-filter">
                <div class="card-header">
                  <h4 class="card-title mb-0">Search Filter</h4>
                </div>
                <div class="card-body">
                  <div class="filter-widget">
                    <div>
                      <input
                        type="text"
                        class="form-control datetimepicker"
                        placeholder="Doctor's Name"
                        v-model="keywordName"
                      />
                    </div>
                  </div>
                  <div class="filter-widget search-box">
                    <div class="form-group">
                      <select
                        class="form-control"
                        v-model="keywordSpeciality"
                        id="speciality_select"
                      >
                        <option value>All</option>
                        <option
                          v-for="(speciality, index) in specialityList"
                          :key="`speciality - ${index}`"
                          :value="speciality"
                        >{{speciality}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="filter-widget search-box">
                    <div class="form-group">
                      <select class="form-control" v-model="keywordCity" id="city_select">
                        <option value>All</option>
                        <option
                          v-for="(city, index) in cityList"
                          :key="`city - ${index}`"
                          :value="city"
                        >{{city}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="btn-search">
                    <div class="row">
                      <div class="col-md-6 mt-2">
                        <button type="button" class="btn btn-block" @click="getDoctors(0)">Search</button>
                      </div>
                      <div class="col-md-6 mt-2">
                        <button
                          type="button"
                          class="btn btn-block"
                          style="background-color: #fe0d28; border-color: #fe0d28"
                          @click="resetKeyword"
                        >Reset</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /Search Filter -->

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

          <div class="col-md-12 col-lg-8 col-xl-9">
            <div class="row">
              <div class="col-md-3" v-for="(doctor, index) in doctors" :key="`doctor - ${index}`">
                <div class="profile-widget" style="min-height: 350px;">
                  <div class="doc-img">
                    <router-link :to="`/doctor-detail/${doctor.id}`">
                      <img
                        :src="doctor.avatar"
                        onerror="javascript:this.src='assets/img/doctor-default.jpg'"
                        class="img-fluid"
                        alt="Doctor Image"
                        style="height: 150px; min-height: 150px"
                      />
                    </router-link>
                  </div>
                  <div class="pro-content">
                    <h3 class="title">
                      <router-link :to="`/doctor-detail/${doctor.id}`">Dr. {{doctor.name}}</router-link>
                    </h3>
                    <p class="speciality">{{doctor.speciality}}</p>
                    <ul class="available-info">
                      <li>
                        <i class="fas fa-map-marker-alt"></i>
                        {{doctor.location}}
                      </li>
                    </ul>
                    <div class="row row-sm justify-content-center">
                      <div class="col-6">
                        <router-link
                          :to="`/doctor-detail/${doctor.id}`"
                          class="btn view-btn"
                        >View Profile</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="load-more text-center" v-if="lastVisible">
              <a
                class="btn btn-primary btn-sm"
                href="javascript:void(0);"
                @click="getDoctors(1)"
              >Load More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
require("select2/dist/js/select2.full.js");
import $ from "jquery";
import Slick from "vue-slick";
import Sticky from "vue-sticky-directive";
export default {
  data() {
    return {
      doctors: [],
      lastVisible: 0,
      keywordCity: "",
      keywordSpeciality: "",
      keywordName: "",
      slickOptions: {
        dots: false,
        autoplay: false,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
      },
      adsList: [],
      stickyOffset: {
        top: 30
      }
    };
  },
  computed: {
    keyword() {
      return this.$store.state.homeSearchKeyword;
    },
    specialityList() {
      return this.$store.state.webStructure.specialityList;
    },
    cityList() {
      return this.$store.state.webStructure.cityList;
    }
  },
  async mounted() {
    this.getDoctors(0);
    if (this.specialityList.length == 0) {
      this.$vs.loading();
      await this.$store.dispatch("getWebStructure");
      this.$vs.loading.close();
    }
    this.initJquery();
    this.getAdsList();
  },
  methods: {
    async getDoctors(type) {
      if (this.keyword) {
        this.keywordCity = this.keyword.city;
        this.keywordSpeciality = this.keyword.speciality;
        this.keywordName = this.keyword.name;
      }
      this.$vs.loading();

      let ref = db.collection("Doctors");
      if (this.keywordCity != "" && this.keywordCity != null) {
        ref = ref.where("city", "==", this.keywordCity);
      }
      if (this.keywordSpeciality != "" && this.keywordSpeciality != null) {
        ref = ref.where("speciality", "==", this.keywordSpeciality);
      }

      const doctors =
        type == 0
          ? await ref
              .limit(10)
              .orderBy("name")
              .get()
          : await ref
              .orderBy("name")
              .startAfter(this.lastVisible)
              .limit(10)
              .get();
      this.lastVisible = doctors.docs[doctors.docs.length - 1];

      if (type == 0) {
        this.doctors = [];
      }

      doctors.forEach(doctor => {
        let data = doctor.data();
        data["id"] = doctor.id;

        if (this.keywordName != "") {
          if (data.name.includes(this.keywordName)) {
            this.doctors.push(data);
          }
        } else {
          this.doctors.push(data);
        }
      });

      this.$vs.loading.close();
    },
    resetKeyword() {
      this.keywordName = "";
      this.keywordCity = "";
      this.keywordSpeciality = "";
    },
    initJquery() {
      $("#city_select").select2({
        placeholder: "Select a city",
        width: "100%",
        containerCssClass: "form-control"
      });

      $("#speciality_select").select2({
        placeholder: "Select a speciality",
        width: "100%",
        containerCssClass: "form-control"
      });
    },
    async getAdsList() {
      const ref = await db.collection("Ads").get();
      this.adsList = [];
      ref.docs.forEach(doc => {
        let data = doc.data();
        data["id"] = doc.id;
        this.adsList.push(data);
      });
    }
  },
  components: {
    Slick
  },
  directives: { Sticky }
};
</script>

<style lang="scss" scoped>
</style>