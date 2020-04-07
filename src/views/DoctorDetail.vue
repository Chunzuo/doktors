<template>
  <div>
    <div class="content">
      <div class="container">
        <div class="card">
          <div
            class="card-body top-card"
            :style="{ backgroundImage: getBackgroundImage(doctor.background) }"
          >
            <div class="doctor-widget">
              <div class="doc-info-left">
                <div
                  class="widget-profile pro-widget-content"
                  style="background: transparent; border-bottom: 0px;"
                >
                  <div class="profile-info-widget">
                    <a href="#" class="booking-doc-img">
                      <img :src="getAvatar(doctor.avatar)" alt="Doctor Image" />
                    </a>
                  </div>
                </div>

                <div class="doc-info-cont">
                  <h4 class="doc-name">Dr. {{ doctor.name }}</h4>
                  <p class="doc-speciality">{{ doctor.speciality }}</p>

                  <div class="clinic-details">
                    <p class="doc-location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ doctor.location }}
                    </p>
                  </div>

                  <div style="display: flex;">
                    <div v-if="doctorProfile.facebook">
                      <a class="social-icon" :href="doctorProfile.facebook" target="_blank">
                        <i class="fab fa-facebook-f"></i>
                      </a>
                    </div>

                    <div v-if="doctorProfile.twitter">
                      <a :href="doctorProfile.twitter" target="_blank" class="social-icon ml-2">
                        <i class="fab fa-twitter"></i>
                      </a>
                    </div>

                    <div v-if="doctorProfile.instagram">
                      <a :href="doctorProfile.instagram" target="_blank" class="social-icon ml-2">
                        <i class="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="doc-info-right">
                <div class="clinic-booking">
                  <router-link
                    :to="`/book-appointment/${doctor.id}`"
                    class="apt-btn"
                  >{{$tc('book_appointment')}}</router-link>
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
                          <!-- <div class="avatar">
                            <img
                              class="avatar-img rounded-circle"
                              alt="Doctor Image"
                              :src="doctor.avatar"
                            />
                          </div>-->
                          <h4 class="widget-title mt-2 ml-2">{{$tc('about_me')}}</h4>
                        </div>
                        <p class="mt-2">{{ doctorProfile.bio }}</p>
                      </div>
                      <!-- /About Details -->

                      <!-- Education Details -->
                      <div class="widget education-widget">
                        <h4 class="widget-title">{{$tc('education')}}</h4>
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
                                  <a href="#/" class="name">{{ education.college }}</a>
                                  <div>{{ education.degree }}</div>
                                  <span class="time">{{ education.year }}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!-- /Education Details -->

                      <!-- Experience Details -->
                      <div class="widget experience-widget">
                        <h4 class="widget-title">{{$tc('work_experience')}}</h4>
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
                                  <a href="#/" class="name">
                                    {{ experience.designation }}
                                    {{ experience.hospital }}
                                  </a>
                                  <span class="time">{{ experience.year }}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <!-- /Experience Details -->

                      <!-- Awards Details -->
                      <div class="widget awards-widget">
                        <h4 class="widget-title">{{$tc('awards')}}</h4>
                        <div class="experience-box">
                          <div class="row">
                            <div
                              class="col-md-4"
                              v-for="(cert,
                              index) in doctorProfile.certifications"
                              :key="`cert - ${index}`"
                            >
                              <a :href="cert" data-fancybox="gallery">
                                <img style="width: 100%" :src="cert" />
                              </a>
                              <!-- <img style="width: 100%" :src="cert" /> -->
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- /Awards Details -->

                      <!-- Services List -->
                      <div class="service-list">
                        <h4>{{$tc('services')}}</h4>
                        <ul class="clearfix" v-if="doctor.services">
                          <li
                            v-for="(service, index) in doctor.services"
                            :key="`service - ${index}`"
                          >{{ service }}</li>
                        </ul>
                      </div>
                      <!-- /Services List -->

                      <!-- Specializations List -->
                      <div class="service-list">
                        <h4>{{$tc('specialization')}}</h4>
                        <ul class="clearfix" v-if="doctor.specializations">
                          <li
                            v-for="(spec, index) in doctor.specializations"
                            :key="`spec - ${index}`"
                          >{{ spec }}</li>
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
              <h4 class="widget-title">{{$tc('business_hours')}}</h4>
              <hr />
              <div class="widget-content">
                <div class="listing-hours" v-if="doctorProfile.openingHours">
                  <div
                    :class="[
                      'listing-day',
                      {
                        closed:
                          doctorProfile.openingHours[day.value].closed == true
                      }
                    ]"
                    v-for="(day, index) in days"
                    :key="`day - ${index}`"
                  >
                    <div class="day">{{ day.text }}</div>
                    <div class="time-items">
                      <span class="time" v-if="doctorProfile.openingHours[day.value].closed">
                        <span class="badge bg-danger-light">Closed</span>
                      </span>
                      <span class="time" v-else>
                        {{ doctorProfile.openingHours[day.value].from }} ~
                        {{ doctorProfile.openingHours[day.value].until }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="widget business-widget mt-2">
              <h4 class="widget-title">{{$tc('location')}}</h4>
              <p class="doc-location">
                <i class="fas fa-map-marker-alt"></i>
                {{ doctor.location }}
              </p>
              <gmap-map
                :center="getMapCenter(doctorProfile.mapCenter)"
                :zoom="15"
                style="width: 100%; height: 300px"
                v-if="doctorProfile.mapCenter"
              >
                <gmap-marker :position="getMapCenter(doctorProfile.mapCenter)" :clickable="true"></gmap-marker>
              </gmap-map>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  data() {
    return {
      doctor: {},
      doctorProfile: {},
      days: [
        { text: this.$tc('saturday'), value: 'sat' },
        { text: this.$tc('sunday'), value: 'sun' },
        { text: this.$tc('monday'), value: 'mon' },
        { text: this.$tc('tuesday'), value: 'tue' },
        { text: this.$tc('wednesday'), value: 'wed' },
        { text: this.$tc('thursday'), value: 'thu' },
        { text: this.$tc('friday'), value: 'fri' }
      ]
    }
  },
  mounted() {
    this.getDoctorInfo()
  },
  methods: {
    async getDoctorInfo() {
      let doctorId = this.$route.params.id
      if (!doctorId) {
        return
      }
      this.$vs.loading()

      const doctorInfo = await db
        .collection('Doctors')
        .doc(doctorId)
        .get()
      this.doctor = doctorInfo.data()
      this.doctor['id'] = doctorInfo.id

      const profile = await db
        .collection('DoctorProfiles')
        .doc(doctorId)
        .get()
      this.doctorProfile = profile.data()
      this.$vs.loading.close()
    },
    getMapCenter(mapCenter) {
      return {
        lat: parseFloat(mapCenter.lat),
        lng: parseFloat(mapCenter.lng)
      }
    },
    getBackgroundImage(image) {
      var images = require.context('../assets/img/', false, /\.jpg$/)
      if (image == null) {
        return `url(${images('./banner-doctor.jpg')})`
      }
      return `url(${image})`
    },
    getAvatar(avatar) {
      if (avatar == null) {
        var images = require.context('../assets/img/', false, /\.jpg$/)
        return images('./doctor-default.jpg')
      }
      return avatar
    }
  }
}
</script>

<style lang="scss" scoped>
.top-card {
  background-size: cover;
}
.social-icon {
  color: white;
  :hover {
    color: #20c0f3;
  }
}

i.fab {
  font-size: 24px;
}

.doc-speciality {
  color: white;
}

.doc-location {
  color: white;
}
</style>
