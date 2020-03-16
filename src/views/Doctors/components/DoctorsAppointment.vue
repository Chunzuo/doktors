<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Filter</h4>
            <div class="row mb-2">
              <div class="col">
                <label for>Appoinetment Date:</label>
                <datepicker class="datepicker" v-model="aptDate"></datepicker>
              </div>
              <div class="col">
                <label for>Patient Phone Number:</label>
                <input type="text" class="form-control" v-model="phoneNumber" />
              </div>
            </div>
            <div class="row">
              <div class="col text-right">
                <button class="btn btn-info" @click="filterAppointments">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Appointments</h4>
            <button class="btn btn-primary mb-2" @click="openDialog()">
              Add Appointment
            </button>
            <div class="card card-table mb-0">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Appointment Date</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(appt, index) in filteredAppointments"
                        :key="`apt-${index}`"
                      >
                        <td>{{ appt.patientName }}</td>
                        <td>{{ appt.patientPhone }}</td>
                        <td>
                          {{ getFormatDay(appt.date) }}
                          <span class="d-block text-info">
                            {{ formatTime(appt.time) }}
                          </span>
                        </td>
                        <td>
                          <span
                            class="badge badge-pill"
                            :class="getStatusColor(appt.status)"
                            >{{ getStatusLabel(appt.status) }}</span
                          >
                        </td>
                        <td class="appointment-action">
                          <a
                            href="javascript:void(0);"
                            class="btn btn-sm bg-success-light"
                            @click="acceptAppt(appt.id)"
                          >
                            <i class="fas fa-check"></i> Accept
                          </a>
                          <a
                            href="javascript:void(0);"
                            class="btn btn-sm bg-danger-light"
                            @click="cancelAppt(appt.id)"
                          >
                            <i class="fas fa-times"></i> Cancel
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vs-prompt
      @cancel="showDialog = false"
      @accept="addAppointment"
      @close="showDialog = false"
      :active.sync="showDialog"
      title="Add Appointment"
    >
      <div class="modal-body">
        <div class="form-group">
          <label for>Patient:</label>
          <select class="form-control" id="patient_select">
            <option
              v-for="(patient, index) in patients"
              :key="`patient - ${index}`"
              :value="`${patient.name}:${patient.patientMobile}`"
              >{{ patient.name }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <label for>Appoinetment Date:</label>
          <datepicker
            id="new_apt_datepicker"
            v-model="newAppointment.date"
          ></datepicker>
        </div>
        <div class="form-group">
          <div class="row">
            <div class="col-12 col-md-6">
              <label>Start Time</label>
              <flat-pickr
                class="form-control"
                :config="configdateTimePicker"
                placeholder="Choose time"
                v-model="newAppointment.startTime"
              />
            </div>

            <div class="col-12 col-md-6">
              <label>End Time</label>
              <flat-pickr
                class="form-control"
                :config="configdateTimePicker"
                placeholder="Choose time"
                v-model="newAppointment.endTime"
              />
            </div>
          </div>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import { db } from '@/firebase'
import Datepicker from 'vuejs-datepicker'
import jQuery from 'jquery'
require('select2/dist/js/select2.full.js')
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
export default {
  created() {
    this.$store.commit('updateDoctorSidebarItem', 'Appointment')
  },
  mounted() {
    this.getAppointment()
    jQuery('.datepicker input').addClass('form-control')
  },
  methods: {
    async getAppointment() {
      this.$vs.loading()
      const appts = await db
        .collection('Appointments')
        .where('doctorId', '==', this.userInfo.id)
        .get()
      this.appointments = []
      this.filteredAppointments = []
      appts.forEach(async appt => {
        const { patientName, date, time, status, patientPhone } = appt.data()

        this.appointments.push({
          patientName: patientName,
          patientPhone: patientPhone,
          date: date,
          time: time,
          id: appt.id,
          status: status
        })
        this.filteredAppointments.push({
          patientName: patientName,
          patientPhone: patientPhone,
          date: date,
          time: time,
          id: appt.id,
          status: status
        })
      })
      this.$vs.loading.close()
    },
    getFormatDay(timestamp) {
      const date = timestamp.toDate()
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const strMonthDate = [
        'January',
        'Feburary',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'Octorber',
        'November',
        'December'
      ]
      return day + ' ' + strMonthDate[month] + ' ' + year
    },
    formatTime(time) {
      return time
      // const startTime = time.split(' - ')[0]
      // const endTime = time.split(' - ')[1]
      // console.log(startTime)
      // console.log(endTime)
      // const hour = time.split(':')[0]
      // const minute = time.split(':')[1]
      // if (hour == 12) {
      //   return time + ' PM'
      // }
      // if (hour > 12) {
      //   return hour - 12 + ':' + minute + ' PM'
      // } else {
      //   return time + ' AM'
      // }
    },
    async acceptAppt(id) {
      this.$vs.loading()
      await db
        .collection('Appointments')
        .doc(id)
        .update({ status: 1 })
      this.$vs.loading.close()
      this.getAppointment()
    },
    async cancelAppt(id) {
      this.$vs.loading()
      await db
        .collection('Appointments')
        .doc(id)
        .update({ status: 2 })
      this.$vs.loading.close()
      this.getAppointment()
    },
    getStatusColor(status) {
      if (status == 0) {
        return 'bg-warning-light'
      } else if (status == 1) {
        return 'bg-success-light'
      } else {
        return 'bg-danger-light'
      }
    },
    getStatusLabel(status) {
      if (status == 0) {
        return 'Pending'
      } else if (status == 1) {
        return 'Confirmed'
      } else if (status == 2) {
        return 'Cancelled'
      }
    },
    filterAppointments() {
      let tempArray = []
      if (this.aptDate != null) {
        this.appointments.forEach(item => {
          const date = item.date.toDate()
          if (
            date.getFullYear() == this.aptDate.getFullYear() &&
            date.getMonth() == this.aptDate.getMonth() &&
            date.getDate() == this.aptDate.getDate() &&
            item.patientPhone.includes(this.phoneNumber)
          ) {
            tempArray.push(item)
          }
        })
      } else {
        this.appointments.forEach(item => {
          if (item.patientPhone.includes(this.phoneNumber)) {
            tempArray.push(item)
          }
        })
      }
      this.filteredAppointments = tempArray
    },
    async addAppointment() {
      const patientInfo = jQuery('#patient_select').val()
      const patientName = patientInfo.split(':')[0]
      const patientPhone = patientInfo.split(':')[1]

      const apptData = {
        doctorId: this.userInfo.id,
        patientName: patientName,
        patientPhone: patientPhone,
        date: this.newAppointment.date,
        time:
          this.newAppointment.startTime + ' - ' + this.newAppointment.endTime,
        status: 1
      }
      this.$vs.loading()
      await db.collection('Appointments').add(apptData)
      this.$vs.loading.close()
      this.$vs.notify({
        text: 'Success in add appointment',
        color: 'success'
      })
      this.getAppointment()
    },
    async openDialog() {
      this.$vs.loading()

      const patients = await db
        .collection('History')
        .where('doctorUid', '==', this.userInfo.id)
        .get()
      this.patients = []
      patients.forEach(patient => {
        let data = patient.data()
        data['id'] = patient.id
        this.patients.push(data)
      })
      this.$vs.loading.close()
      this.showDialog = true
      setTimeout(() => {
        jQuery('#new_apt_datepicker').addClass('form-control')
      }, 100)
    }
  },
  data() {
    return {
      appointments: [],
      aptDate: null,
      phoneNumber: '',
      filteredAppointments: [],
      showDialog: false,
      newAppointment: {
        date: new Date()
      },
      patients: [],
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    }
  },
  components: {
    Datepicker,
    flatPickr
  }
}
</script>

<style lang="scss" scoped></style>
