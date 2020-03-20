<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body pt-0">
              <!-- Tab Menu -->
              <nav class="user-tabs mb-4">
                <ul class="nav nav-tabs nav-tabs-bottom nav-justified">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      href="#pat_appointments"
                      data-toggle="tab"
                      >Appointments</a
                    >
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#pat_treatments" data-toggle="tab"
                      >Treatments</a
                    >
                  </li>
                </ul>
              </nav>
              <!-- /Tab Menu -->

              <!-- Tab Content -->
              <div class="tab-content pt-0">
                <!-- Appointment Tab -->
                <div id="pat_appointments" class="tab-pane fade show active">
                  <div class="card card-table mb-0">
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-hover table-center mb-0">
                          <thead>
                            <tr>
                              <th>Doctor</th>
                              <th>Appt Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(appt, index) in appointments"
                              :key="`appt - ${index}`"
                            >
                              <td>
                                <h2 class="table-avatar">
                                  <router-link
                                    :to="`/doctor-detail/${appt.doctorId}`"
                                    >{{ appt.doctorName }}</router-link
                                  >
                                </h2>
                              </td>
                              <td>
                                {{ getFormatDay(appt.date) }}
                                <span class="d-block text-info">{{
                                  formatTime(appt.time)
                                }}</span>
                              </td>
                              <td>
                                <span
                                  class="badge badge-pill"
                                  :class="getStatusColor(appt.status)"
                                  >{{ getStatusLabel(appt.status) }}</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /Appointment Tab -->

                <!-- Prescription Tab -->
                <div class="tab-pane fade" id="pat_treatments">
                  <div class="card card-table mb-0">
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-hover table-center mb-0">
                          <thead>
                            <tr>
                              <th>Doctor</th>
                              <th>Date</th>
                              <th>Treatment</th>
                              <th>Files</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(treatment, index) in treatments"
                              :key="`treatment - ${index}`"
                            >
                              <td>
                                <router-link
                                  :to="`/doctor-detail/${treatment.doctorId}`"
                                  >{{ treatment.doctorName }}</router-link
                                >
                              </td>
                              <td>{{ getFormatDay(treatment.date) }}</td>
                              <td>
                                <span v-if="treatment.visibility == true">{{
                                  treatment.treatment
                                }}</span>
                                <span class="text-danger" v-else
                                  >Invisible</span
                                >
                              </td>
                              <td>
                                <div v-if="treatment.visibility == true">
                                  <a
                                    v-for="(file, index) in treatment.files"
                                    :key="`file${index}`"
                                    :href="file"
                                    target="_blank"
                                    class="ml-2"
                                  >
                                    <i class="fas fa-file"></i>
                                  </a>
                                </div>
                                <span class="text-danger" v-else
                                  >Invisible</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /Prescription Tab -->
              </div>
              <!-- Tab Content -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
export default {
  created() {
    this.$store.commit('updateSelectItem', 'PatientDashboard')
    const role = localStorage.getItem('role')

    if (role != 'patient') {
      this.$router.push('/')
    }
  },
  mounted() {
    this.loadAppointment()
    this.loadTreatments()
  },
  methods: {
    async loadAppointment() {
      this.$vs.loading()

      const appts = await db
        .collection('Appointments')
        .where('patientPhone', '==', this.userInfo.phone)
        .get()
      this.appointments = []
      appts.forEach(async appt => {
        const { doctorId, date, status, time } = appt.data()
        const doctor = await db
          .collection('Doctors')
          .doc(doctorId)
          .get()
        const { name } = doctor.data()
        this.appointments.push({
          doctorName: name,
          date: date,
          time: time,
          status: status,
          doctorId: doctorId
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
      const hour = time.split(':')[0]
      const minute = time.split(':')[1]
      if (hour == 12) {
        return time + ' PM'
      }
      if (hour > 12) {
        return hour - 12 + ':' + minute + ' PM'
      } else {
        return time + ' AM'
      }
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
    async loadTreatments() {
      const histories = await db
        .collection('History')
        .where('patientMobile', '==', this.userInfo.phone)
        .get()
      this.treatments = []
      histories.forEach(async history => {
        const { visits, doctorUid } = history.data()
        // Get doctor name
        const doctorInfo = await db
          .collection('Doctors')
          .doc(doctorUid)
          .get()
        const { name } = doctorInfo.data()

        visits.forEach(visit => {
          this.treatments.push({
            date: visit.time,
            treatment: visit.treatment,
            files: visit.files,
            doctorName: name,
            doctorId: doctorUid,
            visibility: visit['visibility']
          })
        })

        this.treatments.sort((a, b) => {
          return b.date.toDate() - a.date.toDate()
        })
      })
    }
  },
  data() {
    return {
      appointments: [],
      treatments: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    }
  }
}
</script>

<style lang="scss" scoped></style>
