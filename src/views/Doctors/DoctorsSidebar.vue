<template>
  <div class="profile-sidebar">
    <div class="widget-profile pro-widget-content">
      <div class="profile-info-widget">
        <a href="#" class="booking-doc-img">
          <img :src="avatar" alt="Doctor Image" />
        </a>
        <div class="profile-det-info">
          <h3>{{ userName }}</h3>

          <div class="patient-details">
            <!-- <h5 class="mb-0">BDS, MDS - Oral & Maxillofacial Surgery</h5> -->
            <h5 class="mb-0">{{ userInfo.phone }}</h5>
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
          <li :class="{ active: sidebarItem == 'My Patients' }">
            <router-link to="/doctors-mypatients">
              <i class="fas fa-user-injured"></i>
              <span>My Patients</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Schedule Timings' }" v-if="!isAssistant">
            <router-link to="/doctors-scheduletime">
              <i class="fas fa-hourglass-start"></i>
              <span>Schedule Timings</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Profile Settings' }" v-if="!isAssistant">
            <router-link to="/doctors-profile">
              <i class="fas fa-user-cog"></i>
              <span>Profile Settings</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Social Media' }" v-if="!isAssistant">
            <router-link to="/doctors-social">
              <i class="fas fa-share-alt"></i>
              <span>Social Media</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Calendar' }" v-if="!isAssistant">
            <router-link to="/doctors-calendar">
              <i class="fas fa-calendar"></i>
              <span>Calendar</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Settings' }" v-if="!isAssistant">
            <router-link to="/doctors-setting">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Appointment' }" v-if="!isAssistant">
            <router-link to="/doctors-appointment">
              <i class="fas fa-calendar-check"></i>
              <span>Appointments</span>
            </router-link>
          </li>
          <li :class="{ active: sidebarItem == 'Schedule Timeslot' }" v-if="!isAssistant">
            <router-link to="/doctors-timeslot">
              <i class="fas fa-clock"></i>
              <span>Schedule Timeslot</span>
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
import firebase from 'firebase'
import { db } from '@/firebase'
export default {
  data() {
    return {
      avatar: ''
    }
  },
  computed: {
    sidebarItem() {
      return this.$store.state.doctor.sidebarItem
    },
    userInfo() {
      return this.$store.state.user.user
    },
    isAssistant() {
      return this.userInfo.role == 'assistant'
    },
    userName() {
      if (this.userInfo.role == 'doctor') {
        return `Dr.${this.userInfo.name}`
      }
      return this.userInfo.name
    }
  },
  watch: {
    userInfo() {
      this.loadDoctorAvatar()
    }
  },
  mounted() {
    this.loadDoctorAvatar()
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {})
      localStorage.removeItem('role')
      this.$router.push('/')
    },
    async loadDoctorAvatar() {
      if (!this.userInfo.id) {
        return
      }
      const doctorInfo = await db
        .collection('Doctors')
        .doc(this.userInfo.id)
        .get()
      const doctor = doctorInfo.data()
      if (doctor.avatar) {
        this.avatar = doctor.avatar
      } else {
        var images = require.context('../../assets/img/', false, /\.jpg$/)
        this.avatar = images('./doctor-default.jpg')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
