<template>
  <div class="content">
    <div class="col-md-12 col-lg-12 col-xl-12 dct-appoinment">
      <div class="card">
        <div class="card-body pt-0">
          <div class="tab-content">
            <div>
              <div class="text-right">
                <a
                  href="javascript:;"
                  class="add-new-btn"
                  @click="openAddModal()"
                  >Add</a
                >
              </div>
              <div class="card mb-0">
                <div class="card-body">
                  <div class="row">
                    <div
                      class="col-md-3"
                      v-for="(ads, index) in adsList"
                      :key="index"
                    >
                      <div class="profile-widget" style="overflow: auto;">
                        <div class="doc-img">
                          <a :href="ads.link">
                            <img
                              class="img-fluid"
                              alt="User Image"
                              :src="ads.image"
                              style="height: 150px !important"
                            />
                          </a>
                        </div>
                        <div
                          class="pro-content"
                          style="height: 120px; min-height: 120px;"
                        >
                          <h3 class="title">
                            <b>Title:</b>
                            {{ ads.title }}
                          </h3>
                          <p class="speciality">
                            <b>Description:</b>
                            {{ ads.description }}
                          </p>
                          <p class="speciality">
                            <b>Link:</b>
                            {{ ads.link }}
                          </p>
                          <div class="row row-sm">
                            <div class="col-6">
                              <a
                                href="javascript:;"
                                class="btn view-btn"
                                @click="openEditModal(ads.id)"
                                >Edit</a
                              >
                            </div>
                            <div class="col-6">
                              <a
                                href="javascript:;"
                                class="btn book-btn"
                                @click="openDeleteModal(ads.id)"
                                >Delete</a
                              >
                            </div>
                          </div>
                        </div>
                      </div>
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
      @cancel="showModal = false"
      @accept="saveAds"
      @close="showModal = false"
      :active.sync="showModal"
      :title="modalMode == 0 ? 'Add Advertisement' : 'Edit Advertisement'"
    >
      <div class="modal-body">
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="form-control" v-model="adsInfo.title" />
        </div>
        <div class="form-group">
          <label>Link</label>
          <input class="form-control" v-model="adsInfo.link" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
            class="form-control"
            v-model="adsInfo.description"
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
</template>

<script>
import { db, storage } from '@/firebase'
export default {
  created() {
    this.$store.commit('updateSelectItem', 'AdsManagement')
    const role = localStorage.getItem('role')

    if (role != 'adsManager') {
      this.$router.push('/')
    }
  },
  mounted() {
    this.getAdsList()
  },
  data() {
    return {
      adsList: [],
      taskUploadFile: null,
      showModal: false,
      adsInfo: {},
      modalMode: 0, // 0: Add, 1: Edit
      idToEdit: null
    }
  },
  methods: {
    async getAdsList() {
      this.$vs.loading()
      const ref = await db.collection('Ads').get()
      this.adsList = []
      ref.docs.forEach(doc => {
        let data = doc.data()
        data['id'] = doc.id
        this.adsList.push(data)
      })
      this.$vs.loading.close()
    },
    uploadFile(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const file = fileList[0]
      const today = new Date()
      const fileName =
        file.name +
        '-' +
        today.getHours() +
        today.getMinutes() +
        today.getSeconds()
      this.$vs.loading()
      this.taskUploadFile = storage.ref(`images/${fileName}`).put(file)
    },
    async saveAds() {
      this.$vs.loading()
      if (this.modalMode == 0) {
        await db.collection('Ads').add(this.adsInfo)
        this.$vs.notify({
          text: 'Success in add new ads',
          color: 'success'
        })
        this.$vs.loading.close()
      } else {
        await db
          .collection('Ads')
          .doc(this.idToEdit)
          .set(this.adsInfo)
        this.$vs.notify({
          text: 'Success in update ads',
          color: 'success'
        })
      }
      this.getAdsList()
    },
    openAddModal() {
      this.showModal = true
      this.modalMode = 0
    },
    async openEditModal(id) {
      this.$vs.loading()
      const adsInfo = await db
        .collection('Ads')
        .doc(id)
        .get()
      this.adsInfo = adsInfo.data()
      this.showModal = true
      this.modalMode = 1
      this.idToEdit = id
      this.$vs.loading.close()
    },
    openDeleteModal(id) {
      this.idToEdit = id
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm Delete`,
        text: `Are you sure delete this ads?`,
        accept: this.deleteAds,
        acceptText: 'Delete'
      })
    },
    async deleteAds() {
      this.$vs.loading()
      await db
        .collection('Ads')
        .doc(this.idToEdit)
        .delete()
      this.$vs.loading.close()
      this.getAdsList()
    }
  },
  watch: {
    taskUploadFile: function() {
      this.taskUploadFile.on(
        'state_changed',
        () => {},
        null,
        () => {
          this.taskUploadFile.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.adsInfo.image = downloadURL
              this.$vs.loading.close()
            })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
