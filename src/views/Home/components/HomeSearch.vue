<template>
  <section class="section section-search">
    <div class="container-fluid">
      <div class="banner-wrapper">
        <div class="banner-header text-center">
          <h1>{{$tc('search_doctor')}}</h1>
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
                >{{ city }}</option>
              </select>
            </div>
            <div class="form-group search-speciality" :class="language == 'en' ? 'ltl' : 'rtl'">
              <select class="form-control" id="speciality_select">
                <option value>All</option>
                <option
                  v-for="(speciality, index) in specialityList"
                  :key="`speciality - ${index}`"
                  :value="speciality"
                >{{ speciality }}</option>
              </select>
            </div>

            <div class="form-group search-info" style="flex: 0 0 240px;">
              <input
                type="text"
                class="form-control"
                :placeholder="$tc('search_doctor_name')"
                v-model="searchKeyword.name"
              />
              <!-- <span class="form-text">Ex : Dental or Sugar Check up etc</span> -->
            </div>
            <button @click.prevent="onClickSerchButton" class="btn btn-primary search-btn">
              <i class="fas fa-search"></i>
              <span>{{$tc('search')}}</span>
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
        name: '',
        role: ''
      },
      language: 'en'
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
    this.initJQuery()
    this.language = localStorage.getItem('language') || 'en'
  },
  methods: {
    onClickSerchButton() {
      this.searchKeyword.city = $('#city_select').val()
      this.searchKeyword.speciality = $('#speciality_select').val()
      this.$store.commit('updateHomeSearchKeyword', this.searchKeyword)
      this.$router.push('/find-doctors')
    },
    initJQuery() {
      $('#city_select').select2({
        placeholder: this.$tc('select_city'),
        width: '100%',
        containerCssClass: 'form-control'
      })

      $('#speciality_select').select2({
        placeholder: this.$tc('select_speciality'),
        width: '100%',
        containerCssClass: 'form-control'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select2-container--default
  .select2-selection--single
  .select2-selection__arrow {
  top: 7px;
}

.search-speciality {
  width: 240px;
}

.search-speciality.ltl {
  margin-right: 12px;
}
.search-speciality.rtl {
  margin-left: 12px;
}

@media only screen and (max-width: 575.98px) {
  .search-speciality {
    margin-right: 0px;
    margin-left: 0px !important;
    width: 100% !important;
  }
}
</style>
