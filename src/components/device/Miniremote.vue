<template>
  <div 
  :class="'indicator relative rounded-2xl shadow-2xl cursor-pointer' + (big ? '':' transform hover:scale-105 transition-transform duration-100')">
    <div class="flex">
      <div class="flex flex-col">
        <div class="flex flex-row drag" v-if="big">
          <div class="flex flex-1 justify-center">
            <span class="text-3xl font-bold">{{ device.serial }}</span>
          </div>
          <button class="btn bg-gray-500 hover:bg-gray-700 text-white font-bold rounded float-right"
            @click="$emit('hide_device')">
            <font-awesome-icon icon="fa fa-times" class="h-4 w-4" />
          </button>
        </div>
        <div class="flex flex-row flex-1">
          <LeftBars v-if="big" />
          <span class="indicator-item indicator-center indicator-middle badge badge-secondary bg-opacity-50">
            {{ index + 1 }}
            FPS: {{ fps.toFixed(1) }}
          </span> 
          <video ref="display" autoplay poster="../../assets/preview.jpg" :class="'flex-1 rounded-2xl' + (big ? ' w-[320px]':' w-24')"
              @mousedown="mouseDownListener"
              @mouseup="mouseUpListener"
              @mouseleave="mouseLeaveListener"
              @mousemove="mouseMoveListener">
          </video>
          <RightBars v-if="big" @send_keycode="send_keycode"/>
        </div>
      </div>
    </div>
    
    <div class="skeleton absolute w-full h-full top-0 left-0 bg-opacity-20" v-if="loading"></div>
  </div>
  
</template>
<script>
import JMuxer from 'jmuxer'
import LeftBars from './LeftBars.vue';
import RightBars from './RightBars.vue';
export default {
  name: 'Miniremote',
  components: {
    LeftBars,
    RightBars
  },
  props: {
    big: {
      type: Boolean,
      default: false
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
  },
  data() {
    return {
      rotation: 0,
      fps: 0,
      periodImageCount: 0,
      timer_fps: null,
      jmuxer: null,
      scrcpy: null,
      loading: true,
      input_dialog_title: '',
      input_dialog_text: '',
      input_callback: null
    }
  },
  methods: {
    send_keycode(keycode) {
      this.$emitter.emit('syncEventData',JSON.stringify({
          type: 'keycode',//type=keycode
          operation: 'd',//operation=down
          keycode,
      }));
      setTimeout(() => {
        this.$emitter.emit('syncEventData',JSON.stringify({
          type: 'keycode',//type=keycode
          operation: 'u',//operation=up
          keycode,
      }));
      }, 100);
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
      if (!this.big) {
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
          type: 'touch',
          operation: operation, // u, d, c, w
          x: (scaled.x/scaled.w).toFixed(2), 
          y: (scaled.y/scaled.h).toFixed(2), 
      });
      this.$emitter.emit('syncEventData',data)
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
      if (!this.big) {
        console.log("open device: ",this.device)
        this.$emitter.emit('openDevice', this.device)
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
    connect() {
      this.scrcpy = new WebSocket(import.meta.env.VITE_WS_URL)
      this.scrcpy.binaryType = 'arraybuffer'
      this.scrcpy.onopen = () => {
        console.log(this.index,':onopen')
        this.scrcpy.send(`${this.device.serial}`)
        // max size
        this.scrcpy.send(400)
        // control
        this.scrcpy.send('true')
      }
      this.scrcpy.onclose = () => {
        this.loading = true
        this.jmuxer.reset()
        console.log(this.index,':onclose')
        //sleep 1s
        // setTimeout(() => {
        //   this.connect()
        // })
      }
      this.scrcpy.onerror = () => {
        this.loading = true
        this.jmuxer.reset()
        console.log(this.index,':onerror')
        // setTimeout(() => {
        //   this.connect()
        // })
      }
      this.scrcpy.onmessage = message => {
        this.loading = false
        this.periodImageCount += 1
        this.jmuxer.feed({
          video: new Uint8Array(message.data)
        })
      }
    },
    syncDisplay() {
      if (import.meta.env.VITE_APP_MOCK === 'true'){
        setTimeout(() => {
        this.loading = false
      }, 3000)
        return
      }
      this.loading = true
      this.jmuxer = new JMuxer({
        node: this.$refs.display,
        mode: 'video',
        flushingTime: 1,
        maxDelay: 0,
        fps: 50,
        debug: false,
        onError: function () {
          if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
            jmuxer.reset()
          }
        }
      })
      this.connect()
    }
  },
  mounted() {
    this.syncDisplay()
    this.$emitter.on('syncEventData', (data) => {
      console.log("receive syncEventData: ",data,"this.sync: ",this.sync)
      if (this.sync&&this.scrcpy){
        this.scrcpy.send(data)
      }
    });
    this.timer_fps = setInterval(() => {
      this.fps = this.periodImageCount / 0.5
      this.periodImageCount = 0
    }, 500)
  },
  unmounted() {
    if (this.scrcpy) {
      this.scrcpy.close()
    }
    // this.$emitter.off('syncEventData');
    clearInterval(this.timer_fps)
  }
}
</script>
