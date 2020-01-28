<template>
  <div id="simple-calendar-app">
    <div class="card no-scroll-content">
      <div class="card-body">
        <calendar-view
          ref="calendar"
          :displayPeriodUom="calendarView"
          :show-date="showDate"
          :events="events"
          enableDragDrop
          :eventTop="windowWidth <= 400 ? '2rem' : '3rem'"
          eventBorderHeight="0px"
          eventContentHeight="1.65rem"
          class="theme-default"
          @click-date="openAddNewEvent"
          @click-event="openEditEvent"
          @drop-on-date="eventDragged"
        >
          <div slot="header" class="mb-4">
            <div class="row no-gutter">
              <!-- Month Name -->
              <div class="col w-1/3 items-center sm:flex hidden">
                <!-- Add new event button -->
                <vs-button
                  icon-pack="feather"
                  icon="icon-plus"
                  @click="promptAddNewEvent(new Date())"
                >Add</vs-button>
              </div>

              <!-- Current Month -->
              <div
                class="col sm:w-1/3 w-full sm:my-0 my-3 flex sm:justify-end justify-center order-last"
              >
                <div class="flex items-center">
                  <!-- <feather-icon
                  :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
                  @click="updateMonth(-1)"
                  svgClasses="w-5 h-5 m-1"
                  class="cursor-pointer bg-primary text-white rounded-full"
                  />-->

                  <i class="fas fa-chevron-left" @click="updateMonth(-1)" style="cursor: pointer;"></i>

                  <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate | month }}</span>

                  <i class="fas fa-chevron-right" @click="updateMonth(1)" style="cursor: pointer;"></i>

                  <!-- <feather-icon
                  :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                  @click="updateMonth(1)"
                  svgClasses="w-5 h-5 m-1"
                  class="cursor-pointer bg-primary text-white rounded-full"
                  />-->
                </div>
              </div>

              <div class="col sm:w-1/3 w-full flex justify-center">
                <template v-for="(view, index) in calendarViewTypes">
                  <vs-button
                    v-if="calendarView === view.val"
                    :key="String(view.val) + 'filled'"
                    type="filled"
                    class="p-3 md:px-8 md:py-3"
                    :class="{'border-l-0 rounded-l-none': index, 'rounded-r-none': calendarViewTypes.length !== index+1}"
                    @click="calendarView = view.val"
                  >{{ view.label }}</vs-button>
                  <vs-button
                    v-else
                    :key="String(view.val) + 'border'"
                    type="border"
                    class="p-3 md:px-8 md:py-3"
                    :class="{'border-l-0 rounded-l-none': index, 'rounded-r-none': calendarViewTypes.length !== index+1}"
                    @click="calendarView = view.val"
                  >{{ view.label }}</vs-button>
                </template>
              </div>
            </div>

            <div class="row sm:flex hidden mt-4">
              <div class="col w-full flex">
                <!-- Labels -->
                <div class="flex flex-wrap sm:justify-start justify-center">
                  <div
                    v-for="(label, index) in calendarLabels"
                    :key="index"
                    class="flex items-center mr-4 mb-2"
                  >
                    <div
                      class="h-3 w-3 inline-block rounded-full mr-2"
                      :class="'bg-' + label.color"
                    ></div>
                    <span>{{ label.text }}</span>
                  </div>
                  <div class="flex items-center mr-4 mb-2">
                    <div class="h-3 w-3 inline-block rounded-full mr-2 bg-primary"></div>
                    <span>None</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </calendar-view>
      </div>
    </div>

    <!-- ADD EVENT -->
    <vs-prompt
      class="calendar-event-dialog"
      title="Add Event"
      accept-text="Add Event"
      @accept="addEvent"
      :active.sync="activePromptAddEvent"
    >
      <label for>Event Title</label>
      <input name="event-name" class="w-full form-control" v-model="title" />
      <div class="my-4">
        <label>Start Date</label>
        <datepicker
          :language="$vs.rtl ? langHe : langEn"
          name="start-date"
          class="startDatePicker"
          v-model="startDate"
          :disabled="disabledFrom"
        ></datepicker>
      </div>
      <div class="my-4">
        <small class="date-label">End Date</small>
        <datepicker
          :language="$vs.rtl ? langHe : langEn"
          :disabledDates="disabledDatesTo"
          name="end-date"
          class="endDatePicker"
          v-model="endDate"
        ></datepicker>
      </div>
      <label for>Event URL</label>
      <input name="event-url" class="w-full form-control mt-6" v-model="url" />
    </vs-prompt>

    <!-- EDIT EVENT -->
    <vs-prompt
      class="calendar-event-dialog"
      title="Edit Event"
      accept-text="Submit"
      cancel-text="Remove"
      button-cancel="border"
      @cancel="removeEvent"
      @accept="editEvent"
      :is-valid="validForm"
      :active.sync="activePromptEditEvent"
    >
      <div class="calendar__label-container flex">
        <vs-chip
          v-if="labelLocal != 'none'"
          class="text-white"
          :class="'bg-' + labelColor(labelLocal)"
        >{{ labelLocal }}</vs-chip>

        <vs-dropdown vs-custom-content class="ml-auto my-2 cursor-pointer">
          <!-- <feather-icon icon="TagIcon" svgClasses="h-5 w-5" @click.prevent></feather-icon> -->

          <vs-dropdown-menu style="z-index: 200001">
            <vs-dropdown-item
              v-for="(label, index) in calendarLabels"
              :key="index"
              @click="labelLocal = label.value"
            >
              <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
              <span>{{ label.text }}</span>
            </vs-dropdown-item>

            <vs-dropdown-item @click="labelLocal = 'none'">
              <div class="h-3 w-3 mr-1 inline-block rounded-full mr-2 bg-primary"></div>
              <span>None</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <vs-input name="event-name" class="w-full" label-placeholder="Event Title" v-model="title"></vs-input>
      <div class="my-4">
        <small class="date-label">Start Date</small>
        <datepicker
          :language="$vs.rtl ? langHe : langEn"
          :disabledDates="disabledDatesFrom"
          name="start-date"
          v-model="startDate"
        ></datepicker>
      </div>
      <div class="my-4">
        <small class="date-label">End Date</small>
        <datepicker
          :language="$vs.rtl ? langHe : langEn"
          :disabledDates="disabledDatesTo"
          name="end-date"
          v-model="endDate"
        ></datepicker>
      </div>
      <vs-input name="event-url" class="w-full mt-6" label-placeholder="Event URL" v-model="url"></vs-input>
    </vs-prompt>
  </div>
