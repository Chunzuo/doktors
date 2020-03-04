<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Schedule Timings</h4>
            <div class="card card-table mb-0">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Opening Hours</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(day, idx) in days" :key="idx">
                        <td>{{ day.text }}</td>
                        <td>
                          {{ formatOpeningHours(openingHours[day.value]) }}
                        </td>
                        <td>
                          <a
                            href="javascript:void(0);"
                            class="btn btn-sm bg-success-light"
                            @click="openEditModal(idx)"
                          >
                            <i class="far fa-edit"></i> Edit
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="card-actions mt-3">
              <button
                type="submit"
                class="btn btn-primary submit-btn"
                @click="save"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vs-prompt
      @cancel="showEditModal = false"
      @accept="updateHours"
      @close="showEditModal = false"
      :active.sync="showEditModal"
      title="Edit Opening Hours"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-12 col-md-6">
            <label>Start Time</label>
            <flat-pickr
              class="form-control"
              :config="configdateTimePicker"
              placeholder="Choose time"
              v-model="startTime"
            />
          </div>
          <div class="col-12 col-md-6">
            <label>End Time</label>
            <flat-pickr
              class="form-control"
              :config="configdateTimePicker"
              placeholder="Choose time"
              v-model="endTime"
            />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col">
            <label class="custom_check">
              <input
                type="checkbox"
                name="select_specialist"
                v-model="closed"
              />
              <span class="checkmark"></span>
              Closed
            </label>
          </div>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import { db } from '@/firebase'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  created() {
    this.$store.commit('updateDoctorSidebarItem', 'Schedule Timings')
  },
  components: {
    flatPickr
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user
    }
  },
  watch: {
    userInfo() {
      this.getDoctorProfile()
    }
  },
  data() {
    return {
      openingHours: {},
      days: [
        { text: 'Monday', value: 'mon' },
        { text: 'Tuesday', value: 'tue' },
        { text: 'Wendsday', value: 'wed' },
        { text: 'Thursday', value: 'thu' },
        { text: 'Friday', value: 'fri' },
        { text: 'Satureday', value: 'sat' },
        { text: 'Sunday', value: 'sun' }
      ],
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      showEditModal: false,
      startTime: null,
      endTime: null,
      index: 0,
      closed: false
    }
  },
  mounted() {
    this.getDoctorProfile()
  },
  methods: {
    async getDoctorProfile() {
      if (!this.userInfo.id) {
        return
      }
      this.$vs.loading()

      const profile = await db
        .collection('DoctorProfiles')
        .doc(this.userInfo.id)
        .get()

      const profileData = profile.data()
      this.openingHours = profileData.openingHours
      console.log(this.openingHours)

      this.$vs.loading.close()
    },
    formatOpeningHours(data) {
      if (!data || data['closed']) {
        return 'Not available'
      }
      return data['from'] + ' ~ ' + data['until']
    },
    openEditModal(idx) {
      this.startTime = this.openingHours[this.days[idx]['value']]['from']
      this.endTime = this.openingHours[this.days[idx]['value']]['until']
      this.closed = this.openingHours[this.days[idx]['value']]['closed']
      this.showEditModal = true
      this.index = idx
    },
    updateHours() {
      this.openingHours[this.days[this.index]['value']]['from'] = this.closed
        ? null
        : this.startTime
      this.openingHours[this.days[this.index]['value']]['until'] = this.closed
        ? null
        : this.endTime
      this.openingHours[this.days[this.index]['value']]['closed'] = this.closed
    },
    async save() {
      this.$vs.loading()
      await db
        .collection('DoctorProfiles')
        .doc(this.userInfo.id)
        .update({
          openingHours: this.openingHours
        })
      this.$vs.loading.close()
      this.$vs.notify({
        text: 'Success in update shedule timings',
        color: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
