<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <nav aria-label="breadcrumb" class="page-breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/">Home</router-link>
                </li>

                <li class="breadcrumb-item">
                  <router-link to="/doctors-mypatients">My Patients</router-link>
                </li>

                <li
                  class="breadcrumb-item active"
                  aria-current="page"
                  v-if="patientInfo"
                >{{patientInfo.name}}</li>
              </ol>
            </nav>
            <h2 class="breadcrumb-title" v-if="patientInfo">{{patientInfo.name}}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid" v-if="patientInfo">
        <div class="row">
          <div class="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar dct-dashbd-lft">
            <!-- Profile Widget -->
            <div class="card widget-profile pat-widget-profile">
              <div class="card-body">
                <div class="pro-widget-content">
                  <div class="profile-info-widget">
                    <a href="#" class="booking-doc-img">
                      <img src="@/assets/img/patients/patient-default.png" alt="User Image" />
                    </a>
                    <div class="profile-det-info">
                      <h3>{{patientInfo.name}}</h3>

                      <div class="patient-details">
                        <h5>
                          <b>Last Visit :</b>
                          {{convertTimestampToString(patientInfo.accessTime)}}
                        </h5>
                        <!-- <h5 class="mb-0"><i class="fas fa-map-marker-alt"></i> Newyork, United States</h5> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="patient-info" v-if="patientInfo.history">
                  <ul>
                    <li>
                      Phone
                      <span>{{patientInfo.patientMobile}}</span>
                    </li>
                    <li>
                      Age of Menarche
                      <span>{{patientInfo.history.age_of_menarche}}</span>
                    </li>
                    <li>
                      Allergies
                      <span>{{patientInfo.history.allergies}}</span>
                    </li>
                    <li>
                      Appetite
                      <span>{{patientInfo.history.appetite}}</span>
                    </li>
                    <li>
                      Current Medicines Taking
                      <span>{{patientInfo.history.current_medicines_taking}}</span>
                    </li>
                    <li>
                      Cycle Flow&Pain
                      <span>{{patientInfo.history.cycle_flow_and_pain}}</span>
                    </li>
                    <li>
                      Duration of Cycle
                      <span>{{patientInfo.history.duration_of_cycle}}</span>
                    </li>
                    <li>
                      Education
                      <span>{{patientInfo.history.education}}</span>
                    </li>
                    <li>
                      Last Menstrual Period
                      <span>{{convertTimestampToString(patientInfo.history.last_menstrual_period)}}</span>
                    </li>
                    <li>
                      Other Relative Diease History
                      <span>{{patientInfo.history.other_relative_disease_history}}</span>
                    </li>
                    <li>
                      Past Medicines Used
                      <span>{{patientInfo.history.past_medicines_used}}</span>
                    </li>
                    <li>
                      Regularity Of Cycle
                      <span>{{patientInfo.history.regularity_of_cycle}}</span>
                    </li>
                    <li>
                      Sleep Duration
                      <span>{{patientInfo.history.sleep_duration}}</span>
                    </li>
                    <li>
                      Smoking or Other Addiction
                      <span>{{patientInfo.history.smoking_or_other_addiction}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- /Profile Widget -->

            <!-- Last Booking -->
            <!-- <div class="card">
              <div class="card-header">
                <h4 class="card-title">Last Booking</h4>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <div class="media align-items-center">
                    <div class="mr-3">
                      <img alt="Image placeholder" src="assets/img/doctors/doctor-thumb-02.jpg" class="avatar  rounded-circle">
                    </div>
                    <div class="media-body">
                      <h5 class="d-block mb-0">Dr. Darren Elder </h5>
                      <span class="d-block text-sm text-muted">Dentist</span>
                      <span class="d-block text-sm text-muted">14 Nov 2019 5.00 PM</span>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="media align-items-center">
                    <div class="mr-3">
                      <img alt="Image placeholder" src="assets/img/doctors/doctor-thumb-02.jpg" class="avatar  rounded-circle">
                    </div>
                    <div class="media-body">
                      <h5 class="d-block mb-0">Dr. Darren Elder </h5>
                      <span class="d-block text-sm text-muted">Dentist</span>
                      <span class="d-block text-sm text-muted">12 Nov 2019 11.00 AM</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>-->
            <!-- /Last Booking -->
          </div>

          <div class="col-md-7 col-lg-8 col-xl-9 dct-appoinment">
            <div class="card">
              <div class="card-body pt-0">
                <div class="tab-content">
                  <div>
                    <div class="text-right">
                      <a
                        href="javascript:;"
                        class="add-new-btn"
                        @click="showAddModal = true"
                      >Add Visit</a>
                    </div>
                    <div class="card card-table mb-0">
                      <div class="card-body">
                        <!-- <div class="table-responsive">
                          <table class="table table-hover table-center table-wrap mb-0">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Diagnosis</th>
                                <th>Symptems</th>
                                <th>Treatment</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(visit, idx) in patientInfo.visits" :key="idx">
                                <td>{{convertTimestampToString(visit.time)}}</td>
                                <td>{{visit.diagnosis}}</td>
                                <td>{{visit.symptems}}</td>
                                <td>{{visit.treatment}}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>-->

                        <vs-collapse type="border">
                          <vs-collapse-item
                            v-for="(data, index) in patientInfo.visits"
                            :key="index"
                          >
                            <div slot="header">{{convertTimestampToString(data.time)}}</div>
                            <h5>Diagnosis</h5>
                            {{data.diagnosis}}
                            <h5>Symptems</h5>
                            {{data.symptems}}
                            <h5>Treatment</h5>
                            {{data.treatment}}
                          </vs-collapse-item>
                        </vs-collapse>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <vs-prompt
        @cancel="showAddModal = false"
        @accept="saveVisit"
        @close="showAddModal=false"
        :active.sync="showAddModal"
        title="Add visit"
      >
        <div class="modal-body">
          <div class="form-group">
            <label>Diagnosis</label>
            <textarea class="form-control" v-model="visitInfo.diagnosis"></textarea>
          </div>
          <div class="form-group">
            <label>Symptems</label>
            <textarea class="form-control" v-model="visitInfo.symptems"></textarea>
          </div>
          <div class="form-group">
            <label>Treatment</label>
            <textarea class="form-control" v-model="visitInfo.treatment"></textarea>
          </div>
        </div>
      </vs-prompt>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import firebase from "firebase";
export default {
  data() {
    return {
      patientInfo: null,
      showAddModal: false,
      visitInfo: {}
    };
  },
  mounted() {
    this.loadPatientInfo();
  },
  methods: {
    async loadPatientInfo() {
      this.$vs.loading();

      const patientInfo = await db
        .collection("History")
        .doc(this.$route.params.id)
        .get();

      this.patientInfo = patientInfo.data();
      this.$vs.loading.close();
    },
    convertTimestampToString(accessTime) {
      if (accessTime == null) {
        return "";
      }
      var timestamp = accessTime.value ? accessTime.value : accessTime;
      return (
        timestamp.toDate().getDate() +
        "/" +
        (timestamp.toDate().getMonth() + 1) +
        "/" +
        timestamp.toDate().getFullYear()
      );
    },
    async saveVisit() {
      this.visitInfo["time"] = new Date();
      const pId = this.$route.params.id;
      this.$vs.loading();
      await db
        .collection("History")
        .doc(pId)
        .update({
          visits: firebase.firestore.FieldValue.arrayUnion(this.visitInfo),
          accessTime: firebase.firestore.FieldValue.serverTimestamp()
        });
      this.$vs.loading.close();
      this.loadPatientInfo();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>