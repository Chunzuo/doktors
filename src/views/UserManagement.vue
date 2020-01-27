<template>
  <div>
    <div class="content">
      <div class="col-md-12 col-lg-12 col-xl-12 dct-appoinment">
        <div class="card">
          <div class="card-body pt-0">
            <div class="tab-content">
              <div>
                <div class="text-right">
                  <a href="javascript:;" class="add-new-btn" @click="openAddDialog()">Add User</a>
                </div>
                <div class="card card-table mb-0">
                  <div class="card-body">
                    <!-- <div class="table-responsive">
                      <table class="table table-hover table-center mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Phone number</th>
                            <th>Role</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(user, index) in userList" :key="index">
                            <td>{{user.name}}</td>
                            <td>{{user.phone}}</td>
                            <td>
                              <span
                                :class="['badge badge-pill', getRoleBackground(user.role)]"
                              >{{user.role}}</span>
                            </td>
                            <td class="text-right">
                              <div class="table-action">
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm bg-success-light mr-2"
                                  @click="openEditDialog(user)"
                                >
                                  <i class="far fa-edit"></i> Edit
                                </a>
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm bg-danger-light"
                                  @click="openDeleteDialog(user.id)"
                                >
                                  <i class="far fa-trash-alt"></i> Delete
                                </a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>-->

                    <vs-table search pagination max-items="10" :data="userList">
                      <template slot="header">
                        <h3 class="p-3">Users</h3>
                      </template>
                      <template slot="thead">
                        <vs-th sort-key="name">Name</vs-th>
                        <vs-th sort-key="phone">Phone Number</vs-th>
                        <vs-th sort-key="role">Role</vs-th>
                        <vs-th></vs-th>
                      </template>

                      <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(user, indextr) in data">
                          <vs-td>{{user.name}}</vs-td>

                          <vs-td>{{user.phone}}</vs-td>

                          <vs-td>
                            <span
                              :class="['badge badge-pill', getRoleBackground(user.role)]"
                            >{{user.role}}</span>
                          </vs-td>
                          <vs-td>
                            <a
                              href="javascript:void(0);"
                              class="btn btn-sm bg-success-light mr-2"
                              @click="openEditDialog(user)"
                              v-if="user.role != 'patient'"
                            >
                              <i class="far fa-edit"></i> Edit
                            </a>
                            <a
                              href="javascript:void(0);"
                              class="btn btn-sm bg-danger-light"
                              @click="openDeleteDialog(user.id)"
                            >
                              <i class="far fa-trash-alt"></i> Delete
                            </a>
                          </vs-td>
                        </vs-tr>
                      </template>
                    </vs-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <vs-prompt
        @cancel="showModal = false"
        @accept="addUser"
        @close="showModal=false"
        :active.sync="showModal"
        :title="dialogMode == 0 ? 'Add User' : 'Edit User'"
      >
        <div class="modal-body">
          <div class="form-group">
            <label>Name</label>
            <input class="form-control" v-model="newUser.name" />
          </div>
          <div class="form-group">
            <label>Phone number</label>
            <input class="form-control" v-model="newUser.phone" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select class="form-control select" v-model="newUser.role">
              <option
                v-for="(role, index) in roleOptions"
                :key="`role - ${index}`"
                :value="role.value"
              >{{role.value}}</option>
            </select>
          </div>
        </div>
      </vs-prompt>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  created() {
    this.$store.commit("updateSelectItem", "UserManagement");
  },
  data() {
    return {
      userList: [],
      showModal: false,
      newUser: {
        name: "",
        phone: "",
        role: ""
      },
      roleOptions: [
        { label: "Doctor", value: "doctor" },
        { label: "Lab", value: "lab" },
        { label: "Pharmacy", value: "pharmacy" },
        { label: "Hospital", value: "hospital" }
      ],
      userIdToDelete: "",
      dialogMode: 0, // 0: Add, 1: Edit
      users: [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          website: "hildegard.org"
        },
        {
          id: 2,
          name: "Ervin Howell",
          username: "Antonette",
          email: "Shanna@melissa.tv",
          website: "anastasia.net"
        },
        {
          id: 3,
          name: "Clementine Bauch",
          username: "Samantha",
          email: "Nathan@yesenia.net",
          website: "ramiro.info"
        },
        {
          id: 4,
          name: "Patricia Lebsack",
          username: "Karianne",
          email: "Julianne.OConner@kory.org",
          website: "kale.biz"
        },
        {
          id: 5,
          name: "Chelsey Dietrich",
          username: "Kamren",
          email: "Lucio_Hettinger@annie.ca",
          website: "demarco.info"
        },
        {
          id: 6,
          name: "Mrs. Dennis Schulist",
          username: "Leopoldo_Corkery",
          email: "Karley_Dach@jasper.info",
          website: "ola.org"
        },
        {
          id: 7,
          name: "Kurtis Weissnat",
          username: "Elwyn.Skiles",
          email: "Telly.Hoeger@billy.biz",
          website: "elvis.io"
        },
        {
          id: 8,
          name: "Nicholas Runolfsdottir V",
          username: "Maxime_Nienow",
          email: "Sherwood@rosamond.me",
          website: "jacynthe.com"
        },
        {
          id: 9,
          name: "Glenna Reichert",
          username: "Delphine",
          email: "Chaim_McDermott@dana.io",
          website: "conrad.com"
        },
        {
          id: 10,
          name: "Clementina DuBuque",
          username: "Moriah.Stanton",
          email: "Rey.Padberg@karina.biz",
          website: "ambrose.net"
        }
      ]
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      this.$vs.loading();
      const users = await db.collection("Users").get();
      this.userList = [];
      users.docs.forEach(item => {
        let data = item.data();
        data["id"] = item.id;
        if (data.role != "userManager") {
          this.userList.push(data);
        }
      });
      this.$vs.loading.close();
    },
    getRoleBackground(role) {
      if (role == "patient") {
        return "bg-info-light";
      } else if (role == "doctor") {
        return "bg-success-light";
      } else if (role == "pharmacy") {
        return "bg-warning-light";
      } else if (role == "hospital") {
        return "bg-danger-light";
      }
      return "bg-primary-light";
    },
    async addUser() {
      this.$vs.loading();
      if (this.dialogMode == 0) {
        await db.collection("Users").add(this.newUser);
      } else {
        await db
          .collection("Users")
          .doc(this.newUser.id)
          .update(this.newUser);
      }

      this.newUser = {};
      this.$vs.loading.close();
      const notifyMsg =
        this.dialogMode == 0
          ? "Success in add new user"
          : "Success in update user";
      this.$vs.notify({
        text: notifyMsg,
        color: "success"
      });
      this.getUserList();
    },
    openDeleteDialog(userId) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this user?",
        accept: this.deleteUser
      });
      this.userIdToDelete = userId;
    },
    async deleteUser() {
      this.$vs.loading();
      await db
        .collection("Users")
        .doc(this.userIdToDelete)
        .delete();
      this.$vs.loading.close();
      this.$vs.notify({
        color: "success",
        text: "The selected user was successfully deleted"
      });
      this.getUserList();
    },
    openEditDialog(user) {
      this.newUser = user;
      this.showModal = true;
      this.dialogMode = 1;
    },
    openAddDialog() {
      this.showModal = true;
      this.dialogMode = 0;
      this.newUser = {};
    }
  }
};
</script>

<style lang="scss" scoped>
</style>