</template>

<script>
import { CalendarView } from "vue-simple-calendar";
import moduleCalendar from "@/store/modules/calendar/moduleCalendar.js";
require("vue-simple-calendar/static/css/default.css");

import Datepicker from "vuejs-datepicker";
import { en, he } from "vuejs-datepicker/src/locale";
import jQuery from "jquery";

export default {
  components: {
    CalendarView,
    // CalendarViewHeader,
    Datepicker
  },
  data() {
    return {
      showDate: new Date(),
      disabledFrom: false,
      id: 0,
      title: "",
      startDate: "",
      endDate: "",
      labelLocal: "none",

      langHe: he,
      langEn: en,

      url: "",
      calendarView: "month",

      activePromptAddEvent: false,
      activePromptEditEvent: false,

      calendarViewTypes: [
        {
          label: "Month",
          val: "month"
        },
        {
          label: "Week",
          val: "week"
        },
        {
          label: "Year",
          val: "year"
        }
      ],
      events: [
        {
          id: 1,
          title: "My Event",
          startDate: new Date(new Date() - 1000 * 60 * 60 * 24 * 3),
          endDate: new Date(new Date() - 1000 * 60 * 60 * 24 * 2),
          url: "",
          classes: "event-success",
          label: "business"
        }
      ]
    };
  },
  computed: {
    simpleCalendarEvents() {
      return this.$store.state.calendar.events;
    },
    validForm() {
      return (
        this.title != "" &&
        this.startDate != "" &&
        this.endDate != "" &&
        Date.parse(this.endDate) - Date.parse(this.startDate) >= 0
      );
    },
    disabledDatesTo() {
      return { to: new Date(this.startDate) };
    },
    disabledDatesFrom() {
      return { from: new Date(this.endDate) };
    },
    calendarLabels() {
      // return this.$store.state.calendar.eventLabels;
      return [
        { text: "Business", value: "business", color: "success" },
        { text: "Work", value: "work", color: "warning" },
        { text: "Personal", value: "personal", color: "danger" }
      ];
    },
    labelColor() {
      return label => {
        if (label == "business") return "success";
        else if (label == "work") return "warning";
        if (label == "personal") return "danger";
        if (label == "none") return "primary";
      };
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    }
  },
  methods: {
    addEvent() {
      const obj = {
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        label: "business",
        url: this.url
      };
      obj.classes = "event-" + this.labelColor(this.labelLocal);
      // this.$store.dispatch("calendar/addEvent", obj);
      this.events.push(obj);
    },
    updateMonth(val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val);
    },
    clearFields() {
      this.title = this.endDate = this.url = "";
      this.id = 0;
      this.labelLocal = "none";
    },
    promptAddNewEvent(date) {
      this.disabledFrom = false;
      this.addNewEventDialog(date);
    },
    addNewEventDialog(date) {
      this.clearFields();
      this.startDate = date;
      this.endDate = date;
      this.activePromptAddEvent = true;
      setTimeout(() => {
        jQuery(".startDatePicker input").addClass("form-control");
        jQuery(".endDatePicker input").addClass("form-control");
      }, 100);
    },
    openAddNewEvent(date) {
      this.disabledFrom = true;
      this.addNewEventDialog(date);
    },
    openEditEvent(event) {
      const e = this.$store.getters["calendar/getEvent"](event.id);
      this.id = e.id;
      this.title = e.title;
      this.startDate = e.startDate;
      this.endDate = e.endDate;
      this.url = e.url;
      this.labelLocal = e.label;
      this.activePromptEditEvent = true;
    },
    editEvent() {
      const obj = {
        id: this.id,
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        label: this.labelLocal,
        url: this.url
      };
      obj.classes = "event-" + this.labelColor(this.labelLocal);
      this.$store.dispatch("calendar/editEvent", obj);
    },
    removeEvent() {
      this.$store.dispatch("calendar/removeEvent", this.id);
    },
    eventDragged(event, date) {
      this.$store.dispatch("calendar/eventDragged", {
        event: event,
        date: date
      });
    }
  },
  created() {
    this.$store.registerModule("calendar", moduleCalendar);
    this.$store.commit("updateDoctorSidebarItem", "Calendar");
    // this.$store.dispatch("calendar/fetchEvents");
    // this.$store.dispatch("calendar/fetchEventLabels");
  },
  beforeDestroy() {
    this.$store.unregisterModule("calendar");
  },
  mounted() {
    jQuery(".startDatePicker")
      .find("input")
      .addClass("form-control");
    jQuery(".endDatePicker > div > input").addClass("form-control");
  }
};
</script>

<style lang="scss">
// @import "@/assets/scss/simple-calendar.scss";
</style>
