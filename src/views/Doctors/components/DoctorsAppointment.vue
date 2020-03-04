<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Appointments</h4>
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
                        v-for="(appt, index) in appointments"
                        :key="`apt-${index}`"
                      >
                        <td>{{ appt.patientName }}</td>
                        <td>{{ appt.patientPhone }}</td>
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
  </div>
</template>

<script>
import { db } from '@/firebase'
export default {
  created() {
    this.$store.commit('updateDoctorSidebarItem', 'Appointment')
  },
  mounted() {
    this.getAppointment()
  },
  methods: {
    async getAppointment() {
      this.$vs.loading()
      const appts = await db
        .collection('Appointments')
        .where('doctorId', '==', this.userInfo.id)
        .get()
      this.appointments = []
      appts.forEach(async appt => {
        const { patientId, date, time, status } = appt.data()
        const user = await db
          .collection('Users')
          .doc(patientId)
          .get()
        const { name, phone } = user.data()
        this.appointments.push({
          patientName: name,
          patientPhone: phone,
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
    }
  },
  data() {
    return {
      appointments: []
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
