<template>
  <template v-if="needLogin">
    <Login />
  </template>
  <template v-if="!agentRunning">
    <RunAgentTips />
  </template>
  <div class="flex flex-row items-start bg-base-300 h-screen w-screen" v-else>
    <Sidebar @menu_selected="menu_selected" />
    <div class="flex-1 p-4 rounded-lg">

      <div role="alert" class="alert alert-warning mb-1" v-show="showDemoTip">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="font-bold">{{ $t('demoTip', { email: 'admin@niostack.com' }) }}</span>
        <a class="link link-primary" href="https://t.me/+iGhozoBfAbI5YmE1">{{ $t('demoTip2') }}</a>
      </div>

      <Toast />
      <ManageDevices />
    </div>
  </div>

  <vue-draggable-resizable v-if="device && device.serial" :w="411" :h="677" :resizable="false" :parent="false" :z="20"
    drag-handle=".drag"
    class="bg-base-100 fixed top-16 right-16 border-1 border-base-300 justify-center items-center flex flex-col">
    <Miniremote :device="device" :index="device.index" :big="true" :key="device.serial + '_big'" />
  </vue-draggable-resizable>
  <dialog ref="page_dialog" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="font-bold text-lg">{{ page_title }}</h3>
      <ManageDashboard v-if="selectedItem.name === 'dashboard' && $refs.page_dialog.open" />
      <ManageGroups v-if="selectedItem.name === 'groups' && $refs.page_dialog.open" />
      <ManageAccounts v-if="selectedItem.name === 'accounts' && $refs.page_dialog.open" />
      <ManageAnalytics v-if="selectedItem.name === 'analytics' && $refs.page_dialog.open" />
      <ManageMaterials v-if="selectedItem.name === 'materials' && $refs.page_dialog.open" />
      <ManageComments v-if="selectedItem.name === 'comments' && $refs.page_dialog.open" />
      <ManageProxys v-if="selectedItem.name === 'proxys' && $refs.page_dialog.open" />
      <ManageMusics v-if="selectedItem.name === 'musics' && $refs.page_dialog.open" />
      <ManagePublishJobs v-if="selectedItem.name === 'publishJobs' && $refs.page_dialog.open" />
      <ManageTrainJobs v-if="selectedItem.name === 'trainJobs' && $refs.page_dialog.open" />
      <ManageDialog v-if="selectedItem.name === 'dialogWatcher' && $refs.page_dialog.open" />
      <ManageSettings v-if="selectedItem.name === 'settings' && $refs.page_dialog.open" />
      <ManagePostBots v-if="selectedItem.name === 'postBots' && $refs.page_dialog.open" />
      <ManageEditBots v-if="selectedItem.name === 'editBots' && $refs.page_dialog.open" />
      <EditGroup :group="selectedItem.group" v-if="selectedItem.name === 'editGroup' && $refs.page_dialog.open" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
<style>
@import "vue-draggable-resizable/style.css";
</style>
<script>
import Sidebar from './components/Sidebar.vue'
import ManageDashboard from './components/dashboard/ManageDashboard.vue'
import ManageDevices from './components/device/ManageDevices.vue'
import ManageAccounts from './components/account/ManageAccounts.vue'
import ManageAnalytics from './components/analytics/ManageAnalytics.vue'
import ManageMaterials from './components/material/ManageMaterials.vue'
import ManagePublishJobs from './components/publishJob/ManagePublishJobs.vue'
import ManageDialog from './components/dialog/ManageDialog.vue'
import ManageTrainJobs from './components/trainJob/ManageTrainJobs.vue'
import ManageGroups from './components/group/ManageGroups.vue'
import ManageMusics from './components/music/ManageMusics.vue'
import ManageSettings from './components/settings/ManageSettings.vue'
import ManageComments from './components/comment/ManageComments.vue'
import ManageProxys from './components/proxy/ManageProxys.vue'
import ManagePostBots from './components/virtualHost/ManagePostBots.vue'
import ManageEditBots from './components/virtualHost/ManageEditBots.vue'
import Login from './components/Login.vue'
import RunAgentTips from './components/RunAgentTips.vue'
import Miniremote from './components/device/Miniremote.vue'
import { inject } from 'vue'
import * as util from './utils'
import Toast from './components/Toast.vue'
import EditGroup from './components/group/EditGroup.vue'

export default {
  name: 'app',
  setup() {
    const devices = inject('devices')

    return { devices: devices.list }
  },
  components: {
    Login,
    RunAgentTips,
    Sidebar,
    ManageDashboard,
    ManageDevices,
    ManageAccounts,
    ManageAnalytics,
    ManageMaterials,
    ManagePublishJobs,
    ManageDialog,
    ManageTrainJobs,
    ManageGroups,
    ManageMusics,
    ManageSettings,
    ManageComments,
    ManageProxys,
    ManagePostBots,
    ManageEditBots,
    Miniremote,
    Toast,
    EditGroup
  },
  data() {
    return {
      device: null,
      needLogin: true,
      showDemoTip: false,
      isDark: false,
      selectedItem: {},
      agentRunning: true,
      page_title: ''
    }
  },
  methods: {

    menu_selected(item) {
      this.selectedItem = item
      this.$refs.page_dialog.showModal()
      console.log(this.$refs.page_dialog.open)
      //listener
      this.$refs.page_dialog.addEventListener('close', () => {
        console.log(this.$refs.page_dialog.open)
        console.log('close', (this.selectedItem.name === 'editGroup' && this.$refs.page_dialog.open))
        this.selectedItem = {}

      })
    },
    checkAuth() {
      if (import.meta.env.VITE_APP_MOCK === 'true') {
        this.needLogin = false
        return
      }
      this.$service
        .auth({
          password: util.getCookie('password')
        })
        .then(res => {
          if (res.data === 'success') {
            this.needLogin = false
          } else {
            this.needLogin = true
          }
        })
    },
    logout() {
      this.$service.logout()
      this.needLogin = true
    },
  },
  mounted() {
    // this.checkAuth()
    this.needLogin = false
    this.showDemoTip = import.meta.env.VITE_APP_MOCK === 'true'
    //check this.$apiUrl is ok
    this.$service.get_devices().then(res => {
      this.agentRunning = true
      console.log("agent running")
    }).catch(err => {
      this.agentRunning = false
      console.log("agent not running")
    })
    this.$emitter.on('openDevice', (device) => {
      this.device = device
    });
    this.$emitter.on('closeDevice', (device) => {
      this.device = null
    });
    this.$emitter.on('closePageDialog', (data) => {
      this.$refs.page_dialog.close()
    })

  },
  unmounted() {
  }
}
</script>
