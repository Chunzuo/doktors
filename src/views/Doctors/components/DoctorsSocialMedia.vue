<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- Social Form -->

        <div class="row">
          <div class="col-md-12 col-lg-8">
            <div class="form-group">
              <label>Facebook URL</label>
              <input
                type="text"
                class="form-control"
                v-model="profile.facebook"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-lg-8">
            <div class="form-group">
              <label>Twitter URL</label>
              <input
                type="text"
                class="form-control"
                v-model="profile.twitter"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-lg-8">
            <div class="form-group">
              <label>Instagram URL</label>
              <input
                type="text"
                class="form-control"
                v-model="profile.instagram"
              />
            </div>
          </div>
        </div>
        <div class="submit-section">
          <button class="btn btn-primary submit-btn" @click.prevent="save">
            Save Changes
          </button>
        </div>

        <!-- /Social Form -->
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
export default {
  created() {
    this.$store.commit('updateDoctorSidebarItem', 'Social Media')
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
      profile: {}
    }
  },
  mounted() {
    this.getDoctorProfile()
  },
  methods: {
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
      this.profile = profileData
      // this.openingHours = profileData.openingHours;

      this.$vs.loading.close()
    },
    async save() {
      this.$vs.loading()

      await db
        .collection('DoctorProfiles')
        .doc(this.userInfo.id)
        .update(this.profile)

      this.$vs.loading.close()
      this.$vs.notify({
        text: 'Success in update social media link',
        color: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
