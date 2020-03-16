<template>
  <div>
    <div class="container mb-4 card p-4">
      <div class="row">
        <div class="col-md-3 mb-2">
          <label>Start Date:</label>
          <datepicker class="datepicker" v-model="startDate"></datepicker>
        </div>
        <div class="col-md-3 mb-2">
          <label>End Date:</label>
          <datepicker class="datepicker" v-model="endDate"></datepicker>
        </div>
        <div class="col-md-3 mb-2">
          <label>Patient Name:</label>
          <input type="text" class="form-control" v-model="name" />
        </div>
        <div class="col-md-3 mb-2">
          <label>Phone number:</label>
          <input type="text" class="form-control" v-model="phoneNumber" />
        </div>
      </div>
      <div class="row">
        <!-- <div class="col">
          <a class="add-new-btn" @click="$router.push('/doctors-addpatient')">
            Add patient
          </a>
        </div>-->
        <div class="col text-left" v-if="isValid">
          <a
            href="javascript:;"
            class="add-new-btn"
            @click="$router.push('/doctors-addpatient')"
            >Add patient</a
          >
        </div>

        <div class="col text-right">
          <button class="btn btn-danger" @click="loadPatients">Search</button>
        </div>
      </div>
    </div>

    <div class="row row-grid">
      <div
        class="col-md-6 col-lg-4 col-xl-3"
        v-for="(patient, idx) in patients"
        :key="idx"
      >
        <div class="card widget-profile pat-widget-profile">
          <div class="card-body">
            <div class="pro-widget-content">
              <div class="profile-info-widget">
                <router-link
                  :to="getPatientDetailLink(patient.id)"
                  class="booking-doc-img"
                >
                  <img
                    src="@/assets/img/patients/patient-default.png"
                    alt="User Image"
                  />
                </router-link>
                <div class="profile-det-info">
                  <h3>
                    <router-link :to="getPatientDetailLink(patient.id)">
                      {{ patient.name }}
                    </router-link>
                    <!-- <a href="patient-profile.html">{{patient.name}}</a> -->
                  </h3>

                  <div class="patient-details">
                    <h5>
                      <b>Last visit :</b>
                      {{ getLastVisit(patient.accessTime) }}
                    </h5>
                    <!-- <h5 class="mb-0">
                      <i class="fas fa-map-marker-alt"></i> Alabama, USA
                    </h5>-->
                  </div>
                </div>
              </div>
            </div>
            <div class="patient-info">
              <ul>
                <li>
                  Phone
                  <span>{{ getFormatPhoneNumber(patient.patientMobile) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <fab position="bottom-right" bg-color="#4C77B2" @click="$router.push('/doctors-addpatient')"></fab> -->
    <!-- <vs-button
      type="filled"
      icon="add"
      radius
      color="primary"
      size="large"
      style="right: 5vw; bottom: 4vh; z-index: 999; position: fixed;"
      @click="$router.push('/doctors-addpatient')"
    ></vs-button>-->
    <!-- <button
      class="btn btn-rounded btn-info"
      style="right: 5vw; bottom: 4vh; z-index: 999; position: fixed;"
      @click="$router.push('/doctors-addpatient')"
    >
      <i class="fa fa-plus"></i>
    </button>-->
  </div>
</template>

<script>
import { db } from '@/firebase'
import Datepicker from 'vuejs-datepicker'
import jQuery from 'jquery'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
// import fab from "vue-fab";
export default {
  created() {
    this.$store.commit('updateDoctorSidebarItem', 'My Patients')
    this.$store.commit('updateSelectItem', 'MyPatients')
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    },
    isDoctor() {
      return this.userInfo.role == 'dcotor'
    }
  },
  components: {
    Datepicker
  },
  data() {
    return {
      patients: [],
      startDate: null,
      endDate: null,
      name: '',
      phoneNumber: '',
      isValid: false
    }
  },
  mounted() {
    // this.loadPatients()
    this.checkExpireDate()
    jQuery('.datepicker input').addClass('form-control')
  },
  methods: {
    async loadPatients() {
      if (!this.userInfo.phone) {
        return
      }
      this.$vs.loading()
      let patientRef = null
      if (this.userInfo.role == 'doctor') {
        patientRef = db
          .collection('History')
          .where('doctorUid', '==', this.userInfo.id)
      } else if (this.userInfo.role == 'assistant') {
        patientRef = db
          .collection('History')
          .where('doctorUid', '==', this.userInfo.doctorId)
      }
      const patients = await patientRef
        .orderBy('accessTime', 'desc')
        .limit(10)
        .get()

      this.patients = []
      patients.forEach(patient => {
        let data = patient.data()

        const accessDate = data.accessTime.toDate()
        data['id'] = patient.id

        if (this.startDate != null) {
          if (this.endDate != null) {
            if (
              accessDate >= this.startDate &&
              accessDate <= this.endDate &&
              data.name.includes(this.name) &&
              data.patientMobile.includes(this.phoneNumber)
            ) {
              this.patients.push(data)
            }
          } else {
            if (
              accessDate >= this.startDate &&
              data.name.includes(this.name) &&
              data.patientMobile.includes(this.phoneNumber)
            ) {
              this.patients.push(data)
            }
          }
        } else if (this.endDate != null) {
          if (
            accessDate <= this.endDate &&
            data.name.includes(this.name) &&
            data.patientMobile.includes(this.phoneNumber)
          ) {
            this.patients.push(data)
          }
        } else {
          if (
            data.name.includes(this.name) &&
            data.patientMobile.includes(this.phoneNumber)
          ) {
            this.patients.push(data)
          }
        }
      })
      this.$vs.loading.close()
    },
    getLastVisit(accessTime) {
      return (
        accessTime.toDate().getDate() +
        '/' +
        (accessTime.toDate().getMonth() + 1) +
        '/' +
        accessTime.toDate().getFullYear()
      )
    },
    getPatientDetailLink(patientId) {
      return `/doctors-patient-detail/${patientId}`
    },
    clearSearchKeyword() {
      this.startDate = null
      this.endDate = null
      this.name = ''
      this.phoneNumber = ''
    },
    getFormatPhoneNumber(stringNumber) {
      const phoneNumber = parsePhoneNumberFromString(stringNumber)

      if (phoneNumber != null) {
        return phoneNumber.formatInternational()
      }
      return stringNumber
    },
    onKeydownPatientName(event) {
      if (event.keyCode == 13) {
        this.loadPatients()
      }
    },
    onKeydownPhoneNumber(event) {
      if (event.keyCode == 13) {
        this.loadPatients()
      }
    },
    async checkExpireDate() {
      this.$vs.loading()
      const doctorRef = await db
        .collection('Doctors')
        .doc(this.userInfo.id)
        .get()

      const { expireDate } = doctorRef.data()

      const today = new Date()
      if (today < expireDate.toDate()) {
        this.isValid = true
      } else {
        this.isValid = false
      }
      this.$vs.loading.close()
    }
  }
}
</script>

<style lang="scss" scoped></style>
