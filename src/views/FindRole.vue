<template>
  <div class="content">
    <div class="container">
      <div class="comp-sec-wrapper">
        <div class="row">
          <div class="col-md-12 d-flex">
            <div class="card flex-fill">
              <div class="card-header">
                <h4 class="card-title">
                  {{ keyword.role }} - {{ users.length }}
                </h4>
              </div>
              <div class="card-body">
                <span v-if="users.length == 0">No data available</span>
                <ul class="mb-0 ml-4" v-else>
                  <li v-for="(user, index) in users" :key="index">
                    {{ user }}
                  </li>
                </ul>
              </div>
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
  computed: {
    keyword() {
      console.log(this.$store.state.homeSearchKeyword)
      return this.$store.state.homeSearchKeyword
    }
  },
  data() {
    return {
      users: []
    }
  },
  async mounted() {
    this.$vs.loading()
    const { role } = this.keyword
    const users = await db
      .collection('Users')
      .where('role', '==', role)
      .get()
    users.forEach(user => {
      let data = user.data()
      data['id'] = user.id
      const format = `${data.name} (${data.phone})`
      this.users.push(format)
    })

    this.$vs.loading.close()
  }
}
</script>

<style lang="scss" scoped></style>
