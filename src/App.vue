<template>
  <template v-if="needLogin">
    <Login />
  </template>
  <template v-if="!agentRunning">
    <RunAgentTips />
  </template>
  <div class="drawer lg:drawer-open" v-else>
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex-grow">
      <div
        class="bg-base-100 text-base-content sticky top-0 z-3 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]"
      >
        <div class="navbar bg-base-100">
          <div class="flex-1 lg:hidden">
            <label for="my-drawer" class="btn btn-square btn-ghost">
              <font-awesome-icon icon="fa-solid fa-bars" />
            </label>
          </div>
          <div class="flex-1 visible lg:invisible">
            <font-awesome-icon icon="fa-brands fa-tiktok" />
            <a class="btn btn-ghost text-xl">{{ $t('siteName') }}</a>
          </div>
          <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
              <li><a href="https://doc.tikmatrix.com" target="_blank">Document</a></li>
              <!-- <li><a @click="logout">Logout</a></li> -->
              <li>
                <label class="swap swap-rotate">
                  <!-- this hidden checkbox controls the state -->
                  <input type="checkbox" class="theme-controller" value="dark" :checked="isDark" @change="toggleTheme" />

                  <!-- sun icon -->
                  <svg class="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                    />
                  </svg>

                  <!-- moon icon -->
                  <svg class="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                    />
                  </svg>
                </label>
              </li>
              <li>
                <details>
                  <summary>
                    <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                      <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"></path>
                      <path
                        d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"
                      ></path>
                    </svg>
                  </summary>
                  <ul class="p-2 bg-base-100 rounded-t-none">
                    <li><a @click="changeLocale('en')">English</a></li>
                    <li><a @click="changeLocale('zh-CN')">中文</a></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div role="alert" class="alert alert-warning mb-1" v-show="showDemoTip">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span class="font-bold">{{ $t('demoTip', { email: 'admin@niostack.com' }) }}</span>
        <a class="link link-primary" href="https://t.me/+iGhozoBfAbI5YmE1">Join Telegram Group</a>
      </div>
      <ManageDashboard v-if="selectedItem === 'dashboard'" />
      <ManageDevices v-if="selectedItem === 'devices'" />
      <ManageGroups v-if="selectedItem === 'groups'" />
      <ManageAccounts v-if="selectedItem === 'accounts'" />
      <ManageAnalytics v-if="selectedItem === 'analytics'" />
      <ManageMaterials v-if="selectedItem === 'materials'" />
      <ManageComments v-if="selectedItem === 'comments'" />
      <ManageProxys v-if="selectedItem === 'proxys'" />
      <ManageMusics v-if="selectedItem === 'musics'" />
      <ManageAvatars v-if="selectedItem === 'avatars'" />
      <ManagePublishJobs v-if="selectedItem === 'publishJobs'" />
      <ManageTrainJobs v-if="selectedItem === 'trainJobs'" />
      <ManageDialog v-if="selectedItem === 'dialogWatcher'" />
      <ManageSettings v-if="selectedItem === 'settings'" />
      <ManagePostBots v-if="selectedItem === 'postBots'" />
      <ManageEditBots v-if="selectedItem === 'editBots'" />

      
      <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2023-2024 - All right reserved by tikmatrix.com</p>
        </aside>
      </footer>
    </div>

    <div class="drawer-side z-4">
      <Sidebar @menu_selected="menu_selected" :selectedItem="selectedItem" />
    </div>
    
  </div>
  <vue-draggable-resizable 
  v-if="device && device.serial"
    :w="411" :h="677" 
    :resizable="false"
    :parent="false"
    :z="5"
    drag-handle=".drag"
    class="bg-base-100 fixed top-16 left-16 border-1 border-base-300 justify-center items-center">
        <Miniremote 
            :max_size="800"
            :device="device" 
            :index="device.index"
            :big="true"
            :sync="true"/>
      </vue-draggable-resizable>
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
import ManageAvatars from './components/avatar/ManageAvatars.vue'
import ManageComments from './components/comment/ManageComments.vue'
import ManageProxys from './components/proxy/ManageProxys.vue'
import ManagePostBots from './components/virtualHost/ManagePostBots.vue'
import ManageEditBots from './components/virtualHost/ManageEditBots.vue'
import Login from './components/Login.vue'
import RunAgentTips from './components/RunAgentTips.vue'
import Miniremote from './components/device/Miniremote.vue'

import * as util from './utils'

export default {
  name: 'app',
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
    ManageAvatars,
    ManageComments,
    ManageProxys,
    ManagePostBots,
    ManageEditBots,
    Miniremote
  },
  data() {
    return {
      device: null,
      needLogin: true,
      showDemoTip: false,
      isDark: false,
      selectedItem: null,
      agentRunning: true,
    }
  },

  methods: {
    loadTheme() {
      this.isDark = localStorage.getItem('theme') === 'dark'
    },
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    changeLocale(locale) {
      this.$i18n.locale = locale
      this.open = false
    },
    menu_selected(item) {
      this.selectedItem = item.name
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
    }
  },
  mounted() {
    this.loadTheme()
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
  },
  unmounted() {
    this.$emitter.off('openDevice');
  }
}
</script>
