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
          <img src="@/assets/img/logo.png" class="img-fluid" alt="Logo" />
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
            <router-link to="/">Home</router-link>
          </li>
          <li
            :class="{ active: selectedItem == 'MyPatients' }"
            v-if="(isDoctor || isAssistant) && !isMobile"
          >
            <router-link to="/doctors-mypatients">Patients</router-link>
          </li>
          <li
            class="has-submenu"
            :class="{ active: selectedItem == 'MyPatients' }"
            v-if="(isDoctor || isAssistant) && isMobile"
          >
            <a href="javascript:;">
              Patients
              <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="submenu">
              <li :class="{ active: sidebarItem == 'My Patients' }">
                <router-link to="/doctors-mypatients">My Patients</router-link>
              </li>
              <li :class="{ active: sidebarItem == 'Schedule Timings' }">
                <router-link to="/doctors-scheduletime"
                  >Schedule Timings</router-link
                >
              </li>
              <li :class="{ active: sidebarItem == 'Profile Settings' }">
                <router-link to="/doctors-profile"
                  >Profile Settings</router-link
                >
              </li>
              <li :class="{ active: sidebarItem == 'Social Media' }">
                <router-link to="/doctors-social">Social Media</router-link>
              </li>
              <li :class="{ active: sidebarItem == 'Calendar' }">
                <router-link to="/doctors-calendar">Calendar</router-link>
              </li>
              <!-- <li :class="{ active: sidebarItem == 'Settings' }">
                <router-link to="/doctors-setting">Settings</router-link>
              </li> -->
              <li :class="{ active: sidebarItem == 'Appointment' }">
                <router-link to="/doctors-appointment">Appointment</router-link>
              </li>
            </ul>
          </li>
          <li :class="{ active: selectedItem == 'Settings' }" v-if="isDoctor">
            <router-link to="/doctors-setting">Settings</router-link>
          </li>
          <li :class="{ active: selectedItem == 'Help' }">
            <router-link to="/help">Help</router-link>
          </li>
          <li :class="{ active: selectedItem == 'About' }">
            <router-link to="/about">About</router-link>
          </li>
          <li
            v-if="isUserManager"
            :class="{ active: selectedItem == 'UserManagement' }"
          >
            <router-link to="/user-management">User Management</router-link>
          </li>
          <li
            v-if="isAdsManager"
            :class="{ active: selectedItem == 'AdsManagement' }"
          >
            <router-link to="/ads-management">Ads Management</router-link>
          </li>
          <li
            v-if="isPatient"
            :class="{ active: selectedItem == 'PatientDashboard' }"
          >
            <router-link to="/patient-dashboard">Dashboard</router-link>
          </li>

          <li v-if="loginStatus">
            <a
              class="nav-link header-login"
              style="color: red;"
              href="javascript:;"
              @click="logout"
              >Logout</a
            >
          </li>
        </ul>
      </div>
      <ul class="nav header-navbar-rht">
        <li class="nav-item" v-if="!loginStatus">
          <router-link class="nav-link header-login" to="/login"
            >Login / Signup</router-link
          >
        </li>

        <!-- User Menu -->
        <li class="nav-item" v-else>
          <a
            href="javascript:;"
            @click.prevent="gotoProfileSetting"
            class="nav-link"
          >
            <div class="row" style="align-items:center">
              <div class="ml-2">
                <h6>{{ userName }}</h6>
              </div>
              <span class="user-img ml-2">
                <img
                  class="rounded-circle"
                  src="@/assets/img/doctors/doctor-default.jpg"
                  width="31"
                />
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
export default {
  mounted() {
    this.initSubmenuEvent()
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
        this.$router.push('/doctors-profile')
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
