<template>
  <div 
  :class="'indicator relative rounded-2xl shadow-2xl cursor-pointer' + (selectedIndex == index ? '':' transform hover:scale-105 transition-transform duration-100')">
    <div class="flex">
      <div class="flex flex-col">
        <div class="flex flex-row" v-if="selectedIndex == index">
          <div class="flex flex-1 justify-center">
            <span class="text-3xl font-bold">{{ device.serial }}</span>
          </div>
          <button class="btn bg-gray-500 hover:bg-gray-700 text-white font-bold rounded float-right">
            <font-awesome-icon icon="fa fa-times" class="h-4 w-4" />
          </button>
        </div>
        <div class="flex flex-row flex-1">
          <video ref="display" autoplay poster="../../assets/preview.jpg" :class="'flex-1 rounded-2xl' + (selectedIndex == index ? ' w-[320px]':' w-24')"
              @mousedown="mouseDownListener"
              @mouseup="mouseUpListener"
              @mouseleave="mouseLeaveListener"
              @mousemove="mouseMoveListener">
          </video>
          <div class="flex flex-col justify-center" v-if="selectedIndex == index">
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Home">
              <font-awesome-icon icon="fa-solid fa-home" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Back">
              <font-awesome-icon icon="fa fa-reply" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Task">
              <font-awesome-icon icon="fa fa-window-restore" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Up">
              <font-awesome-icon icon="fa-arrow-up" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Down">
              <font-awesome-icon icon="fa-arrow-down" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Left">
              <font-awesome-icon icon="fa-arrow-left" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Right">
              <font-awesome-icon icon="fa-arrow-right" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Power">
              <font-awesome-icon icon="fa fa-lightbulb" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Restart">
              <font-awesome-icon icon="fa fa fa-repeat" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Upload">
              <font-awesome-icon icon="fa fa-upload" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Input Text">
              <font-awesome-icon icon="fa fa-keyboard" class="h-4 w-4" />
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="ADB">
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
    scrcpy: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      rotation: 0,
      scrcpy: null,
      loading: true
    }
  },
  methods: {
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
      if (!this.sync){
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
      if (!this.scrcpy) {
        this.scrcpy = new WebSocket(import.meta.env.VITE_WS_URL)
        this.scrcpy.binaryType = 'arraybuffer'
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
      console.log("receive data: ",data)
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
