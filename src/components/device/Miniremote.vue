<template>
  <div class="indicator w-auto relative  rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-transform duration-100">
    <video ref="display" autoplay poster="../../assets/preview.jpg" class="rounded-2xl w-full"
        @mousedown="mouseDownListener"
        @mouseup="mouseUpListener"
        @mouseleave="mouseLeaveListener"
        @mousemove="mouseMoveListener"
    >
    </video>
    <div class="skeleton absolute w-full h-full top-0 left-0 bg-opacity-20" v-if="loading"></div>
    <div class=" text-white bg-black bg-opacity-50 rounded-lg indicator-item badge">
      <h1 class="font-bold text-lg">{{ index + 1 }}</h1>
    </div>
    
  </div>
</template>
<script>
import JMuxer from 'jmuxer'
import * as util from '../../utils'
export default {
  props: {
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
      console.log("x: ", x, "y: ", y, "w: ", w, "h: ", h, "scaled", scaled)
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
      }else{
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
      if (!this.sync){
        this.$emit('show_device', this.device)
        return
      }
      if (!this.touch) {
        return
      }
      
      this.touchSync('u', event)
      this.touch = false
    },
    mouseLeaveListener(event) {
      if (this.loading) {
        return
      }
      if (!this.touch) {
        return
      }
      if (!this.sync){
        return
      }
      this.touchSync('u', event)
      this.touch = false
    },
    mouseDownListener(event) {
      if (this.loading) {
        return
      }
      if (!this.sync){
        return
      }
      this.touchSync('d', event)
      this.touch = true
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
      this.scrcpy = new WebSocket(util.getWsUrl())
      this.scrcpy.binaryType = 'arraybuffer'
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
