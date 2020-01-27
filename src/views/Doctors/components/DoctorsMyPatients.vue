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
        <div class="col">
          <!-- <button class="btn btn-info" >Add patient</button> -->
        </div>

        <div class="col text-right">
          <button class="btn btn-danger" @click="clearSearchKeyword">Clear</button>
        </div>
      </div>
    </div>

    <div class="row row-grid">
      <div class="col-md-6 col-lg-4 col-xl-3" v-for="(patient, idx) in filteredPatients" :key="idx">
        <div class="card widget-profile pat-widget-profile">
          <div class="card-body">
            <div class="pro-widget-content">
              <div class="profile-info-widget">
                <a href="patient-profile.html" class="booking-doc-img">
                  <img src="@/assets/img/patients/patient-default.png" alt="User Image" />
                </a>
                <div class="profile-det-info">
                  <h3>
                    <router-link :to="getPatientDetailLink(patient.id)">{{patient.name}}</router-link>
                    <!-- <a href="patient-profile.html">{{patient.name}}</a> -->
                  </h3>

                  <div class="patient-details">
                    <h5>
                      <b>Last visit :</b>
                      {{getLastVisit(patient.accessTime)}}
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
                  <span>{{patient.patientMobile}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <fab position="bottom-right" bg-color="#4C77B2" @click="$router.push('/doctors-addpatient')"></fab> -->
    <vs-button
      type="filled"
      icon="add"
      radius
      color="primary"
      style="right: 5vw;
    bottom: 4vh;
    z-index: 999;
    position: fixed;"
      @click="$router.push('/doctors-addpatient')"
    ></vs-button>
  </div>
</template>

<script>
import { db } from "@/firebase";
import Datepicker from "vuejs-datepicker";
import jQuery from "jquery";
// import fab from "vue-fab";
export default {
  created() {
    this.$store.commit("updateDoctorSidebarItem", "My Patients");
    this.$store.commit("updateSelectItem", "MyPatients");
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
    filteredPatients() {
      return this.patients.filter(patient => {
        const accessDate = patient.accessTime.toDate();

        if (this.startDate != null) {
          if (this.endDate != null) {
            if (accessDate >= this.startDate && accessDate <= this.endDate) {
              return patient;
            }
          } else {
            if (accessDate >= this.startDate) {
              return patient;
            }
          }
        }

        if (this.endDate != null && accessDate <= this.endDate) {
          return patient;
        }

        if (this.name != "" && patient.name.includes(this.name)) {
          return patient;
        }

        if (
          this.phoneNumber != "" &&
          patient.patientMobile.includes(this.phoneNumber)
        ) {
          return patient;
        }

        if (
          this.startDate == null &&
          this.endDate == null &&
          this.name == "" &&
          this.phoneNumber == ""
        ) {
          return patient;
        }
      });
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
      name: "",
      phoneNumber: ""
    };
  },
  watch: {
    userInfo() {
      this.loadPatients();
    }
  },
  mounted() {
    this.loadPatients();
    jQuery(".datepicker input").addClass("form-control");
  },
  methods: {
    async loadPatients() {
      if (!this.userInfo.phone) {
        return;
      }
      this.$vs.loading();
      let patientRef = db
        .collection("History")
        .where("doctorPhoneNumber", "==", this.userInfo.phone);
      const patients = await patientRef
        .orderBy("accessTime", "desc")
        .limit(10)
        .get();

      this.patients = [];
      patients.forEach(patient => {
        let data = patient.data();
        data["id"] = patient.id;
        this.patients.push(data);
      });
      this.$vs.loading.close();
    },
    getLastVisit(accessTime) {
      return (
        accessTime.toDate().getDate() +
        "/" +
        (accessTime.toDate().getMonth() + 1) +
        "/" +
        accessTime.toDate().getFullYear()
      );
    },
    getPatientDetailLink(patientId) {
      return `/doctors-patient-detail/${patientId}`;
    },
    clearSearchKeyword() {
      this.startDate = null;
      this.endDate = null;
      this.name = "";
      this.phoneNumber = "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>