<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Lanauge Settings</h4>
        <select name id class="form-control">
          <option value>Kurdish</option>
          <option value>Arab</option>
          <option value>English</option>
        </select>

        <h4 class="card-title mt-4">Features</h4>
        <div class="row">
          <div class="col">
            <label class="custom_check">
              <input type="checkbox" name="select_specialist" />
              <span class="checkmark"></span>
              Use Calendar
            </label>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label class="custom_check">
              <input type="checkbox" name="select_specialist" />
              <span class="checkmark"></span>
              Get Notifications
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Assistant</h4>
        <div class="assistant-info">
          <div
            class="row form-row assistant-cont"
            v-for="(assistant, index) in assistants"
            :key="`assistant-${index}`"
          >
            <div class="col-12 col-md-10 col-lg-11">
              <div class="row form-row">
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Phone number</label>
                    <input type="text" v-model="assistant.phone" class="form-control" />
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="form-group">
                    <label>Name</label>
                    <input type="text" v-model="assistant.name" class="form-control" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-2 col-lg-1" v-if="index > 0">
              <label class="d-md-block d-sm-none d-none" v-html="'&nbsp;'"></label>
              <a href="#" class="btn btn-danger trash" @click.prevent="removeAssistant(index)">
                <i class="far fa-trash-alt"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="add-more">
          <a href="javascript:void(0);" class="add-assistant" @click="addEmptyAssistant">
            <i class="fa fa-plus-circle"></i> Add More
          </a>
        </div>
      </div>
    </div>

    <div class="card" v-if="doctor">
      <div class="card-body">
        <div class="card-title">History of elements</div>
        <div v-for="(element, index) in doctor.historyElements" :key="`element - ${index}`">
          <label class="custom_check">
            <input type="checkbox" name="select_specialist" v-model="element.active" />
            <span class="checkmark"></span>
            {{element.title}}
          </label>
        </div>
      </div>
    </div>

    <div class="submit-section submit-btn-bottom">
      <button type="submit" class="btn btn-primary submit-btn" @click="save">Save Changes</button>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  created() {
    this.$store.commit("updateDoctorSidebarItem", "Settings");
  },
  data() {
    return {
      assistants: [
        {
          phone: "",
          name: ""
        }
      ],
      doctor: null
    };
  },
  methods: {
    removeAssistant(index) {
      let newList = [];
      for (var i = 0; i < this.assistants.length; i++) {
        if (index != i) {
          newList.push(this.assistants[i]);
        }
      }
      this.assistants = newList;
    },
    addEmptyAssistant() {
      this.assistants.push({
        phone: "",
        name: ""
      });
    },
    async save() {
      this.$vs.loading();

      this.doctor["assistants"] = this.assistants;

      await db
        .collection("Doctors")
        .doc(this.userInfo.id)
        .update(this.doctor);

      this.$vs.loading.close();
      this.$vs.notify({
        text: "Success in update profile",
        color: "success"
      });
    },
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
      if (this.doctor.assistants) {
        this.assistants = this.doctor.assistants;
      }

      this.$vs.loading.close();
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    }
  },
  watch: {
    userInfo() {
      this.getDoctorInfo();
    }
  },
  mounted() {
    this.getDoctorInfo();
  }
};
</script>

<style lang="scss" scoped>
</style>