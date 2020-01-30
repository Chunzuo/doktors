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
          <a href="index.html" class="menu-logo">
            <img src="assets/img/logo.png" class="img-fluid" alt="Logo" />
          </a>
          <a id="menu_close" class="menu-close" href="javascript:void(0);">
            <i class="fas fa-times"></i>
          </a>
        </div>
        <ul class="main-nav">
          <li :class="{'active': selectedItem == 'Home'}">
            <router-link to="/">Home</router-link>
          </li>
          <li
            :class="{'active': selectedItem == 'MyPatients'}"
            v-if="loginStatus && !isUserManager"
          >
            <router-link to="/doctors-mypatients">Patients</router-link>
          </li>
          <li :class="{'active': selectedItem == 'Settings'}" v-if="loginStatus && !isUserManager">
            <router-link to="/doctors-setting">Settings</router-link>
          </li>
          <li :class="{'active': selectedItem == 'Help'}">
            <router-link to="/help">Help</router-link>
          </li>
          <li :class="{'active': selectedItem == 'About'}">
            <router-link to="/about">About</router-link>
          </li>
          <li v-if="loginStatus">
            <a
              class="nav-link header-login"
              style="color: red;"
              href="javascript:;"
              @click="logout"
            >Logout</a>
          </li>
          <li v-if="isUserManager" :class="{'active': selectedItem == 'UserManagement'}">
            <router-link to="/user-management">User Management</router-link>
          </li>
          <!-- <li class="login-link">
            <router-link to="/login">Login / Signup</router-link>
          </li>-->
        </ul>
      </div>
      <ul class="nav header-navbar-rht">
        <!-- <li class="nav-item contact-item">
          <div class="header-contact-img">
            <i class="far fa-hospital"></i>
          </div>
          <div class="header-contact-detail">
            <p class="contact-header">Contact</p>
            <p class="contact-info-header">+1 315 369 5943</p>
          </div>
        </li>-->
        <li class="nav-item" v-if="!loginStatus">
          <router-link class="nav-link header-login" to="/login">Login / Signup</router-link>
          <!-- <a class="nav-link header-login" href="login.html">login / Signup</a> -->
        </li>

        <!-- User Menu -->
        <li class="nav-item" v-else>
          <!-- <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown"> -->
          <a href="javascript:;" @click.prevent="gotoProfileSetting" class="nav-link">
            <div class="row" style="align-items:center">
              <div class="ml-2">
                <h6>Dr. {{user.name}}</h6>
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
import firebase from "firebase";
export default {
  mounted() {},
  computed: {
    selectedItem() {
      return this.$store.state.header.selectedItem;
    },
    loginStatus() {
      return this.$store.state.header.loginStatus;
    },
    user() {
      return this.$store.state.user.user;
    },
    isUserManager() {
      return this.user.role == "userManager";
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {});
      localStorage.removeItem("role");
      this.$store.commit("setUserInfo", {});
      this.$router.push("/");
    },
    gotoProfileSetting() {
      if (this.user.role == "doctor") {
        this.$router.push("/doctors-profile");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>