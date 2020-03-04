<template>
  <div>
    <div class="breadcrumb-bar">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-12 col-12">
            <h2 class="breadcrumb-title">Help Page</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar"
            sticky-container
          >
            <div
              class="profile-sidebar"
              v-sticky="true"
              sticky-offset="stickyOffset"
            >
              <div class="dashboard-widget">
                <nav class="dashboard-menu">
                  <ul>
                    <li
                      v-for="(data, index) in helpList"
                      :key="`nav-${index}`"
                      :class="{ active: helpSection == `question_${index}` }"
                      @click="helpSection = `question_${index}`"
                    >
                      <a :href="`#question_${index}`">{{ data.question }}</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div class="col-md-7 col-lg-8 col-xl-9">
            <div class="card">
              <div class="card-body">
                <section
                  v-for="(data, index) in helpList"
                  :key="index"
                  :id="`question_${index}`"
                >
                  <h4>{{ data.question }}</h4>
                  <p>{{ data.answer }}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from 'vue-sticky-directive'

export default {
  created() {
    this.$store.commit('updateSelectItem', 'Help')
  },
  computed: {
    helpList() {
      return this.$store.state.webStructure.helpList
    }
  },
  async mounted() {
    if (this.helpList.length == 0) {
      this.$vs.loading()
      await this.$store.dispatch('getWebStructure')
      this.$vs.loading.close()
    }
    this.initJQuery()
  },
  methods: {
    initJQuery() {}
  },
  directives: { Sticky },
  data() {
    return {
      stickyOffset: {
        top: 30
      },
      helpSection: 'question_0'
    }
  }
}
</script>

<style lang="css" scoped>
.content {
  margin-bottom: 80px;
}
</style>
