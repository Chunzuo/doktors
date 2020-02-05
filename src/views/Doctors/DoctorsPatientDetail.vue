<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <h2 class="breadcrumb-title" v-if="patientInfo">
              {{ patientInfo.name }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid" v-if="patientInfo">
        <div class="row">
          <div
            class="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar dct-dashbd-lft"
          >
            <!-- Profile Widget -->
            <div class="card widget-profile pat-widget-profile">
              <div class="card-body">
                <div class="pro-widget-content">
                  <div class="profile-info-widget">
                    <a href="#" class="booking-doc-img">
                      <img
                        src="@/assets/img/patients/patient-default.png"
                        alt="User Image"
                      />
                    </a>
                    <div class="profile-det-info">
                      <h3>{{ patientInfo.name }}</h3>

                      <div class="patient-details">
                        <h5>
                          <b>Last Visit :</b>
                          {{ convertTimestampToString(patientInfo.accessTime) }}
                        </h5>
                        <div class="row" v-if="isDoctor">
                          <div class="col" v-if="!editable">
                            <button
                              class="btn bg-success-light"
                              @click="editable = true"
                            >
                              <i class="far fa-edit"></i>
                              Edit
                            </button>
                          </div>
                          <div class="col" v-if="editable">
                            <button
                              class="btn bg-info-light"
                              @click="saveHistory"
                            >
                              <i class="far fa-save"></i>
                              Save
                            </button>
                          </div>
                          <div
                            class="col"
                            v-if="editable"
                            @click="editable = false"
                          >
                            <button class="btn bg-danger-light">
                              <i class="far"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                        <!-- <h5 class="mb-0"><i class="fas fa-map-marker-alt"></i> Newyork, United States</h5> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="patient-info" v-if="patientInfo.history">
                  <ul>
                    <li
                      v-for="(history, index) in historyElements"
                      :key="`history-${index}`"
                    >
                      {{ history.title }}
                      <div v-if="editable">
                        <input
                          v-model="patientInfo.history[history.id]"
                          class="w-full mb-4 form-control"
                          type="text"
                          v-if="history.type == 'text'"
                        />
                        <input
                          v-model="patientInfo.history[history.id]"
                          class="w-full mb-4 form-control"
                          type="number"
                          v-if="history.type == 'number'"
                        />
                        <datepicker
                          class="w-full mb-4 md:mb-0 datepicker"
                          v-model="patientInfo.history[history.id]"
                          v-if="history.type == 'date'"
                        ></datepicker>
                        <div v-if="history.type == 'radio'">
                          <div
                            class="form-check"
                            v-for="(value, index) in history.values"
                            :key="`value - ${index}`"
                          >
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadios"
                              :id="`radio${index}`"
                              :value="value"
                              v-model="patientInfo.history[history.id]"
                            />
                            <label
                              class="form-check-label"
                              :for="`radio${index}`"
                              >{{ value }}</label
                            >
                          </div>
                        </div>
                      </div>
                      <span v-else>
                        <span v-if="history.type == 'date'">{{
                          convertTimestampToString(
                            patientInfo.history[history.id]
                          )
                        }}</span>
                        <span v-else>{{
                          patientInfo.history[history.id]
                        }}</span>
                      </span>
                    </li>
                    <!-- <li>
                      Phone
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.patientMobile"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.patientMobile}}</span>
                    </li>
                    <li>
                      Age of Menarche
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.age_of_menarche"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.age_of_menarche}}</span>
                    </li>
                    <li>
                      Allergies
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.allergies"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.allergies}}</span>
                    </li>
                    <li>
                      Appetite
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.appetite"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.appetite}}</span>
                    </li>
                    <li>
                      Current Medicines Taking
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.current_medicines_taking"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.current_medicines_taking}}</span>
                    </li>
                    <li>
                      Cycle Flow&Pain
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.cycle_flow_and_pain"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.cycle_flow_and_pain}}</span>
                    </li>
                    <li>
                      Duration of Cycle
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.duration_of_cycle"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.duration_of_cycle}}</span>
                    </li>
                    <li>
                      Education
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.education"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.education}}</span>
                    </li>
                    <li>
                      Last Menstrual Period
                      <datepicker
                        class="w-full mb-4 md:mb-0 datepicker"
                        v-model="patientInfo.history.last_menstrual_period"
                        v-if="editable"
                      ></datepicker>
                      <span
                        v-else
                      >{{convertTimestampToString(patientInfo.history.last_menstrual_period)}}</span>
                    </li>
                    <li>
                      Other Relative Diease History
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.other_relative_disease_history"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.other_relative_disease_history}}</span>
                    </li>
                    <li>
                      Past Medicines Used
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.past_medicines_used"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.past_medicines_used}}</span>
                    </li>
                    <li>
                      Regularity Of Cycle
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.regularity_of_cycle"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.regularity_of_cycle}}</span>
                    </li>
                    <li>
                      Sleep Duration
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.sleep_duration"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.sleep_duration}}</span>
                    </li>
                    <li>
                      Smoking or Other Addiction
                      <input
                        class="form-control"
                        type="text"
                        v-model="patientInfo.history.smoking_or_other_addiction"
                        v-if="editable"
                      />
                      <span v-else>{{patientInfo.history.smoking_or_other_addiction}}</span>
                    </li>-->
                  </ul>
                </div>
              </div>
            </div>
            <!-- /Profile Widget -->
          </div>

          <div class="col-md-7 col-lg-8 col-xl-9 dct-appoinment">
            <div class="card">
              <div class="card-body pt-0">
                <div class="tab-content">
                  <div>
                    <div class="text-right" v-if="isDoctor">
                      <a
                        href="javascript:;"
                        class="add-new-btn"
                        @click="showAddModal = true"
                        >Add Visit</a
                      >
                    </div>
                    <div class="card card-table mb-0">
                      <div class="card-body">
                        <vs-collapse type="border">
                          <vs-collapse-item
                            v-for="(data, index) in patientInfo.visits"
                            :key="index"
                          >
                            <div slot="header">
                              {{ convertTimestampToString(data.time) }}
                            </div>
                            <h5>Diagnosis</h5>
                            <textarea
                              v-if="editable"
                              class="form-control"
                              rows="5"
                              v-model="data.diagnosis"
                            ></textarea>
                            <span v-else>{{ data.diagnosis }}</span>

                            <h5>Symptems</h5>
                            <textarea
                              v-if="editable"
                              class="form-control"
                              rows="5"
                              v-model="data.symptems"
                            ></textarea>
                            <span v-else>{{ data.symptems }}</span>

                            <h5>Treatment</h5>
                            <textarea
                              v-if="editable"
                              class="form-control"
                              rows="5"
                              v-model="data.treatment"
                            ></textarea>
                            <span v-else>{{ data.treatment }}</span>

                            <h5>Files</h5>
                            <div class="row">
                              <div
                                class="col-4"
                                v-for="(file, index) in data.files"
                                :key="`file - ${index}`"
                              >
                                <img
                                  :src="getFileUrl(file)"
                                  alt="visit file"
                                  style="max-width: 200px; cursor: pointer;"
                                  @click="downloadFile(file)"
                                />
                              </div>
                            </div>
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
        @close="showAddModal = false"
        :active.sync="showAddModal"
        title="Add visit"
      >
        <div class="modal-body">
          <div class="form-group">
            <label>Diagnosis</label>
            <textarea
              class="form-control"
              v-model="visitInfo.diagnosis"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Symptems</label>
            <textarea
              class="form-control"
              v-model="visitInfo.symptems"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Treatment</label>
            <textarea
              class="form-control"
              v-model="visitInfo.treatment"
            ></textarea>
          </div>
          <div class="form-group">
            <div class="upload-img">
              <div
                class="change-photo-btn vs-con-loading__container"
                id="button-with-loading"
              >
                <span> <i class="fa fa-upload"></i> Upload File </span>
                <input type="file" class="upload" @change="uploadFile" />
              </div>
            </div>
          </div>
        </div>
      </vs-prompt>
    </div>
  </div>
</template>

<script>
import { db, storage } from "@/firebase";
import firebase from "firebase";
import Datepicker from "vuejs-datepicker";

export default {
  data() {
    return {
      patientInfo: null,
      showAddModal: false,
      visitInfo: { files: [] },
      editable: false,
      doctor: null,
      taskUploadFile: null
    };
  },
  mounted() {
    this.loadPatientInfo();
    this.getDoctorInfo();
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
      try {
        const tDate = timestamp.toDate();
        return (
          tDate.getDate() +
          "/" +
          (tDate.getMonth() + 1) +
          "/" +
          tDate.getFullYear()
        );
      } catch {
        return "";
      }
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
    },
    async saveHistory() {
      const pId = this.$route.params.id;
      this.$vs.loading();
      await db
        .collection("History")
        .doc(pId)
        .update(this.patientInfo);
      this.editable = false;
      this.$vs.loading.close();
    },
    async getDoctorInfo() {
      if (!this.userInfo.id) {
        return;
      }
      this.$vs.loading();
      let doctorInfo = null;
      if (this.userInfo.role == "doctor") {
        doctorInfo = await db
          .collection("Doctors")
          .doc(this.userInfo.id)
          .get();
      } else if (this.userInfo.role == "assistant") {
        doctorInfo = await db
          .collection("Doctors")
          .doc(this.userInfo.doctorId)
          .get();
      }

      this.doctor = doctorInfo.data();
      this.$vs.loading.close();
    },
    uploadFile(e) {
      const fileList = e.target.files || e.dataTransfer.files;
      const file = fileList[0];
      const today = new Date();
      const fileName =
        file.name +
        "-" +
        today.getHours() +
        today.getMinutes() +
        today.getSeconds();
      this.$vs.loading();
      this.taskUploadFile = storage.ref(`images/${fileName}`).put(file);
    },
    getFileUrl(url) {
      if (url.includes(".pdf")) {
        const images = require.context("../../assets/img", false, /\.png$/);
        return images("./pdf.png");
      }
      return url;
    },
    downloadFile(url) {
      window.open(url);
    }
  },
  components: {
    Datepicker
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
    historyElements() {
      if (this.doctor == null) {
        return [];
      }
      return this.doctor.historyElements.filter(element => {
        if (element.active) {
          return element;
        }
      });
    },
    isDoctor() {
      return this.userInfo.role == "doctor";
    }
  },
  watch: {
    userInfo() {
      this.getDoctorInfo();
    },
    taskUploadFile: function() {
      this.taskUploadFile.on(
        "state_changed",
        () => {},
        null,
        () => {
          this.taskUploadFile.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.visitInfo.files.push(downloadURL);
              this.$vs.loading.close();
            });
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
