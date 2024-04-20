<template>
  <div 
  :class="'indicator relative rounded-2xl shadow-2xl cursor-pointer' + (selectedIndex == index ? '':' transform hover:scale-105 transition-transform duration-100')">
    <div class="flex">
      <div class="flex flex-col">
        <div class="flex flex-row" v-if="selectedIndex == index">
          <div class="flex flex-1 justify-center">
            <span class="text-3xl font-bold">{{ device.serial }}</span>
          </div>
          <button class="btn bg-gray-500 hover:bg-gray-700 text-white font-bold rounded float-right"
            @click="$emit('hide_device')">
            <font-awesome-icon icon="fa fa-times" class="h-4 w-4" />
          </button>
        </div>
        <div class="flex flex-row flex-1">
          <div class="flex flex-col justify-start" v-if="selectedIndex == index">
            <button class="btn bg-green-500 hover:bg-green-700 text-white font-bold rounded tooltip" :data-tip="$t('openTiktok')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-n', 'com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity']})">
              <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
            </button>
            <button class="btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded tooltip" :data-tip="$t('stopTiktok')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'force-stop', 'com.zhiliaoapp.musically']})">
              <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
            </button>
            <button class="btn bg-red-500 hover:bg-red-700 text-white font-bold rounded tooltip" :data-tip="$t('clearTiktok')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'pm', 'clear', 'com.zhiliaoapp.musically']})">
              <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showTimeSetting')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.settings.DATE_SETTINGS']})">
              <font-awesome-icon icon="fa fa-clock" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showLanguageSetting')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-n', 'com.android.settings/.LanguageSettings']})">
              <font-awesome-icon icon="fa fa-language" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showSimInfo')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.settings.DEVICE_INFO_SETTINGS']})">
              <font-awesome-icon icon="fa fa-mobile" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('openNotification')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '0', '500', '1000']})">
              <font-awesome-icon icon="fa fa-bell" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('enableProxy')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', `${this.settings.proxy_url}`]})">
              <font-awesome-icon icon="fa-solid fa-link" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('disableProxy')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', ':0']})">
              <font-awesome-icon icon="fa-solid fa-unlink" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('openWhoer')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://whoer.net']})">
              <font-awesome-icon icon="fa-brands fa-wikipedia-w" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('ipinfo')"
            @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://ipinfo.io']})">
              <font-awesome-icon icon="fa-solid fa-info" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('enableTCP')"
            @click="$emitter.emit('adbEventData',{args:['tcpip', '5555']})">
              <font-awesome-icon icon="fa-solid fa-network-wired" class="h-4 w-4" />
            </button>
          </div>
          <video ref="display" autoplay poster="../../assets/preview.jpg" :class="'flex-1 rounded-2xl' + (selectedIndex == index ? ' w-[320px]':' w-24')"
              @mousedown="mouseDownListener"
              @mouseup="mouseUpListener"
              @mouseleave="mouseLeaveListener"
              @mousemove="mouseMoveListener">
          </video>
          <div class="flex flex-col justify-start" v-if="selectedIndex == index">
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Home"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'keyevent', 'KEYCODE_HOME']})">
              <font-awesome-icon icon="fa-solid fa-home" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Back"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'keyevent', 'KEYCODE_BACK']})">
              <font-awesome-icon icon="fa fa-reply" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Task"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'keyevent', 'KEYCODE_MENU']})">
              <font-awesome-icon icon="fa fa-window-restore" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Up"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '1000', '500', '500', '300']})">
              <font-awesome-icon icon="fa-arrow-up" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Down"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '500', '500', '1000', '300']})">
              <font-awesome-icon icon="fa-arrow-down" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Left"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input','swipe', '1000', '500', '500', '500', '300' ]})">
              <font-awesome-icon icon="fa-arrow-left" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Right"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input','swipe', '500', '500', '1000', '500', '300']})">
              <font-awesome-icon icon="fa-arrow-right" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Power"
            @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'keyevent', 'KEYCODE_POWER']})">
              <font-awesome-icon icon="fa fa-lightbulb" class="h-4 w-4" />
            </button>
            <button class="btn bg-red-500 hover:bg-red-700 text-white font-bold rounded tooltip" data-tip="Restart"
            @click="$emitter.emit('adbEventData',{args:['shell', 'reboot']})">
              <font-awesome-icon icon="fa fa fa-refresh" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Upload"
            @click="uploadVideo">
              <font-awesome-icon icon="fa fa-upload" class="h-4 w-4" />
              <input id="upload_video_input" type="file" v-on:change="on_upload_video" multiple hidden />

            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Input Text"
            @click="show_text_input_dialog">
              <font-awesome-icon icon="fa fa-keyboard" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="ADB"
            @click="show_adb_input_dialog">
              <font-awesome-icon icon="fa fa-terminal" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="skeleton absolute w-full h-full top-0 left-0 bg-opacity-20" v-if="loading"></div>
    <div class=" text-white bg-black bg-opacity-50 rounded-lg indicator-item badge">
      <h1 class="font-bold text-lg">{{ index + 1 }}</h1>
    </div>
    <dialog ref="input_dialog" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg">{{ input_dialog_title }}</h3>
        <label class="input input-bordered flex items-center gap-2 my-4">
          <input type="text" class="grow" placeholder="" v-model="input_dialog_text" v-on:keyup.enter="input_callback" />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-primary" @click="input_callback">Enter</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
  
