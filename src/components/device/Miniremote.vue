<template>
  <div @click="$emit('show_device', device)" class="relative rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-transform duration-100">
    <video ref="display" autoplay poster="../../assets/preview.jpg" class="rounded-2xl"></video>
    <div class="skeleton absolute w-full h-full top-0 left-0 bg-opacity-20" v-if="loading"></div>
    <div class="absolute top-2 left-2 p-1 text-white bg-black bg-opacity-50 rounded-lg">
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
    }
  },

  data() {
    return {
      img: 'preview.jpg',
      err: '',
      display: null,
      mjpeg: null,
      scrcpy: null,
      loading: true
    }
  },
  methods: {
    syncDisplay() {
      const jmuxer = new JMuxer({
        node: this.$refs.display,
        mode: 'video',
        flushingTime: 1,
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
        this.readonly = false
        this.scrcpy.send(`${this.device.serial}`)
        // max size: 800
        this.scrcpy.send(400)
        // control: false
        this.scrcpy.send('false')
      }
      this.scrcpy.onclose = () => {
        this.readonly = true
        this.img = 'preview.jpg'
      }
      this.scrcpy.onerror = () => {
        this.readonly = true
        this.img = 'preview.jpg'
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
  },
  unmounted() {
    if (this.scrcpy) {
      this.scrcpy.close()
    }
  }
}
</script>
