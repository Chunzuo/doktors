<template>
  <div>
    <!-- Basic Information -->
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Basic Information</h4>
        <div class="row form-row">
          <div class="col-md-12">
            <div class="form-group">
              <div class="change-avatar">
                <div class="profile-img">
                  <img
                    :src="doctor.avatar"
                    onerror="javascript:this.src='assets/img/doctor-default.jpg'"
                    alt="User Image"
                  />
                </div>
                <div class="upload-img">
                  <div class="change-photo-btn vs-con-loading__container" id="button-with-loading">
                    <span>
                      <i class="fa fa-upload"></i> Upload Photo
                    </span>
                    <input type="file" class="upload" @change="uploadAvatar" />
                  </div>
                  <small class="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" v-model="doctor.name" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" class="form-control" v-model="doctor.phone" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Basic Information -->

    <!-- About Me -->
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">About Me</h4>
        <div class="form-group mb-0">
          <label>Biography</label>
          <textarea class="form-control" rows="5" v-model="doctorProfile.bio"></textarea>
        </div>
      </div>
    </div>
    <!-- /About Me -->

    <!-- Contact Details -->
    <div class="card contact-card">
      <div class="card-body">
        <h4 class="card-title">Contact Details</h4>
        <div class="row form-row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Location</label>
              <input type="text" class="form-control" v-model="doctor.location" />
            </div>
          </div>
          <div class="col-md-12">
            <gmap-map
              :center="doctorProfile.mapCenter"
              :zoom="15"
              style="width: 100%; height: 500px"
              v-if="doctorProfile.mapCenter"
            >
              <gmap-marker :position="doctorProfile.mapCenter" :clickable="true"></gmap-marker>
            </gmap-map>
          </div>
        </div>
      </div>
    </div>
    <!-- /Contact Details -->

    <!-- Certificates Info -->
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Certificates Info</h4>
        <div class="row form-row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Clinic Images</label>

              <div class="form-group">
                <div class="change-avatar">
                  <div class="upload-img">
                    <div class="change-photo-btn">
                      <span>
                        <i class="fa fa-upload"></i> Upload Photo
                      </span>
                      <input type="file" class="upload" @change="uploadCertificate" />
                    </div>
                    <small class="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                  </div>
                </div>
              </div>
              <form action="#" class="dropzone"></form>
            </div>
            <div class="upload-wrap">
              <div
                class="upload-images"
                style="width: auto;"
                v-for="(certificate, index) in doctorProfile.certifications"
                :key="index"
              >
                <a :href="certificate" data-fancybox="gallery">
                  <img :src="certificate" alt="Feature" />
                </a>
                <a
                  href="javascript:void(0);"
                  class="btn btn-icon btn-danger btn-sm"
                  @click="removeCert(index)"
                >
                  <i class="far fa-trash-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Certificates Info -->

    <!-- Education -->
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Education</h4>
        <div class="education-info">
          <div
            class="row form-row education-cont"
            v-for="(education, index) in educations"
            :key="`education-${index}`"
          >
            <div class="col-12 col-md-10 col-lg-11">
              <div class="row form-row">
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Degree</label>
                    <input type="text" v-model="education.degree" class="form-control" />
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>College/Institute</label>
                    <input type="text" class="form-control" v-model="education.college" />
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Year of Completion</label>
                    <input type="text" class="form-control" v-model="education.year" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-2 col-lg-1" v-if="index > 0">
              <label class="d-md-block d-sm-none d-none" v-html="'&nbsp;'"></label>
              <a href="#" class="btn btn-danger trash" @click.prevent="removeEducation(index)">
                <i class="far fa-trash-alt"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="add-more">
          <a href="javascript:void(0);" class="add-education" @click="addEmptyEducation">
            <i class="fa fa-plus-circle"></i> Add More
          </a>
        </div>
      </div>
    </div>
    <!-- /Education -->

    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Experience</h4>
        <div class="experience-info">
          <div
            class="row form-row experience-cont"
            v-for="(experience, index) in experiences"
            :key="`experience - ${index}`"
          >
            <div class="col-12 col-md-10 col-lg-11">
              <div class="row form-row">
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Hospital Name</label>
                    <input type="text" class="form-control" v-model="experience.hospital" />
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Designation</label>
                    <input type="text" class="form-control" v-model="experience.designation" />
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Year of period</label>
                    <input type="text" class="form-control" v-model="experience.year" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-2 col-lg-1" v-if="index > 0">
              <label class="d-md-block d-sm-none d-none" v-html="'&nbsp;'"></label>
              <a href="#" class="btn btn-danger trash" @click.prevent="removeExperience(index)">
                <i class="far fa-trash-alt"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="add-more">
          <a href="javascript:void(0);" class="add-experience" @click="addEmptyExperience">
            <i class="fa fa-plus-circle"></i> Add More
          </a>
        </div>
      </div>
    </div>

    <!-- Services and Specialization -->
    <div class="card services-card">
      <div class="card-body">
        <h4 class="card-title">Services and Specialization</h4>
        <div class="form-group">
          <label>Services</label>
          <input-tag v-model="services"></input-tag>
          <small class="form-text text-muted">Note : Type & Press enter to add new services</small>
        </div>
        <div class="form-group mb-0">
          <label>Specialization</label>
          <input-tag v-model="specializations"></input-tag>
          <small class="form-text text-muted">Note : Type & Press enter to add new specialization</small>
        </div>
      </div>
    </div>
    <!-- /Services and Specialization -->

    <div class="submit-section submit-btn-bottom">
      <button type="submit" class="btn btn-primary submit-btn" @click="updateProfile">Save Changes</button>
    </div>
  </div>
