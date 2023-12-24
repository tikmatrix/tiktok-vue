<template>
  <Sidebar class="fixed top-0 bottom-0 overflow-auto w-64" @menu_selected="menu_selected" />
  <div class="flex-grow ml-64">
    <ManageDevices v-if="selectedItem === 'devices'" />
    <ManageGroups v-if="selectedItem === 'groups'" />
    <ManageAccounts v-if="selectedItem === 'accounts'" />
    <ManageMaterials v-if="selectedItem === 'materials'" />
    <ManageJobs v-if="selectedItem === 'autoPublish'" />
    <ManageTrain v-if="selectedItem === 'autoTrain'" />
    <ManageDialog v-if="selectedItem === 'dialogWatcher'" />
  </div>
</template>
<script>
import Sidebar from './components/Sidebar.vue'
import ManageDevices from './components/device/ManageDevices.vue'
import ManageAccounts from './components/account/ManageAccounts.vue'
import ManageMaterials from './components/material/ManageMaterials.vue'
import ManageJobs from './components/job/ManageJobs.vue'
import ManageDialog from './components/dialog/ManageDialog.vue'
import ManageTrain from './components/train/ManageTrain.vue'
import ManageGroups from './components/group/ManageGroups.vue'


export default {
  name: 'app',
  components: {
    Sidebar,
    ManageDevices,
    ManageAccounts,
    ManageMaterials,
    ManageJobs,
    ManageDialog,
    ManageTrain,
    ManageGroups
  },
  data() {
    return {
      selectedItem: null
    }
  },
  methods: {
    menu_selected(item) {
      console.log(item)
      this.selectedItem = item.name
    }
  },
  mounted() {
  }
}
</script>

