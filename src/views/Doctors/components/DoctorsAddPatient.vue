<template>
  <div>
    <div class="card" title="Add patient">
      <div class="mt-5">
        <form-wizard
          color="rgba(var(--vs-primary), 1)"
          :title="null"
          :subtitle="null"
          finishButtonText="Submit"
          @on-complete="onComplete"
        >
          <tab-content
            title="Basic information"
            class="mb-5"
            :before-change="validateStep1"
          >
            <!-- tab 1 content -->
            <form data-vv-scope="step-1">
              <div class="row">
                <div class="col">
                  <label for>Name</label>
                  <input
                    class="form-control"
                    style="width: 100%"
                    v-model="name"
                    name="name"
                  />
                </div>
                <div class="col">
                  <label for>Phone Number</label>
                  <the-mask
                    class="form-control"
                    v-model="phoneNumber"
                    mask="+(964) ###-####-###"
                  ></the-mask>
                </div>
              </div>
            </form>
          </tab-content>

          <!-- tab 2 content -->
          <tab-content
            title="Details"
            class="mb-5"
            :before-change="validateStep2"
          >
            <form data-vv-scope="step-2">
              <div class="row">
                <div
                  class="col-md-4"
                  v-for="(element, index) in historyElements"
                  :key="`element - ${index}`"
                >
                  <label>{{ element.title }}</label>
                  <textarea
                    v-model="detailInfo[element.id]"
                    class="w-full mb-4 form-control"
                    v-if="element.type == 'text'"
                  />
                  <input
                    v-model="detailInfo[element.id]"
                    class="w-full mb-4 form-control"
                    type="number"
                    v-if="element.type == 'number'"
                  />
                  <datepicker
                    class="w-full mb-4 md:mb-0 datepicker"
                    v-model="detailInfo[element.id]"
                    v-if="element.type == 'date'"
                  ></datepicker>
                  <div v-if="element.type == 'radio'">
                    <div
                      class="custom-control custom-radio custom-control-inline"
                      v-for="(value, index1) in element.values"
                      :key="`value - ${index1}`"
                    >
                      <input
                        class="custom-control-input"
                        type="radio"
                        :id="`radio${index}${index1}`"
                        :value="value"
                        v-model="detailInfo[element.id]"
                      />
                      <label
                        class="custom-control-label"
                        :for="`radio${index}${index1}`"
                        >{{ value }}</label
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="col-md-4">
                  <label for>Allergies</label>
                  <input class="w-full mb-4 form-control" v-model="detailInfo.allergies" />
                </div>
                <div class="col-md-4">
                  <label>Age of menarche</label>
                  <input
                    v-model="detailInfo.age_of_menarche"
                    class="w-full mb-4 form-control"
                    type="number"
                  />
                </div>
                <div class="col-md-4">
                  <label>Last menstrual period</label>
                  <datepicker
                    class="w-full mb-4 md:mb-0 datepicker"
                    v-model="detailInfo.last_menstrual_period"
                  ></datepicker>
                </div>
                <div class="col-md-4">
                  <label for>Regularity of cycle</label>
                  <input
                    label
                    v-model="detailInfo.regularity_of_cycle"
                    class="w-full mb-4 form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label for>Duration of cycle</label>
                  <input
                    label
                    v-model="detailInfo.duration_of_cycle"
                    class="w-full mb-4 form-control"
                    type="number"
                  />
                </div>
                <div class="col-md-4">
                  <label for>Cycle flow and pain</label>
                  <input
                    label
                    v-model="detailInfo.cycle_flow_and_pain"
                    class="w-full mb-4 form-control"
                  />
                </div>

                <div class="col-md-4">
                  <label for>Past medicines used</label>
                  <input
                    label
                    v-model="detailInfo.past_medicines_used"
                    class="w-full mb-4 form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label for>Current medicines taking</label>
                  <input
                    label
                    v-model="detailInfo.current_medicines_taking"
                    class="w-full mb-4 form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label for>Sleep duration</label>
                  <input label v-model="detailInfo.sleep_duration" class="w-full mb-4 form-control" />
                </div>
                <div class="col-md-4">
                  <label for>Appetite</label>
                  <input label v-model="detailInfo.appetite" class="w-full mb-4 form-control" />
                </div>
                <div class="col-md-4">
                  <label for>Smoking or other addiction</label>
                  <input
                    label
                    v-model="detailInfo.smoking_or_other_addiction"
                    class="w-full mb-4 form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label for>Education</label>
                  <input v-model="detailInfo.education" class="w-full mb-4 form-control" />
                </div>-->
              </div>
            </form>
          </tab-content>
        </form-wizard>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { db } from '@/firebase'
