<template>
  <div class="main-wrapper">
    <doktor-header></doktor-header>
    <router-view />
    <doktor-footer></doktor-footer>
  </div>
</template>

<script>
import jQuery from 'jquery'
import { db } from '@/firebase'
import firebase from 'firebase'
import 'firebase/auth'

import DoktorHeader from '../components/Header'
import DoktorFooter from '../components/Footer'

export default {
  name: 'app',
  components: {
    DoktorHeader,
    DoktorFooter
  },
  updated() {
    this.resizeContent()
  },
  mounted() {
    this.resizeContent()
    this.checkFirebaseAuth()

    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  methods: {
    resizeContent() {
      let $ = jQuery
      var height = $(window).height()
      var header_height = $('.header').height()
      var footer_height = $('.footer').height()
      var setheight = height - header_height
      var trueheight = setheight - footer_height

      $('.content').css('min-height', trueheight)
    },
    checkFirebaseAuth() {
      firebase.auth().onAuthStateChanged(async () => {
        const firebaseCurrentUser = firebase.auth().currentUser

        if (firebaseCurrentUser) {
          this.$store.commit('updateLoginStatus', true)
          const userInfo = await db
            .collection('Users')
            .where('phone', '==', firebaseCurrentUser.phoneNumber)
            .get()
          var userData = null
          userInfo.forEach(item => {
            userData = item.data()
            userData['id'] = item.id
          })
          if (userInfo.empty) {
            // Create a new user
            let userInfo = {
              name: '',
              phone: firebaseCurrentUser.phoneNumber,
              country: 'Iraq',
              role: 'patient'
            }

            this.$store.commit('setUserInfo', userInfo)
            this.$router.push('/complete-profile')
          } else {
            this.$store.commit('setUserInfo', userData)
            localStorage.setItem('role', userData.role)
            localStorage.setItem('userId', userInfo.id)
            if (userData.role == 'doctor') {
              localStorage.setItem('language', 'en')
              this.$router.push('/doctors-mypatients').catch(() => {})
            } else {
              this.$router.push('/').catch(() => {})
            }
          }
        } else {
          this.$store.commit('updateLoginStatus', false)
        }
      })
    },
    getWindowWidth() {
      const windowWidth = document.documentElement.clientWidth
      this.$store.commit('setWindowWidth', windowWidth)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