</template>
<script>
import JMuxer from 'jmuxer'
export default {
  props: {
    selectedIndex: {
      type: Number,
      default: -1
    },
    index: {
      type: Number,
      default: 0
    },
    device: {
      type: Object,
      default: () => {
        return {}
      }
    },
    sync: {
      type: Boolean,
      default: false
    },
    scrcpy_from_other: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      rotation: 0,
      scrcpy: null,
      loading: true,
      input_dialog_title: '',
      input_dialog_text: '',
      input_callback: null
    }
  },
  methods: {
    show_text_input_dialog() {
      this.$refs.input_dialog.showModal()
      this.input_dialog_title = 'Input Text'
      this.input_callback = this.post_input_dialog
    },
    show_adb_input_dialog() {
      this.$refs.input_dialog.showModal()
      this.input_dialog_title = 'ADB Input'
      this.input_callback = this.post_adb_input_dialog
    },
    post_input_dialog() {
      let encodedText = btoa(this.input_dialog_text)
      this.$emitter.emit('adbEventData',{args:['shell', 'am', 'broadcast', '-a', 'ADB_INPUT_TEXT', '--es', 'text', `"${encodedText}"`]})
      this.input_dialog_text = ''
      this.$refs.input_dialog.close()
    },
    post_adb_input_dialog() {
      let args = this.input_dialog_text.split(' ')
      this.$emitter.emit('adbEventData',{args:args})
      this.input_dialog_text = ''
      this.$refs.input_dialog.close()
    },
    uploadVideo() {
      document.getElementById('upload_video_input').click()
    },
    on_upload_video(e) {
      const formData = new FormData()
      formData.append('serial', this.mydevice.serial)
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('files', e.target.files[i])
      }
      this.$service
        .upload_video(formData)
        .then(() => {})
        .catch(err => {
          console.log(err)
        })
    },
    coords(boundingW, boundingH, relX, relY, rotation) {
      var w, h, x, y
      switch (rotation) {
        case 0:
          w = boundingW
          h = boundingH
          x = relX
          y = relY
          break
        case 90:
          w = boundingH
          h = boundingW
          x = boundingH - relY
          y = relX
          break
        case 180:
          w = boundingW
          h = boundingH
          x = boundingW - relX
          y = boundingH - relY
          break
        case 270:
          w = boundingH
          h = boundingW
          x = relY
          y = boundingW - relX
          break
      }
      return { x, y, w, h }
    },
    touchSync(operation, event) {
      if (this.selectedIndex != this.index) {
        return
      }
      var e = event
      if (e.originalEvent) {
        e = e.originalEvent
      }
      e.preventDefault()
      let x = e.offsetX,
        y = e.offsetY
      let w = e.target.clientWidth,
        h = e.target.clientHeight
      let scaled = this.coords(w, h, x, y, this.rotation)
      let data = JSON.stringify({
          operation: operation, // u, d, c, w
          x: scaled.x,
          y: scaled.y,
          w: scaled.w,
          h: scaled.h
      });
      if (this.sync) {
        console.log("send data: ",data)
        this.$emitter.emit('syncEventData',data)
      }else if (this.scrcpy) {
        this.scrcpy.send(data)
      }
    },
    mouseMoveListener(event) {
      if (this.loading) {
        return
      }
      if (!this.touch) {
        return
      }
      if (!this.sync){
        return
      }
      this.touchSync('m', event)
    },
    mouseUpListener(event) {
      if (!this.touch) {
        return
      }
      this.touch = false
      if (this.selectedIndex != this.index) {
        this.$emit('show_device', this.index,this.scrcpy)
        return
      }
      this.touchSync('u', event)
    },
    mouseLeaveListener(event) {
      if (this.loading) {
        return
      }
      if (!this.touch) {
        return
      }
      this.touch = false
      if (!this.sync){
        return
      }
      this.touchSync('u', event)
      
    },
    mouseDownListener(event) {
      if (this.loading) {
        return
      }
      this.touch = true
      this.touchSync('d', event)
    },
    syncDisplay() {
      if (import.meta.env.VITE_APP_MOCK === 'true'){
        setTimeout(() => {
        this.loading = false
      }, 3000)
        return
      }

      this.loading = true
      const jmuxer = new JMuxer({
        node: this.$refs.display,
        mode: 'video',
        flushingTime: 0,
        maxDelay: 0,
        fps: 30,
        debug: false,
        onError: function () {
          if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
            jmuxer.reset()
          }
        }
      })
      if (!this.scrcpy_from_other) {
        this.scrcpy = new WebSocket(import.meta.env.VITE_WS_URL)
        this.scrcpy.binaryType = 'arraybuffer'
      }else{
        this.scrcpy = this.scrcpy_from_other
      }
      this.scrcpy.onopen = () => {
        this.scrcpy.send(`${this.device.serial}`)
        // max size
        this.scrcpy.send(400)
        // control
        this.scrcpy.send('true')
      }
      this.scrcpy.onclose = () => {
        this.loading = true
        jmuxer.reset()
        console.log('onclose')
      }
      this.scrcpy.onerror = () => {
        this.loading = true
        jmuxer.reset()
        console.log('onerror')
      }
      this.scrcpy.onmessage = message => {
        this.loading = false
        jmuxer.feed({
          video: new Uint8Array(message.data)
        })
      }
    }
  },
  mounted() {
    this.syncDisplay()
    this.$emitter.on('syncEventData', (data) => {
      console.log(this.sync,"->receive syncEventData: ",data)
      if (this.sync&&this.scrcpy){
        this.scrcpy.send(data)
      }
    });
  },
  unmounted() {
    if (this.scrcpy) {
      this.scrcpy.close()
    }
    this.$emitter.off('syncEventData');
  }
}
</script>