</template>

<script>
import { db, storage } from "@/firebase";
import InputTag from "vue-input-tag";
export default {
  created() {
    this.$store.commit("updateDoctorSidebarItem", "Profile Settings");
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    }
  },
  watch: {
    userInfo() {
      this.getDoctorInfo();
    },
    taskUploadAvatar: function() {
      this.taskUploadAvatar.on(
        "state_changed",
        () => {},
        null,
        () => {
          this.taskUploadAvatar.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.doctor.avatar = downloadURL;
              this.$vs.loading.close("#button-with-loading > .con-vs-loading");
            });
        }
      );
    },
    taskUploadCert: function() {
      this.taskUploadCert.on(
        "state_changed",
        () => {},
        null,
        () => {
          this.taskUploadCert.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.doctorProfile.certifications.push(downloadURL);
            });
        }
      );
    }
  },
  data() {
    return {
      doctor: {},
      doctorProfile: {},
      taskUploadAvatar: null,
      taskUploadCert: null,
      educations: [
        {
          degree: "",
          college: "",
          year: ""
        }
      ],
      experiences: [
        {
          hospital: "",
          designation: "",
          year: ""
        }
      ],
      services: [],
      specializations: []
    };
  },
  mounted() {
    this.getDoctorInfo();
  },
  methods: {
    async getDoctorInfo() {
      if (!this.userInfo.id) {
        return;
      }
      this.$vs.loading();

      const doctorInfo = await db
        .collection("Doctors")
        .doc(this.userInfo.id)
        .get();
      this.doctor = doctorInfo.data();
      if (this.doctor.educations) {
        this.educations = this.doctor.educations;
      }
      if (this.doctor.experiences) {
        this.experiences = this.doctor.experiences;
      }
      if (this.doctor.services) {
        this.services = this.doctor.services;
      }
      if (this.doctor.specializations) {
        this.specializations = this.doctor.specializations;
      }

      const profile = await db
        .collection("DoctorProfiles")
        .doc(this.userInfo.id)
        .get();
      this.doctorProfile = profile.data();

      this.$vs.loading.close();
    },
    uploadAvatar(e) {
      const fileList = e.target.files || e.dataTransfer.files;
      const file = fileList[0];
      const today = new Date();
      const fileName =
        file.name +
        "-" +
        today.getHours() +
        today.getMinutes() +
        today.getSeconds();
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#button-with-loading",
        scale: 0.45
      });
      this.taskUploadAvatar = storage.ref(`images/${fileName}`).put(file);
    },
    async updateProfile() {
      this.$vs.loading();

      this.doctor["educations"] = this.educations;
      this.doctor["experiences"] = this.experiences;
      this.doctor["services"] = this.services;
      this.doctor["specializations"] = this.specializations;

      await db
        .collection("Doctors")
        .doc(this.userInfo.id)
        .update(this.doctor);
      await db
        .collection("DoctorProfiles")
        .doc(this.userInfo.id)
        .update(this.doctorProfile);

      this.$vs.loading.close();
      this.$vs.notify({
        text: "Success in update profile",
        color: "success"
      });
    },
    uploadCertificate(e) {
      const fileList = e.target.files || e.dataTransfer.files;
      const file = fileList[0];
      const today = new Date();
      const fileName =
        file.name +
        "-" +
        today.getHours() +
        today.getMinutes() +
        today.getSeconds();

      this.taskUploadCert = storage.ref(`images/${fileName}`).put(file);
    },
    removeCert(index) {
      this.doctorProfile.certifications.splice(index, 1);
    },
    addEmptyEducation() {
      this.educations.push({
        degree: "",
        college: "",
        year: ""
      });
    },
    removeEducation(index) {
      let newList = [];
      for (var i = 0; i < this.educations.length; i++) {
        if (i != index) {
          newList.push(this.educations[i]);
        }
      }
      this.educations = newList;
    },
    addEmptyExperience() {
      this.experiences.push({
        hospital: "",
        designation: "",
        year: ""
      });
    },
    removeExperience(index) {
      let newList = [];
      for (var i = 0; i < this.experiences.length; i++) {
        if (i != index) {
          newList.push(this.experiences[i]);
        }
      }
      this.experiences = newList;
    }
  },
  components: {
    InputTag
  }
};
</script>

<style lang="scss" scoped>
</style>