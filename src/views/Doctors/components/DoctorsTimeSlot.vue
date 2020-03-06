<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Schedule Timings</h4>
            <div class="profile-box">
              <div class="row">
                <div class="col-md-12">
                  <div class="card schedule-widget mb-0">
                    <!-- Schedule Header -->
                    <div class="schedule-header">
                      <!-- Schedule Nav -->
                      <div class="schedule-nav">
                        <ul class="nav nav-tabs nav-justified">
                          <li
                            class="nav-item"
                            v-for="(item, index) in slotArray"
                            :key="index"
                          >
                            <a
                              class="nav-link"
                              data-toggle="tab"
                              :href="`#${item.slot}`"
                              >{{ item.text }}</a
                            >
                          </li>
                        </ul>
                      </div>
                      <!-- /Schedule Nav -->
                    </div>
                    <!-- /Schedule Header -->

                    <!-- Schedule Content -->
                    <div class="tab-content schedule-cont">
                      <!-- Sunday Slot -->
                      <div
                        v-for="(item, index) in slotArray"
                        :key="`slot-body-${index}`"
                        :id="`${item.slot}`"
                        class="tab-pane fade"
                      >
                        <h4 class="card-title d-flex justify-content-between">
                          <span>Time Slots</span>
                          <a
                            class="edit-link"
                            data-toggle="modal"
                            href="javascript:;"
                            @click="openAddSlotModal(item.value)"
                            v-if="checkAvailableSlot(item.value)"
                          >
                            <i class="fa fa-plus-circle"></i> Add Slot
                          </a>
                          <a
                            class="edit-link"
                            data-toggle="modal"
                            href="#edit_time_slot"
                            @click="openEditSlotModal(item.value)"
                            v-else
                          >
                            <i class="fa fa-edit mr-1"></i>Edit
                          </a>
                        </h4>
                        <p
                          class="text-muted mb-0"
                          v-if="checkAvailableSlot(item.value)"
                        >
                          Not Available
                        </p>
                        <div class="doc-times" v-else>
                          <div
                            class="doc-slot-list"
                            v-for="(slot, index) in getSlotByDay(item.value)"
                            :key="`time-slot-${index}`"
                          >
                            {{ getFormatSlot(slot) }}
                            <a
                              href="javascript:void(0)"
                              class="delete_schedule"
                              @click="removeTimeSlot(item.value, index)"
                            >
                              <i class="fa fa-times"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <!-- /Sunday Slot -->
                    </div>
                    <!-- /Schedule Content -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Timeslot dialog -->
    <vs-prompt
      @cancel="showModal = false"
      @accept="addTimeSlot"
      @close="showModal = false"
      :active.sync="showModal"
      :title="getModalTitle()"
    >
      <div class="modal-body">
        <div
          class="row mb-2"
          v-for="(slot, index) in newSlots"
          :key="`new-slot-${index}`"
        >
          <div class="col-12 col-md-5">
            <label>Start Time</label>
            <flat-pickr
              class="form-control"
              :config="configdateTimePicker"
              placeholder="Choose time"
              v-model="slot.startTime"
            />
          </div>
          <div class="col-12 col-md-5">
            <label>End Time</label>
            <flat-pickr
              class="form-control"
              :config="configdateTimePicker"
              placeholder="Choose time"
              v-model="slot.endTime"
            />
          </div>
          <div class="col-12 col-md-2">
            <label>&nbsp;</label>
            <a
              href="javascript:void(0);"
              class="btn btn-danger trash"
              @click="removeSlotLine(index)"
            >
              <i class="far fa-trash-alt"></i>
            </a>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col">
            <a
              href="javascript:void(0);"
              class="add-hours"
              @click="addNewSlotLine"
            >
              <i class="fa fa-plus-circle"></i> Add More
            </a>
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
    this.$store.commit('updateDoctorSidebarItem', 'Schedule Timeslot')
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
      showModal: false,
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      newSlots: [{ startTime: null, endTime: null }],
      timeSlots: null,
      day: '',
      slotArray: [
        { text: 'SUNDAY', value: 'sun', slot: 'slot_sunday' },
        { text: 'MONDAY', value: 'mon', slot: 'slot_monday' },
        { text: 'TUESDAY', value: 'tue', slot: 'slot_tuesday' },
        { text: 'WEDNESDAY', value: 'wed', slot: 'slot_wednesday' },
        { text: 'THURSDAY', value: 'thu', slot: 'slot_thursday' },
        { text: 'FRIDAY', value: 'fri', slot: 'slot_friday' },
        { text: 'SATURDAY', value: 'sat', slot: 'slot_saturday' }
      ],
      modalType: 0 // 0: create, 1: update
    }
  },
  mounted() {
    this.getDoctorProfile()
  },
  methods: {
    addTimeSlot() {
      this.timeSlots[this.day] = this.newSlots
      this.updateTimeSlot()
    },
    async updateTimeSlot() {
      this.$vs.loading()
      await db
        .collection('DoctorProfiles')
        .doc(this.userInfo.id)
        .update({
          timeSlots: this.timeSlots
        })
      this.$vs.loading.close()
      this.$vs.notify({
        text: 'Success in update time slots',
        color: 'success'
      })
    },
    addNewSlotLine() {
      this.newSlots.push({
        startTime: null,
        endTime: null
      })
    },
    removeSlotLine(index) {
      let updateSlots = []
      for (let i = 0; i < this.newSlots.length; i++) {
        if (i != index) {
          updateSlots.push(this.newSlots[i])
        }
      }
      this.newSlots = updateSlots
    },
    openAddSlotModal(day) {
      this.day = day
      this.showModal = true
      this.modalType = 0
    },
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

      if (profileData.timeSlots) {
        this.timeSlots = profileData.timeSlots
      } else {
        this.timeSlots = {
          mon: [],
          tue: [],
          wed: [],
          thu: [],
          fri: [],
          sat: [],
          sun: []
        }
      }

      this.$vs.loading.close()
    },
    getFormatSlot(slot) {
      const { startTime, endTime } = slot
      return startTime + ' - ' + endTime
    },
    checkAvailableSlot(day) {
      return this.timeSlots[day].length == 0 ? true : false
    },
    getSlotByDay(day) {
      return this.timeSlots[day]
    },
    removeTimeSlot(day, index) {
      let newSlots = []
      let oldSlots = this.timeSlots[day]
      for (var i = 0; i < oldSlots.length; i++) {
        if (i != index) {
          newSlots.push(oldSlots[i])
        }
      }
      this.timeSlots[day] = newSlots
      this.updateTimeSlot()
    },
    openEditSlotModal(day) {
      this.showModal = true
      this.day = day
      this.modalType = 1
      this.newSlots = this.timeSlots[day]
    },
    getModalTitle() {
      return this.modalType == 0 ? 'Add new time slot' : 'Edit time slot'
    }
  }
}
</script>

<style lang="scss" scoped></style>
