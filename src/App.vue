<template>
  <template v-if="needLogin">
    <Login />
  </template>
  <div class="drawer lg:drawer-open" v-else>
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex-grow">
      <div
        class="bg-base-100 text-base-content sticky top-0 z-3 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] ">
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
              <li><a href="https://doc.niostack.com" target="_blank">About</a></li>
              <li><a @click="logout">Logout</a></li>
              <li>
                <details>
                  <summary>
                    <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 512 512">
                      <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z">
                      </path>
                      <path
                        d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z">
                      </path>
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
          <p>Copyright © 2024 - All right reserved by niostack.com</p>
        </aside>
      </footer>
    </div>


    <div class="drawer-side z-4">
      <Sidebar @menu_selected="menu_selected" />
    </div>

  </div>
</template>
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
import * as util from './utils'


export default {
  name: 'app',
  components: {
    Login,
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
    ManageEditBots
  },
  data() {
    return {
      needLogin: true,
      showDemoTip: false,
      selectedItem: null
    }
  },

  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.open = false;
    },
    menu_selected(item) {
      this.selectedItem = item.name
    },
    checkAuth() {
      if (import.meta.env.VITE_APP_MOCK === 'true') {
        this.needLogin = false
        return
      }
      this.$service.auth({
        password: util.getCookie('password')
      }).then(res => {
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
    this.checkAuth()
    this.showDemoTip = import.meta.env.VITE_APP_MOCK === 'true';
  }
}
</script>
