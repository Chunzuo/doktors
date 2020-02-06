<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <h2 class="breadcrumb-title" v-if="patientInfo">{{ patientInfo.name }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid" v-if="patientInfo">
        <div class="row">
          <div class="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar dct-dashbd-lft">
            <div class="card widget-profile pat-widget-profile">
              <div class="card-body">
                <div class="pro-widget-content">
                  <div class="profile-info-widget">
                    <a href="#" class="booking-doc-img">
                      <img src="@/assets/img/patients/patient-default.png" alt="User Image" />
                    </a>
                    <div class="profile-det-info">
                      <h3>{{ patientInfo.name }}</h3>

                      <div class="patient-details">
                        <h5>
                          <b>Last Visit :</b>
                          {{ convertTimestampToString(patientInfo.accessTime) }}
                        </h5>
                        <div class="row">
                          <div class="col" v-if="!editable">
                            <button class="btn bg-success-light" @click="switchToEditMode">
                              <i class="far fa-edit"></i>
                              Edit
                            </button>
                          </div>
                          <div class="col" v-if="editable">
                            <button class="btn bg-info-light" @click="saveHistory">
                              <i class="far fa-save"></i>
                              Save
                            </button>
                          </div>
                          <div class="col" v-if="editable" @click="editable = false">
                            <button class="btn bg-danger-light">
                              <i class="far"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="patient-info" v-if="patientInfo.history">
                  <ul>
                    <li v-for="(history, index) in historyElements" :key="`history-${index}`">
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
                          :value="convertTimestampToString(patientInfo.history[history.id])"
                          @selected="setDateValue(history.id)"
                          :id="`datepicker-${history.id}`"
                          v-if="history.type == 'date'"
                        ></datepicker>
                        <div v-if="history.type == 'radio'">
                          <div
                            class="form-check"
                            v-for="(value, index1) in history.values"
                            :key="`value - ${index1}`"
                          >
                            <input
                              class="form-check-input"
                              type="radio"
                              :id="`radio${index}${index1}`"
                              :value="value"
                              v-model="patientInfo.history[history.id]"
                            />
                            <label
                              class="form-check-label"
                              :for="`radio${index}${index1}`"
                            >{{ value }}</label>
                          </div>
                        </div>
                      </div>
                      <span v-else>
                        <span v-if="history.type == 'date'">
                          {{
                          convertTimestampToString(
                          patientInfo.history[history.id]
                          )
                          }}
                        </span>
                        <span v-else>
                          {{
                          patientInfo.history[history.id]
                          }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
                      >Add Visit</a>
                    </div>
                    <div class="card card-table mb-0">
                      <div class="card-body">
                        <vs-collapse type="border">
                          <doctors-patient-visit-item
                            v-for="(data, index) in patientInfo.visits"
                            :key="index"
                            :data="data"
                            :patientInfo="patientInfo"
                            :visitIndex="index"
                            :id="id"
                          ></doctors-patient-visit-item>
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
          <div class="form-group">
            <div class="upload-img">
              <div class="change-photo-btn vs-con-loading__container" id="button-with-loading">
                <span>
                  <i class="fa fa-upload"></i> Upload File
                </span>
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
import $ from "jquery";
import DoctorsPatientVisitItem from "./DoctorsPatientVisitItem";
export default {
  data() {
    return {
      patientInfo: null,
      showAddModal: false,
      visitInfo: { files: [] },
      editable: false,
      doctor: null,
      taskUploadFile: null,
      visitEditables: [],
      visitEditable: false,
      id: this.$route.params.id
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
        .doc(this.id)
        .get();

      this.patientInfo = patientInfo.data();
      const { visits } = this.patientInfo;

      visits.forEach(() => {
        this.visitEditables.push(false);
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
    },
    async saveVisit() {
      this.visitInfo["time"] = new Date();
      this.$vs.loading();
      await db
        .collection("History")
        .doc(this.id)
        .update({
          visits: firebase.firestore.FieldValue.arrayUnion(this.visitInfo),
          accessTime: firebase.firestore.FieldValue.serverTimestamp()
        });
      this.$vs.loading.close();
      this.loadPatientInfo();
    },
    async saveHistory() {
      this.$vs.loading();
      await db
        .collection("History")
        .doc(this.id)
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
        const images = require.context("../../../assets/img", false, /\.png$/);
        return images("./pdf.png");
      }
      return url;
    },
    downloadFile(url) {
      window.open(url);
    },
    switchToEditMode() {
      this.editable = true;

      setTimeout(() => {
        $(".datepicker input").addClass("form-control");
      }, 100);
    },
    setDateValue(historyId) {
      this.patientInfo.history[historyId] = new Date(
        $(`#datepicker-${historyId}`).val()
      );
    },
    enableEditVisit(index) {
      this.visitEditables[index] = true;
    }
  },
  components: {
    Datepicker,
    DoctorsPatientVisitItem
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
    },
    formattedDate(timestamp) {
      return this.convertTimestampToString(timestamp);
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
