<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg header-nav">
      <div class="navbar-header">
        <a id="mobile_btn" href="javascript:void(0);">
          <span class="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>
        <router-link to="/" class="navbar-brand logo">
          <img src="@/assets/img/logo_new.png" class="img-fluid" alt="Logo" />
        </router-link>
      </div>
      <div class="main-menu-wrapper">
        <div class="menu-header">
          <router-link to="/" class="menu-logo">
            <img src="assets/img/logo.png" class="img-fluid" alt="Logo" />
          </router-link>
          <a id="menu_close" class="menu-close" href="javascript:void(0);">
            <i class="fas fa-times"></i>
          </a>
        </div>
        <ul class="main-nav">
          <li :class="{ active: selectedItem == 'Home' }">
            <router-link to="/">
              <i v-if="isMobile" class="fas fa-home"></i>
              {{$tc('home')}}
            </router-link>
          </li>
          <li v-if="isPatient" :class="{ active: selectedItem == 'PatientDashboard' }">
            <router-link to="/patient-dashboard">
              <i v-if="isMobile" class="fab fa-houzz"></i>
              {{$tc('my_records')}}
            </router-link>
          </li>
          <li
            :class="{ active: selectedItem == 'MyPatients' }"
            v-if="(isDoctor || isAssistant) && !isMobile"
          >
            <router-link to="/doctors-mypatients">Patients</router-link>
          </li>
          <li
            :class="{ active: sidebarItem == 'My Patients' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-mypatients">
              <i class="fas fa-user-injured"></i>My Patients
            </router-link>
          </li>

          <li
            :class="{ active: sidebarItem == 'Schedule Timings' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-scheduletime">
              <i class="fas fa-hourglass-start"></i>Schedule Timings
            </router-link>
          </li>
          <li
            :class="{ active: sidebarItem == 'Profile Settings' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-profile">
              <i class="fas fa-user-cog"></i>Profile Settings
            </router-link>
          </li>
          <li
            :class="{ active: sidebarItem == 'Social Media' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-social">
              <i class="fas fa-share-alt"></i>Social Media
            </router-link>
          </li>
          <li
            :class="{ active: sidebarItem == 'Calendar' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-calendar">
              <i class="fas fa-calendar"></i>Calendar
            </router-link>
          </li>
          <li
            :class="{ active: sidebarItem == 'Appointment' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <router-link to="/doctors-appointment">
              <i class="fas fa-calendar-check"></i>Appointment
            </router-link>
          </li>

          <li :class="{ active: selectedItem == 'Settings' }" v-if="isDoctor">
            <router-link to="/doctors-setting">
              <i v-if="isMobile" class="fas fa-cog"></i>Settings
            </router-link>
          </li>
          <li :class="{ active: selectedItem == 'Help' }">
            <router-link to="/help">
              <i v-if="isMobile" class="fas fa-question"></i>
              {{$tc('help')}}
            </router-link>
          </li>
          <li :class="{ active: selectedItem == 'About' }">
            <router-link to="/about">
              <i v-if="isMobile" class="fas fa-info"></i>
              {{$tc('about')}}
            </router-link>
          </li>
          <li v-if="isUserManager" :class="{ active: selectedItem == 'UserManagement' }">
            <router-link to="/user-management">
              <i v-if="isMobile" class="fas fa-users"></i>User Management
            </router-link>
          </li>
          <li v-if="isAdsManager" :class="{ active: selectedItem == 'AdsManagement' }">
            <router-link to="/ads-management">
              <i v-if="isMobile" class="fas fa-ad"></i>Ads Management
            </router-link>
          </li>
          <li v-if="isDepartment" :class="{ active: selectedItem == 'UserProfile' }">
            <router-link :to="`/edit-userprofile/${user.id}`">
              <i v-if="isMobile" class="fas fa-user"></i>Profile
            </router-link>
          </li>

          <li class="nav-item" v-if="isMobile && !isDoctor">
            <select class="form-control" @change="updateLanguage" v-model="language">
              <option value="en">English</option>
              <option value="ku">کوردی</option>
              <option value="ar">العربية</option>
            </select>
          </li>

          <li class="nav-item" v-if="!loginStatus && isMobile">
            <router-link
              class="nav-link header-login"
              to="/login"
            >{{$tc('login')}} / {{$tc('signup')}}</router-link>
          </li>

          <li v-if="loginStatus">
            <a
              class="nav-link header-login"
              style="color: red;"
              href="javascript:;"
              @click="logout"
            >Logout</a>
          </li>
        </ul>
      </div>
      <ul class="nav header-navbar-rht">
        <select class="mr-2" @change="updateLanguage" v-model="language" v-if="!isDoctor">
          <option value="en">English</option>
          <option value="ku">کوردی</option>
          <option value="ar">العربية</option>
        </select>
        <li class="nav-item" v-if="!loginStatus">
          <router-link
            class="nav-link header-login"
            to="/login"
          >{{$tc('login')}} / {{$tc('signup')}}</router-link>
        </li>

        <!-- User Menu -->
        <li class="nav-item" v-else>
          <a href="javascript:;" @click.prevent="gotoProfileSetting" class="nav-link">
            <div class="row" style="align-items:center">
              <!-- <div class="ml-2"> -->
              <h6 class="mb-0">{{ userName }}</h6>
              <!-- </div> -->
              <span class="user-img ml-2">
                <img class="rounded-circle" :src="avatar" width="31" />
              </span>
            </div>
          </a>
          <!-- </a> -->
        </li>
        <!-- /User Menu -->
      </ul>
    </nav>
  </header>
