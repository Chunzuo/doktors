<template>
  <div class="content">
    <div class="container" v-if="doctor && !success">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="booking-doc-info">
                <router-link :to="`/doctor-detail/${doctor.id}`">
                  <img
                    :src="doctor.avatar"
                    onerror="javascript:this.src='assets/img/doctor-default.jpg'"
                    class="img-fluid"
                    alt="Doctor Image"
                    style="height: 150px; min-height: 150px"
                  />
                </router-link>
                <div class="booking-info">
                  <h4>
                    <router-link :to="`/doctor-detail/${doctor.id}`">{{
                      doctor.name
                    }}</router-link>
                  </h4>

                  <p class="text-muted mb-0">
                    <!-- <i class="fas fa-map-marker-alt"></i> -->
                    {{ doctor.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-4 col-md-6">
              <h4 class="mb-1">{{ today }}</h4>
              <p class="text-muted">{{ toDate }}</p>
            </div>
          </div>
          <!-- Schedule Widget -->
          <div class="card booking-schedule schedule-widget">
            <!-- Schedule Header -->
            <div class="schedule-header">
              <div class="row">
                <div class="col-md-12">
                  <!-- Day Slot -->
                  <div class="day-slot">
                    <ul>
                      <li class="left-arrow">
                        <a href="javascript:void(0);" @click="getPastweek()">
                          <i class="fa fa-chevron-left"></i>
                        </a>
                      </li>
                      <li
                        v-for="(date, index) in weekDates"
                        :key="`week-date-${index}`"
                      >
                        <span>{{ getShortFormatDate(date) }}</span>
                        <span class="slot-date">
                          {{ getShortFormatDay(date) }}
                          <small class="slot-year">{{
                            getYearOfDate(date)
                          }}</small>
                        </span>
                      </li>
                      <li class="right-arrow">
                        <a href="javascript:void(0);" @click="getNextWeek()">
                          <i class="fa fa-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <!-- /Day Slot -->
                </div>
              </div>
            </div>
            <!-- /Schedule Header -->

            <!-- Schedule Content -->
            <div class="schedule-cont">
              <div class="row">
                <div class="col-md-12">
                  <!-- Time Slot -->
                  <div class="time-slot">
                    <ul class="clearfix">
                      <li
                        v-for="(slot, index) in weekSlots"
                        :key="`slot-${index}`"
                      >
                        <a class="timing" v-if="slot.length == 0">
                          <span>-</span>
                        </a>
                        <a
                          class="timing bg-primary-light"
                          href="#"
                          v-for="(data, idx) in slot"
                          :key="`time-${idx}`"
                          @click="makeAppointment(data, index)"
                          v-else
                        >
                          <span>{{ formatTime(data) }}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <!-- /Time Slot -->
                </div>
              </div>
            </div>
            <!-- /Schedule Content -->
          </div>
          <!-- /Schedule Widget -->
        </div>
      </div>
    </div>

    <div class="row justify-content-center" v-if="success">
      <div class="col-lg-6">
        <!-- Success Card -->
        <div class="card success-card">
          <div class="card-body">
            <div class="success-cont">
              <i class="fas fa-check"></i>
              <h3>Appointment booked Successfully!</h3>
              <p>
                Appointment booked with
                <strong>Dr. {{ doctor.name }}</strong>
                <br />on
                <strong
                  >{{ getShortFormatDay(apptDate) }} {{ apptTime }}</strong
                >
              </p>
              <router-link
                to="/patient-dashboard"
                class="btn btn-primary view-inv-btn"
                >View Appointments</router-link
              >
            </div>
          </div>
        </div>
        <!-- /Success Card -->
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
export default {
  data() {
    return {
      doctorId: this.$route.params.id,
      doctor: null,
      weekDates: [],
      weekSlots: [],
      success: false,
      apptDate: null,
      apptTime: null,
      doctorProfile: null
    }
  },
  mounted() {
    this.loadDoctorInfo()
  },
  methods: {
    async loadDoctorInfo() {
      this.$vs.loading()
      const ref = await db
        .collection('Doctors')
        .doc(this.doctorId)
        .get()
      this.doctor = ref.data()
      this.doctor['id'] = ref.id

      const profileRef = await db
        .collection('DoctorProfiles')
        .doc(this.doctorId)
        .get()
      this.doctorProfile = profileRef.data()

      this.$vs.loading.close()
      this.weeklyInfo()
    },
    getFormatDay(date) {
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
    getShortFormatDay(date) {
      const month = date.getMonth()
      const day = date.getDate()
      const strMonthDate = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      return day + ' ' + strMonthDate[month]
    },
    getYearOfDate(date) {
      return date.getFullYear()
    },
    getFormateDate(date) {
      const day = date.getDay()
      const strDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wendesday',
        'Thusday',
        'Friday',
        'Satureday'
      ]
      return strDays[day - 1]
    },
    getShortFormatDate(date) {
      const day = date.getDay()
      const strDays = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat']
      return strDays[day]
    },
    weeklyInfo() {
      const curr = new Date()
      const first = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
      let weekDates = []
      for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(curr.setDate(first + i)))
      }
      this.weekDates = weekDates

      const { timeSlots } = this.doctorProfile

      if (timeSlots != null) {
        const strDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        strDays.forEach(day => {
          this.weekSlots.push(timeSlots[day])
        })
      }
    },
    formatTime(slot) {
      const { startTime, endTime } = slot
      return startTime + ' -  ' + endTime
    },
    async makeAppointment(slot, index) {
      const { startTime, endTime } = slot

      if (!this.userInfo.id) {
        this.$vs.notify({
          text: 'Login before make an appointment',
          color: 'danger'
        })
        return
      }

      const apptData = {
        doctorId: this.doctorId,
        patientName: this.userInfo.name,
        patientPhone: this.userInfo.phone,
        date: this.weekDates[index],
        time: startTime + ' - ' + endTime,
        status: 0
      }
      this.apptDate = this.weekDates[index]
      this.apptTime = startTime + ' - ' + endTime
      this.$vs.loading()
      await db.collection('Appointments').add(apptData)
      this.success = true
      this.$vs.loading.close()
    },
    getPastweek() {
      const pastDate = this.weekDates[0].getDate() - 7
      const curr = new Date(this.weekDates[0].setDate(pastDate))
      const first = curr.getDate() - curr.getDay()
      let weekDates = []
      for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(curr.setDate(first + i)))
      }
      this.weekDates = weekDates
    },
    getNextWeek() {
      const nextDate = this.weekDates[0].getDate() + 7
      const curr = new Date(this.weekDates[0].setDate(nextDate))
      const first = curr.getDate() - curr.getDay()
      let weekDates = []
      for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(curr.setDate(first + i)))
      }
      this.weekDates = weekDates
    }
  },
  computed: {
    today() {
      const today = new Date()
      return this.getFormatDay(today)
    },
    toDate() {
      const today = new Date()
      return this.getFormateDate(today)
    },
    userInfo() {
      return this.$store.state.user.user
    }
  }
}
</script>

<style lang="scss" scoped></style>
