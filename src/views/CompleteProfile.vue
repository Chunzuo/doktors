<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <!-- Register Content -->
          <div class="account-content">
            <div class="row align-items-center justify-content-center">
              <div class="col-md-12 col-lg-6 login-right">
                <div class="login-header">
                  <h3>Complete Profile</h3>
                </div>

                <!-- Register Form -->
                <form>
                  <div class="form-group form-focus">
                    <input
                      type="text"
                      class="form-control floating"
                      v-model="user.name"
                    />
                    <label class="focus-label">Name</label>
                  </div>
                  <!-- <div class="form-group">
                    <label for class="text-secondary">Mobile Number</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.phone"
                    />
                  </div>-->
                  <div class="form-group">
                    <label class="text-secondary">Select Role</label>
                    <select name id class="form-control" v-model="user.role">
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="hospital">Hospital</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="xray">X-Ray</option>
                      <option value="cosmetics">Cosmetics</option>
                      <option value="sonar">Sonar</option>
                    </select>
                  </div>

                  <button
                    class="btn btn-primary btn-block btn-lg login-btn"
                    type="submit"
                    @click.prevent="signup"
                    :disabled="!validateForm"
                  >
                    Signup
                  </button>
                  <!-- <div class="login-or">
                    <span class="or-line"></span>
                    <span class="span-or">or</span>
                  </div>
                  <div class="row form-row social-login">
                    <div class="col-6">
                      <a href="#" class="btn btn-facebook btn-block">
                        <i class="fab fa-facebook-f mr-1"></i> Login
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="#" class="btn btn-google btn-block">
                        <i class="fab fa-google mr-1"></i> Login
                      </a>
                    </div>
                  </div>-->
                </form>
                <!-- /Register Form -->
              </div>
            </div>
          </div>
          <!-- /Register Content -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { db } from '@/firebase'
export default {
  data() {
    return {
      user: {
        role: 'patient',
        phone: ''
      },
      locations: null
    }
  },
  computed: {
    storedUser() {
      return this.$store.state.user.user
    },
    validateForm() {
      return this.user.name != ''
    }
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.locations = pos
    })

    this.user.phone = this.storedUser.phone
    // Floating Label
    if ($('.floating').length > 0) {
      $('.floating')
        .on('focus blur', function(e) {
          $(this)
            .parents('.form-focus')
            .toggleClass('focused', e.type === 'focus' || this.value.length > 0)
        })
        .trigger('blur')
    }
  },
  methods: {
    async signup() {
      this.$vs.loading()
      const newUser = await db.collection('Users').add(this.user)
      if (this.user.role == 'doctor') {
        await this.addDoctor(newUser.id)
      }

      this.$vs.loading.close()
      this.user.id = newUser.id
      localStorage.setItem('role', this.user.role)
      this.$store.commit('setUserInfo', this.user)
      this.$router.push('/')
    },
    async addDoctor(doctorId) {
      const doctorProfile = {
        openingHours: {
          mon: { closed: true, from: '', until: '' },
          tue: { closed: true, from: '', until: '' },
          wed: { closed: true, from: '', until: '' },
          thu: { closed: true, from: '', until: '' },
          fri: { closed: true, from: '', until: '' },
          sat: { closed: true, from: '', until: '' },
          sun: { closed: true, from: '', until: '' }
        },
        mapCenter: {
          lng: this.locations ? this.locations.coords.longitude : 0.0,
          lat: this.locations ? this.locations.coords.latitude : 0.0
        }
      }
      await db
        .collection('DoctorProfiles')
        .doc(doctorId)
        .set(doctorProfile)

      const webStructureRef = await db
        .collection('WebStructure')
        .doc('en')
        .get()
      const webStructure = webStructureRef.data()
      let historyElements = {}
      if (webStructure) historyElements = webStructure['historyElements']
      const doctor = {
        historyElements: historyElements,
        name: this.user.name,
        phone: this.user.phone
      }
      await db
        .collection('Doctors')
        .doc(doctorId)
        .set(doctor)
    }
  }
}
</script>

<style lang="scss" scoped></style>
