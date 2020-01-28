<template>
  <div class="profile-sidebar">
    <div class="widget-profile pro-widget-content">
      <div class="profile-info-widget">
        <a href="#" class="booking-doc-img">
          <img src="@/assets/img/doctors/doctor-default.jpg" alt="User Image" />
        </a>
        <div class="profile-det-info">
          <h3>Dr. {{userInfo.name}}</h3>

          <div class="patient-details">
            <!-- <h5 class="mb-0">BDS, MDS - Oral & Maxillofacial Surgery</h5> -->
            <h5 class="mb-0">{{userInfo.phone}}</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-widget">
      <nav class="dashboard-menu">
        <ul>
          <!-- <li :class="{'active': sidebarItem == 'Dashboard' }">
            <router-link to="/doctors-dashboard">
              <i class="fas fa-columns"></i>
              Dashboard
            </router-link>
          </li>-->
          <li :class="{'active': sidebarItem == 'My Patients'}">
            <router-link to="/doctors-mypatients">
              <i class="fas fa-user-injured"></i>
              <span>My Patients</span>
            </router-link>
          </li>
          <li :class="{'active': sidebarItem == 'Schedule Timings'}">
            <router-link to="/doctors-scheduletime">
              <i class="fas fa-hourglass-start"></i>
              <span>Schedule Timings</span>
            </router-link>
          </li>
          <li :class="{'active': sidebarItem == 'Profile Settings'}">
            <router-link to="/doctors-profile">
              <i class="fas fa-user-cog"></i>
              <span>Profile Settings</span>
            </router-link>
          </li>
          <li :class="{'active': sidebarItem == 'Social Media'}">
            <router-link to="/doctors-social">
              <i class="fas fa-share-alt"></i>
              <span>Social Media</span>
            </router-link>
          </li>
          <li :class="{'active': sidebarItem == 'Calendar'}">
            <router-link to="/doctors-calendar">
              <i class="fas fa-calendar"></i>
              <span>Calendar</span>
            </router-link>
          </li>
          <li :class="{'active': sidebarItem == 'Settings'}">
            <router-link to="/doctors-setting">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </router-link>
          </li>
          <li>
            <a href="javascript:;" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    sidebarItem() {
      return this.$store.state.doctor.sidebarItem;
    },
    userInfo() {
      return this.$store.state.user.user;
    }
  },
  mounted() {},
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {});
      localStorage.removeItem("role");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>