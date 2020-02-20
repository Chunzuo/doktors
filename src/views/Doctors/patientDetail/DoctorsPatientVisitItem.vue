<template>
  <vs-collapse-item>
    <div slot="header">{{ convertTimestampToString(data.time) }}</div>
    <div class="row" v-if="editable">
      <button class="btn bg-info-light" @click="updateVisitInfo()">
        <i class="far fa-save"></i>
      </button>

      <button class="btn bg-danger-light" @click="editable = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <button class="btn bg-success-light" @click="editable = true" v-else>
      <i class="far fa-edit"></i>
    </button>
    <button class="btn bg-primary-light ml-2" @click="print">
      <i class="fas fa-print"></i>
    </button>
    <h5>Diagnosis</h5>
    <textarea
      v-if="editable == true"
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

    <div id="printMe">
      <h5>Treatment</h5>
      <textarea
        v-if="editable"
        class="form-control"
        rows="5"
        v-model="data.treatment"
      ></textarea>
      <span v-else>{{ data.treatment }}</span>
    </div>

    <h5>Files</h5>
    <div class="upload-img">
      <div
        class="change-photo-btn vs-con-loading__container mb-2"
        id="button-with-loading"
        v-if="editable"
      >
        <span> <i class="fa fa-upload"></i> Upload File </span>
        <input type="file" class="upload" @change="uploadFile" />
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-4 col-sm-12"
        v-for="(file, index) in data.files"
        :key="`file - ${index}`"
      >
        <img
          :src="getFileUrl(file)"
          alt="visit file"
          style="cursor: pointer; width: 100%"
          @click="downloadFile(file)"
        />
        <a
          href="javascript:void(0);"
          class="btn btn-icon btn-danger btn-sm"
          @click="removeFile(index)"
          v-if="editable"
        >
          <i class="far fa-trash-alt"></i>
        </a>
      </div>
    </div>
  </vs-collapse-item>
</template>

<script>
import { storage, db } from '@/firebase'
export default {
  props: {
    data: { type: Object, requires: true },
    patientInfo: { type: Object },
    visitIndex: { type: Number },
    id: { type: String }
  },
  methods: {
    convertTimestampToString(accessTime) {
      if (accessTime == null) {
        return ''
      }
      var timestamp = accessTime.value ? accessTime.value : accessTime
      try {
        const tDate = timestamp.toDate()
        return (
          tDate.getMonth() +
          1 +
          '/' +
          tDate.getDate() +
          '/' +
          tDate.getFullYear()
        )
      } catch {
        return ''
      }
    },
    getFileUrl(url) {
      if (url.includes('.pdf')) {
        const images = require.context('../../../assets/img', false, /\.png$/)
        return images('./pdf.png')
      }
      return url
    },
    async updateVisitInfo() {
      this.patientInfo.visits[this.visitIndex] = this.data

      this.$vs.loading()
      await db
        .collection('History')
        .doc(this.id)
        .update(this.patientInfo)
      this.editable = false
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
    removeFile(index) {
      let newFiles = []
      for (let i = 0; i < this.data.files.length; i++) {
        if (i != index) {
          newFiles.push(this.data.files[i])
        }
      }
      this.data.files = newFiles
    },
    downloadFile(url) {
      window.open(url)
    },
    print() {
      this.$htmlToPaper('printMe')
    }
  },
  data() {
    return {
      editable: false,
      taskUploadFile: null
    }
  },
  watch: {
    taskUploadFile: function() {
      this.taskUploadFile.on(
        'state_changed',
        function() {},
        null,
        function() {
          this.taskUploadFile.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              this.data.files.push(downloadURL)
              this.$vs.loading.close()
            })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
