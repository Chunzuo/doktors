<template>
  <div>
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
                    @click="openAddDialog()"
                    >Add User</a
                  >
                </div>
                <div class="row mb-2">
                  <div class="col-4">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search name"
                      v-model="keyword.name"
                    />
                  </div>
                  <div class="col-4">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search phone number"
                      v-model="keyword.phone"
                    />
                  </div>

                  <div class="col-4">
                    <select class="form-control select" v-model="keyword.role">
                      <option value="">All Role</option>
                      <option
                        v-for="(role, index) in roleOptions"
                        :key="`role - ${index}`"
                        :value="role.value"
                        >{{ role.value }}</option
                      >
                    </select>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col text-right">
                    <button class="btn btn-info" @click="getSearchResult">
                      Search
                    </button>
                  </div>
                </div>

                <div class="card card-table mb-0">
                  <div class="card-body">
                    <vs-table pagination max-items="10" :data="filteredList">
                      <template slot="header">
                        <h3 class="p-3">Users</h3>
                      </template>
                      <template slot="thead">
                        <vs-th sort-key="name">Name</vs-th>
                        <vs-th sort-key="phone">Phone Number</vs-th>
                        <vs-th sort-key="role">Role</vs-th>
                        <vs-th></vs-th>
                      </template>

                      <template slot-scope="{ data }">
                        <vs-tr :key="indextr" v-for="(user, indextr) in data">
                          <vs-td>{{ user.name }}</vs-td>

                          <vs-td>{{ user.phone }}</vs-td>

                          <vs-td>
                            <span
                              :class="[
                                'badge badge-pill',
                                getRoleBackground(user.role)
                              ]"
                              >{{ user.role }}</span
                            >
                          </vs-td>
                          <vs-td>
                            <a
                              href="javascript:void(0);"
                              class="btn btn-sm bg-success-light mr-2"
                              @click="editUser(user)"
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
        @close="showModal = false"
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
                >{{ role.value }}</option
              >
            </select>
          </div>
        </div>
      </vs-prompt>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
export default {
  created() {
    this.$store.commit('updateSelectItem', 'UserManagement')
    const role = localStorage.getItem('role')

    if (role != 'userManager') {
      this.$router.push('/')
    }
  },
  data() {
    return {
      userList: [],
      showModal: false,
      newUser: {
        name: '',
        phone: '',
        role: ''
      },
      roleOptions: [
        { label: 'Doctor', value: 'doctor' },
        { label: 'Lab', value: 'lab' },
        { label: 'Pharmacy', value: 'pharmacy' },
        { label: 'Hospital', value: 'hospital' }
      ],
      userIdToDelete: '',
      dialogMode: 0, // 0: Add, 1: Edit
      keyword: {
        name: '',
        phone: '',
        role: ''
      },
      filteredList: []
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.$vs.loading()
      const users = await db.collection('Users').get()
      this.userList = []
      users.docs.forEach(item => {
        let data = item.data()
        data['id'] = item.id
        if (data.role != 'userManager') {
          this.userList.push(data)
        }
      })

      this.$vs.loading.close()
    },
    getRoleBackground(role) {
      if (role == 'patient') {
        return 'bg-info-light'
      } else if (role == 'doctor') {
        return 'bg-success-light'
      } else if (role == 'pharmacy') {
        return 'bg-warning-light'
      } else if (role == 'hospital') {
        return 'bg-danger-light'
      }
      return 'bg-primary-light'
    },
    async addUser() {
      this.$vs.loading()
      if (this.dialogMode == 0) {
        await db.collection('Users').add(this.newUser)
      } else {
        await db
          .collection('Users')
          .doc(this.newUser.id)
          .update(this.newUser)
        await db
          .collection('Doctors')
          .doc(this.newUser.id)
          .update({ phone: this.newUser.phone, name: this.newUser.name })
      }

      this.newUser = {}
      this.$vs.loading.close()
      const notifyMsg =
        this.dialogMode == 0
          ? 'Success in add new user'
          : 'Success in update user'
      this.$vs.notify({
        text: notifyMsg,
        color: 'success'
      })
      this.getUserList()
    },
    openDeleteDialog(userId) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: 'Are you sure delete this user?',
        accept: this.deleteUser
      })
      this.userIdToDelete = userId
    },
    async deleteUser() {
      this.$vs.loading()
      await db
        .collection('Users')
        .doc(this.userIdToDelete)
        .delete()
      this.$vs.loading.close()
      this.$vs.notify({
        color: 'success',
        text: 'The selected user was successfully deleted'
      })
      this.getUserList()
    },
    openAddDialog() {
      this.showModal = true
      this.dialogMode = 0
      this.newUser = {}
    },
    getSearchResult() {
      this.filteredList = this.userList.filter(user => {
        if (
          user.name.includes(this.keyword.name) &&
          user.phone.includes(this.keyword.phone) &&
          user.role.includes(this.keyword.role)
        ) {
          return user
        }
      })
    },
    editUser(user) {
      if (user.role != 'patient') {
        this.$router.push(`/edit-userprofile/${user.id}`)
      } else {
        this.newUser = user
        this.showModal = true
        this.dialogMode = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
