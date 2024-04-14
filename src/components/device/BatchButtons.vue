<template>
  <div class="w-full p-4">
    <details class="collapse collapse-arrow bg-base-200">
      <summary class="collapse-title text-xl font-medium">{{ $t('batchAction') }}</summary>
      <div class="collapse-content">
        <input id="app_install_input" type="file" v-on:change="on_app_install" hidden />
        <MyButton icon="fa fa-upload" @click="app_install" label="installApk" />
        <MyButton icon="fa fa-trash" @click="app_uninstall" label="uninstallApk" />
        <MyButton label="1080x1920" icon="fa-solid fa-mobile" @click="adb_command(['shell', 'wm', 'size', '1080x1920'])" />
        <MyButton label="320" icon="fa-solid fa-mobile" @click="adb_command(['shell', 'wm', 'density', '320'])" />
        <MyButton label="back" icon="fa-solid fa-chevron-left" @click="adb_command(['shell', 'input', 'keyevent', 'KEYCODE_BACK'])" />
        <MyButton label="home" icon="fa-solid fa-home" @click="adb_command(['shell', 'input', 'keyevent', 'KEYCODE_HOME'])" />
        <MyButton label="wakeup" icon="fa-solid fa-mobile-screen" @click="adb_command(['shell', 'input', 'keyevent', 'KEYCODE_WAKEUP'])" />
        <MyButton label="sleep" icon="fa-solid fa-mobile" @click="adb_command(['shell', 'input', 'keyevent', 'KEYCODE_SLEEP'])" />
        <MyButton
          label="openTiktok"
          icon="fa-brands fa-tiktok"
          @click="adb_command(['shell', 'am', 'start', '-n', 'com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity'])"
        />
        <MyButton label="stopTiktok" icon="fa-brands fa-tiktok" @click="adb_command(['shell', 'am', 'force-stop', 'com.zhiliaoapp.musically'])" />
        <MyButton label="enableProxy" icon="fa-solid fa-link" @click="enable_proxy" />
        <MyButton label="disableProxy" icon="fa-solid fa-unlink" @click="adb_command(['shell', 'settings', 'put', 'global', 'http_proxy', ':0'])" />
        <MyButton label="showLanguageSetting" icon="fa-solid fa-trash" @click="adb_command(['shell', 'am', 'start', '-n', 'com.android.settings/.LanguageSettings'])" />
        <MyButton label="showTimeSetting" icon="fa-solid fa-clock" @click="adb_command(['shell', 'am', 'start', '-a', 'android.settings.DATE_SETTINGS'])" />
        <MyButton label="showSimInfo" icon="fa-solid fa-sim-card" @click="adb_command(['shell', 'am', 'start', '-a', 'android.settings.DEVICE_INFO_SETTINGS'])" />
        <MyButton label="openNotification" icon="fa-solid fa-bell" @click="adb_command(['shell', 'input', 'swipe', '500', '0', '500', '1000'])" />
        <MyButton label="openWhoer" icon="fa-brands fa-wikipedia-w" @click="adb_command(['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://whoer.net'])" />
        <MyButton label="ipinfo" icon="fa-solid fa-info" @click="adb_command(['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://ipinfo.io'])" />
        <MyButton label="enableTCP" icon="fa-solid fa-link" @click="adb_command(['tcpip', '5555'])" />
        <MyButton @click="script('connect_wifi')" label="connectWifi" icon="fa-solid fa-wifi" />
        <MyButton @click="script('unlock')" label="unlock" icon="fa-solid fa-unlock" />
        <MyButton @click="script('disconnect_wifi')" label="disconnectWifi" icon="fa-solid fa-wifi" />
        <MyButton @click="script('torch_on')" label="torchOn" icon="fa-solid fa-lightbulb" />
        <MyButton @click="script('torch_off')" label="torchOff" icon="fa-solid fa-power-off" />
        <MyButton @click="script('clear_notification')" label="clearNotification" icon="fa-solid fa-bell-slash" />
        <MyButton @click="script('clear_tasks')" label="clearTasks" icon="fa-solid fa-trash" />
        <MyButton @click="script('match_account')" label="matchAccount" icon="fa-solid fa-user-plus" />
        <MyButton label="rebootAll" color="btn-error" icon="fa-solid fa-power-off" @click="adb_command(['shell','reboot'])" />
      </div>
    </details>
  </div>
</template>
<script>
import { adb_command } from '@/service'
import MyButton from '../Button.vue'
export default {
  name: 'BatchButtons',
  props: {
    devices: {
      type: Array,
      required: true
    },
  },
  components: {
    MyButton
  },
  data() {
    return {
      settings: {}
    }
  },
  methods: {
    enable_proxy() {
      this.adb_command(['shell', 'settings', 'put', 'global', 'http_proxy', `${this.settings.proxy_url}`])
      for (let i = 0; i < this.devices.length; i++) {
        this.$service.get_ip({
          serial: this.devices[i].serial,
        })
        .then(res => {
          this.$service.enable_proxy_rule({
            serial: this.devices[i].serial,
            ip: res.data
          })
          .then(res => {
            console.log(res)
          })
        })
       
        
      }
      
    },
    adb_command(args) {
      this.$service
        .adb_command({
          serials: this.devices.map(device => device.serial),
          args: args
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    app_install() {
      document.getElementById('app_install_input').click()
    },
    on_app_install(event) {
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.$service
        .install(formData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    app_uninstall() {
      // 弹出输入框让用户输入包名
      let packageName = window.prompt('请输入包名')
      if (packageName) {
        this.adb_command(['shell', 'pm', 'uninstall', packageName])
      } else {
        console.log('未输入包名')
      }
    },
    script(name, args=[]) {
      this.$service
        .script({
          name: name,
          serials: this.devices.map(device => device.serial),
          args: args
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    get_settings() {
      this.$service.get_settings().then(res => {
        this.settings = res.data
      })
    }
  },
  mounted() {
    this.get_settings()
  }
}
</script>