import firebase from 'firebase'
import Datepicker from 'vuejs-datepicker'
import jQuery from 'jquery'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default {
  data() {
    return {
      name: '',
      phoneNumber: '',
      email: '',
      city: 'new-york',
      proposalTitle: '',
      jobTitle: '',
      textarea: '',
      eventName: '',
      eventLocation: 'san-francisco',
      status: 'plannning',
      newPatientId: '',
      detailInfo: {},
      historyElements: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    }
  },
  methods: {
    async validateStep1() {
      if (this.name.length == 0 || this.phoneNumber.length == 0) {
        this.$vs.notify({
          text: 'Input the name and phone number',
          color: 'danger'
        })
        return false
      }
      this.phoneNumber = '+964' + this.phoneNumber
      const phoneNumber = parsePhoneNumberFromString(this.phoneNumber)
      if (!phoneNumber.isPossible()) {
        this.$vs.notify({
          text: 'Please input correct phone number',
          color: 'danger'
        })
        return false
      }

      this.$vs.loading()
      // // Check existing patient
      const signInUser = firebase.auth().currentUser
      const patientInfo = await db
        .collection('History')
        .where('doctorPhoneNumber', '==', signInUser.phoneNumber)
        .where('patientMobile', '==', this.phoneNumber)
        .get()
      if (patientInfo.empty) {
        // Create a new patient
        const doctorId =
          this.userInfo.role == 'doctor'
            ? this.userInfo.id
            : this.userInfo.doctorId
        const newPatient = {
          name: this.name,
          patientMobile: this.phoneNumber,
          doctorPhoneNumber: this.userInfo.phone,
          doctorUid: doctorId,
          accessTime: firebase.firestore.FieldValue.serverTimestamp()
        }
        const response = await db.collection('History').add(newPatient)
        this.newPatientId = response.id
      } else {
        this.$vs.notify({
          text: 'A patient with this number exists',
          color: 'danger'
        })
        this.$vs.loading.close()
        return false
      }
      this.$vs.loading.close()
      setTimeout(() => {
        jQuery('.datepicker input').addClass('form-control')
      }, 100)
      return true
    },
    async validateStep2() {
      this.$vs.loading()
      await db
        .collection('History')
        .doc(this.newPatientId)
        .update({ history: this.detailInfo })

      this.$vs.notify({
        text: 'Successfully add new patient info!',
        color: 'success'
      })
      this.$vs.loading.close()
      return true
    },
    async getHistoryElement() {
      this.$vs.loading()

      let doctor = null
      if (this.userInfo.role == 'doctor') {
        doctor = await db
          .collection('Doctors')
          .doc(this.userInfo.id)
          .get()
      } else if (this.userInfo.role == 'assistant') {
        doctor = await db
          .collection('Doctors')
          .doc(this.userInfo.doctorId)
          .get()
      }

      const { historyElements } = doctor.data()
      this.historyElements = historyElements.filter(element => {
        if (element.active) {
          return element
        }
      })
      this.$vs.loading.close()
    },
    onComplete() {
      this.$router.push('/doctors-mypatients')
    }
  },
  components: {
    FormWizard,
    TabContent,
    Datepicker
  },
  mounted() {
    this.getHistoryElement()
  }
}
</script>
