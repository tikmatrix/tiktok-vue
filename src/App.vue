<template>
  <Sidebar class="fixed top-0 bottom-0 overflow-auto lg:w-64 lg:p-2 w-0 p-0" @menu_selected="menu_selected" />
  <div class="flex-grow lg:ml-64 ml-0">
    <ManageDevices v-if="selectedItem === 'devices'" />
    <ManageGroups v-if="selectedItem === 'groups'" />
    <ManageAccounts v-if="selectedItem === 'accounts'" />
    <ManageMaterials v-if="selectedItem === 'materials'" />
    <ManageMusics v-if="selectedItem === 'musics'" />
    <ManagePublishJobs v-if="selectedItem === 'autoPublish'" />
    <ManageTrainJobs v-if="selectedItem === 'autoTrain'" />
    <ManageDialog v-if="selectedItem === 'dialogWatcher'" />
  </div>
</template>
<script>
import Sidebar from './components/Sidebar.vue'
import ManageDevices from './components/device/ManageDevices.vue'
import ManageAccounts from './components/account/ManageAccounts.vue'
import ManageMaterials from './components/material/ManageMaterials.vue'
import ManagePublishJobs from './components/publishJob/ManagePublishJobs.vue'
import ManageDialog from './components/dialog/ManageDialog.vue'
import ManageTrainJobs from './components/trainJob/ManageTrainJobs.vue'
import ManageGroups from './components/group/ManageGroups.vue'
import ManageMusics from './components/music/ManageMusics.vue'


export default {
  name: 'app',
  components: {
    Sidebar,
    ManageDevices,
    ManageAccounts,
    ManageMaterials,
    ManagePublishJobs,
    ManageDialog,
    ManageTrainJobs,
    ManageGroups,
    ManageMusics
  },
  data() {
    return {
      selectedItem: null
    }
  },
  methods: {
    menu_selected(item) {
      this.selectedItem = item.name
    }
  },
  mounted() {
  }
}
</script>

