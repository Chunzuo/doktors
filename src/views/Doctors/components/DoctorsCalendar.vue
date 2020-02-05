<template>
  <div class="content">
    <div class="row">
      <!-- Calendar Events -->

      <!-- /Calendar Events -->

      <!-- Calendar -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <full-calendar
              :config="config"
              :events="events"
              @day-click="onClickDay"
            />
          </div>
        </div>
      </div>
      <!-- /Calendar -->
    </div>

    <vs-prompt
      @cancel="showModal = false"
      @accept="saveTimeSlot"
      @close="closeModal"
      :active.sync="showModal"
      title="Add Time Slots"
    >
      <div class="modal-body">
        <form>
          <div class="hours-info">
            <div
              class="row form-row hours-cont"
              v-for="(slot, index) in timeSlots"
              :key="`slot-${index}`"
            >
              <div class="col-12 col-md-10">
                <div class="row form-row">
                  <div class="col-12 col-md-8 col-lg-10">
                    <div class="form-group">
                      <label>Time</label>
                      <flat-pickr
                        class="form-control"
                        :config="configdateTimePicker"
                        placeholder="Choose time"
                        v-model="slot.time"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-md-4 col-lg-2">
                    <label
                      class="d-md-block d-sm-none d-none"
                      v-html="'&nbsp;'"
                    ></label>
                    <a
                      href="javascript:void(0);"
                      class="btn btn-danger trash"
                      @click="removeSlot(index)"
                    >
                      <i class="far fa-trash-alt"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="add-more mb-3">
            <a href="javascript:void(0);" class="add-hours" @click="addSlot">
              <i class="fa fa-plus-circle"></i> Add More
            </a>
          </div>
        </form>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import moment from "moment";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { db } from "@/firebase";

export default {
  data() {
    return {
      events: [],
      config: {
        defaultView: "month"
      },
      showModal: false,
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      timeSlots: [],
      slotDate: null,
      doctorSlot: null
    };
  },
  methods: {
    onClickDay(moment) {
      this.slotDate = moment.toDate();

      const date = moment.toDate();
      const strDate =
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      this.doctorSlot.forEach(slot => {
        if (this.convertTimestampToString(slot.date) == strDate) {
          this.timeSlots = slot.slots;
        }
      });

      this.showModal = true;
    },
    async saveTimeSlot() {
      this.$vs.loading();

      const strDate =
        this.slotDate.getMonth() +
        1 +
        "/" +
        this.slotDate.getDate() +
        "/" +
        this.slotDate.getFullYear();

      var existingSlot = false;
      this.doctorSlot.map(slot => {
        if (this.convertTimestampToString(slot.date) == strDate) {
          slot.slots = this.timeSlots;
          existingSlot = true;
        }
      });
      if (!existingSlot) {
        this.doctorSlot.push({
          date: this.slotDate,
          slots: this.timeSlots
        });
      }
      await db
        .collection("Doctors")
        .doc(this.userInfo.id)
        .update({
          timeSlots: this.doctorSlot
        });
      this.$vs.loading.close();
      this.loadSlots();
    },
    addSlot() {
      this.timeSlots.push({});
    },
    removeSlot(index) {
      let newSlots = [];
      for (var i = 0; i < this.timeSlots.length; i++) {
        if (i != index) {
          newSlots.push(this.timeSlots[i]);
        }
      }
      this.timeSlots = newSlots;
    },
    closeModal() {
      this.showModal = false;
      this.timeSlots = [];
    },
    async loadSlots() {
      this.$vs.loading();
      const ref = await db
        .collection("Doctors")
        .doc(this.userInfo.id)
        .get();
      const { timeSlots } = ref.data();
      this.doctorSlot = timeSlots ? timeSlots : [];
      this.events = [];
      timeSlots.forEach(item => {
        const date = this.convertTimestampToString(item.date);

        item.slots.forEach(slot => {
          const date1 = new Date(date + " " + slot.time);

          this.events.push({
            start: moment(date1)
          });
        });
      });

      this.$vs.loading.close();
    },
    convertTimestampToString(accessTime) {
      if (accessTime == null) {
        return "";
      }
      var timestamp = accessTime.value ? accessTime.value : accessTime;
      try {
        const tDate = timestamp.toDate();
        return (
          tDate.getMonth() +
          1 +
          "/" +
          tDate.getDate() +
          "/" +
          tDate.getFullYear()
        );
      } catch {
        return "";
      }
    }
  },
  created() {
    this.$store.commit("updateDoctorSidebarItem", "Calendar");
  },
  components: {
    flatPickr
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    }
  },
  mounted() {
    this.loadSlots();
  }
};
</script>

<style lang="scss">
// @import "@/assets/scss/simple-calendar.scss";
</style>