</template>

<script>
import firebase from 'firebase'
import $ from 'jquery'
import { db } from '@/firebase'
export default {
  mounted() {
    this.initSubmenuEvent()
    this.language = localStorage.getItem('language') || 'en'
  },
  computed: {
    selectedItem() {
      return this.$store.state.header.selectedItem
    },
    loginStatus() {
      return this.$store.state.header.loginStatus
    },
    user() {
      return this.$store.state.user.user
    },
    userName() {
      if (this.user.role == 'doctor') {
        return `Dr. ${this.user.name}`
      }
      return this.user.name
    },
    isUserManager() {
      return this.user.role == 'userManager'
    },
    isAdsManager() {
      return this.user.role == 'adsManager'
    },
    isDoctor() {
      return this.user.role == 'doctor'
    },
    isAssistant() {
      return this.user.role == 'assistant'
    },
    isPatient() {
      return this.user.role == 'patient'
    },
    isMobile() {
      this.initSubmenuEvent()
      return this.$store.getters.isMobile
    },
    sidebarItem() {
      return this.$store.state.doctor.sidebarItem
    },
    isDepartment() {
      return (
        this.role != '' &&
        this.role != null &&
        this.user.role != 'doctor' &&
        this.user.role != 'patient'
      )
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {})
      localStorage.removeItem('role')
      this.$store.commit('setUserInfo', {})
      this.$router.push('/')
    },
    gotoProfileSetting() {
      if (this.user.role == 'doctor') {
        this.$router.push(`/doctor-detail/${this.user.id}`)
      }
    },
    initSubmenuEvent() {
      setTimeout(() => {
        $('.main-nav a').on('click', function(e) {
          if (
            $(this)
              .parent()
              .hasClass('has-submenu')
          ) {
            e.preventDefault()
          }
          if (!$(this).hasClass('submenu')) {
            $('ul', $(this).parents('ul:first')).slideUp(350)
            $('a', $(this).parents('ul:first')).removeClass('submenu')
            $(this)
              .next('ul')
              .slideDown(350)
            $(this).addClass('submenu')
          } else if ($(this).hasClass('submenu')) {
            $(this).removeClass('submenu')
            $(this)
              .next('ul')
              .slideUp(350)
          }
        })
      }, 100)
    },
    async loadDoctorAvatar() {
      const doctorInfo = await db
        .collection('Doctors')
        .doc(this.user.id)
        .get()
      const doctor = doctorInfo.data()
      if (doctor.avatar) {
        this.avatar = doctor.avatar
      } else {
        var images = require.context('../assets/img/', false, /\.jpg$/)
        this.avatar = images('./doctor-default.jpg')
      }
    },
    updateLanguage() {
      localStorage.setItem('language', this.language)
      location.reload()
    }
  },
  watch: {
    user() {
      if (this.user.role == 'doctor') {
        this.loadDoctorAvatar()
      } else {
        var images = require.context('../assets/img/', false, /\.jpg$/)
        this.avatar = images('./doctor-default.jpg')
      }
    }
  },
  data() {
    return {
      avatar: '',
      language: 'en'
    }
  }
}
</script>

<style lang="scss" scoped></style>
