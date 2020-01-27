<template>
  <div>
    <!-- <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <nav aria-label="breadcrumb" class="page-breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/">Home</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Doctor Profile</li>
              </ol>
            </nav>
            <h2 class="breadcrumb-title">{{doctor.name}}</h2>
          </div>
        </div>
      </div>
    </div>-->

    <div class="content">
      <div class="container">
        <div class="card">
          <div class="card-body">
            <div class="doctor-widget">
              <div class="doc-info-left">
                <div class="doctor-img">
                  <img
                    :src="doctor.avatar"
                    onerror="javascript:this.src='assets/img/doctor-default.jpg'"
                    alt="User Image"
                    style="width: 150px;"
                  />
                </div>
                <div class="doc-info-cont">
                  <h4 class="doc-name">Dr. {{doctor.name}}</h4>
                  <p class="doc-speciality">{{doctor.speciality}}</p>

                  <div class="clinic-details">
                    <p class="doc-location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{doctor.location}}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <div class="pt-0">
                  <div class="row">
                    <div class="col-12">
                      <!-- About Details -->
                      <div class="widget about-widget">
                        <div style="display: flex;">
                          <div class="avatar">
                            <img
                              class="avatar-img rounded-circle"
                              alt="User Image"
                              :src="doctor.avatar"
                            />
                          </div>
                          <h4 class="widget-title mt-2 ml-2">About Me</h4>
                        </div>
                        <p class="mt-2">{{doctorProfile.bio}}</p>
                      </div>
                      <!-- /About Details -->

                      <!-- Education Details -->
                      <div class="widget education-widget">
                        <h4 class="widget-title">Education</h4>
                        <div class="experience-box">
                          <ul class="experience-list" v-if="doctor.educations">
                            <li
                              v-for="(education, index) in doctor.educations"
                              :key="`education - ${index}`"
                            >
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">{{education.college}}</a>
                                  <div>{{education.degree}}</div>
                                  <span class="time">{{education.year}}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!-- /Education Details -->

                      <!-- Experience Details -->
                      <div class="widget experience-widget">
                        <h4 class="widget-title">Work & Experience</h4>
                        <div class="experience-box">
                          <ul class="experience-list" v-if="doctor.experiences">
                            <li
                              v-for="(experience, index) in doctor.experiences"
                              :key="`experience - ${index}`"
                            >
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a
                                    href="#/"
                                    class="name"
                                  >{{experience.designation}} {{experience.hospital}}</a>
                                  <span class="time">{{experience.year}}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!-- /Experience Details -->

                      <!-- Awards Details -->
                      <div class="widget awards-widget">
                        <h4 class="widget-title">Awards</h4>
                        <div class="experience-box">
                          <slick :options="slickOptions">
                            <img
                              v-for="(cert, index) in doctorProfile.certifications"
                              :key="`cert - ${index}`"
                              :src="cert"
                            />
                          </slick>
                        </div>
                      </div>
                      <!-- /Awards Details -->

                      <!-- Services List -->
                      <div class="service-list">
                        <h4>Services</h4>
                        <ul class="clearfix" v-if="doctor.services">
                          <li
                            v-for="(service, index) in doctor.services"
                            :key="`service - ${index}`"
                          >{{service}}</li>
                        </ul>
                      </div>
                      <!-- /Services List -->

                      <!-- Specializations List -->
                      <div class="service-list">
                        <h4>Specializations</h4>
                        <ul class="clearfix" v-if="doctor.specializations">
                          <li
                            v-for="(spec, index) in doctor.specializations"
                            :key="`spec - ${index}`"
                          >{{spec}}</li>
                        </ul>
                      </div>
                      <!-- /Specializations List -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="widget business-widget" style="background: white;">
              <h4 class="widget-title">Business Hours</h4>
              <hr />
              <div class="widget-content">
                <div class="listing-hours" v-if="doctorProfile.openingHours">
                  <div
                    :class="['listing-day', {'closed': doctorProfile.openingHours[day.value].closed == true}]"
                    v-for="(day, index) in days"
                    :key="`day - ${index}`"
                  >
                    <div class="day">{{day.text}}</div>
                    <div class="time-items">
                      <span class="time" v-if="doctorProfile.openingHours[day.value].closed">
                        <span class="badge bg-danger-light">Closed</span>
                      </span>
                      <span
                        class="time"
                        v-else
                      >{{doctorProfile.openingHours[day.value].from}} ~ {{doctorProfile.openingHours[day.value].until}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="widget business-widget mt-2">
              <h4 class="widget-title">Locations</h4>
              <p class="doc-location">
                <i class="fas fa-map-marker-alt"></i>
                {{doctor.location}}
              </p>
              <gmap-map
                :center="doctorProfile.mapCenter"
                :zoom="15"
                style="width: 100%; height: 300px"
                v-if="doctorProfile.mapCenter"
              >
                <gmap-marker :position="doctorProfile.mapCenter" :clickable="true"></gmap-marker>
              </gmap-map>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import Slick from "vue-slick";
export default {
  data() {
    return {
      doctor: {},
      doctorProfile: {},
      days: [
        { text: "Monday", value: "mon" },
        { text: "Tuesday", value: "tue" },
        { text: "Wendsday", value: "wed" },
        { text: "Thursday", value: "thu" },
        { text: "Friday", value: "fri" },
        { text: "Satureday", value: "sat" },
        { text: "Sunday", value: "sun" }
      ],
      slickOptions: {
        dots: false,
        autoplay: false,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
      }
    };
  },
  mounted() {
    this.getDoctorInfo();
  },
  methods: {
    async getDoctorInfo() {
      let doctorId = this.$route.params.id;
      if (!doctorId) {
        return;
      }
      this.$vs.loading();

      const doctorInfo = await db
        .collection("Doctors")
        .doc(doctorId)
        .get();
      this.doctor = doctorInfo.data();

      const profile = await db
        .collection("DoctorProfiles")
        .doc(doctorId)
        .get();
      this.doctorProfile = profile.data();
      this.$vs.loading.close();
    }
  },
  components: { Slick }
};
</script>

<style lang="scss" scoped>
</style>