<template>
  <section class="section section-search">
    <div class="container-fluid">
      <div class="banner-wrapper">
        <div class="banner-header text-center">
          <h1>Search Doctor</h1>
          <!-- <h1>Search Doctor, Make an Appointment</h1> -->
          <!-- <p>Discover the best doctors, clinic & hospital the city nearest to you.</p> -->
        </div>

        <!-- Search -->
        <div class="search-box">
          <form>
            <div class="form-group search-location">
              <select id="city_select">
                <option value>All</option>
                <option
                  v-for="(city, index) in cityList"
                  :key="`city - ${index}`"
                  :value="city"
                  >{{ city }}</option
                >
              </select>
            </div>
            <div class="form-group" style="margin-right: 12px;">
              <select class="form-control" id="speciality_select">
                <option value>All</option>
                <option
                  v-for="(speciality, index) in specialityList"
                  :key="`speciality - ${index}`"
                  :value="speciality"
                  >{{ speciality }}</option
                >
              </select>
            </div>

            <div class="form-group search-info" style="flex: 0 0 240px;">
              <input
                type="text"
                class="form-control"
                placeholder="Search Doctor's name"
                v-model="searchKeyword.name"
              />
              <!-- <span class="form-text">Ex : Dental or Sugar Check up etc</span> -->
            </div>
            <button
              @click.prevent="onClickSerchButton"
              class="btn btn-primary search-btn"
            >
              <i class="fas fa-search"></i>
              <span>Search</span>
            </button>
          </form>
        </div>
        <!-- /Search -->
      </div>
    </div>
  </section>
</template>

<script>
require('select2/dist/js/select2.full.js')
import $ from 'jquery'
export default {
  data() {
    return {
      searchKeyword: {
        city: '',
        speciality: '',
        name: ''
      }
    }
  },
  computed: {
    cityList() {
      return this.$store.state.webStructure.cityList
    },
    specialityList() {
      return this.$store.state.webStructure.specialityList
    }
  },
  mounted() {
    this.getWebStructureInfo()
    this.initJQuery()
  },
  methods: {
    onClickSerchButton() {
      this.searchKeyword.city = $('#city_select').val()
      this.searchKeyword.speciality = $('#speciality_select').val()
      this.$store.commit('updateHomeSearchKeyword', this.searchKeyword)
      this.$router.push('/find-doctors')
    },
    async getWebStructureInfo() {
      if (this.cityList.length == 0) {
        this.$vs.loading()
        await this.$store.dispatch('getWebStructure')
        this.$vs.loading.close()
      }
    },
    initJQuery() {
      $('#city_select').select2({
        placeholder: 'Select a city',
        width: '100%',
        containerCssClass: 'form-control'
      })

      $('#speciality_select').select2({
        placeholder: 'Select a speciality',
        width: '100%',
        containerCssClass: 'form-control'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
