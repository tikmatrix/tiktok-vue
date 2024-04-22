<template>
  <div class="relative  shadow-2xl border-2 border-solid border-black indicator">
    <div class="flex justify-center items-center">
      <div class="flex flex-col">
        <div class="flex flex-row drag">
          <div class="flex flex-1  justify-center items-center text-center pr-1 pl-1">
            <div class="flex-1 justify-center items-center text-center">
              <span class="text-xs font-bold">{{ index+1 }}</span>
              <span :class="'text-xs'+(task_status == 'RUNNING' ? ' text-green-500' : ' text-red-500')" @click="stop_task" v-if="big"> - {{ task_status }}</span>
            </div>
            <div class="justify-center items-center text-center">
              <span class="text-xs mr-2 font-bold" v-if="big">{{ device.serial }} </span>
              <span class="text-xs">FPS: {{ fps.toFixed(0) }}</span>
            </div>
          </div>
          <button class="btn bg-transparent hover:bg-transparent hover:text-red-500 text-gray-700 float-right border-0 p-4"
            @click="$emitter.emit('closeDevice', this.device)" v-if="big">
            <font-awesome-icon icon="fa fa-times" class="h-4 w-4" />
          </button>
        </div>
        
        <div class="flex flex-row flex-1 ">
          <LeftBars v-if="big" />
          <div>
            <video ref="display" autoplay poster="../../assets/preview.jpg" :class="'flex-1' + (big ? ' w-[320px]':' w-24')"
              @mousedown="mouseDownListener"
              @mouseup="mouseUpListener"
              @mouseleave="mouseLeaveListener"
              @mousemove="mouseMoveListener"></video>
            <BottomBar v-if="big" @send_keycode="send_keycode"/>
          </div>
          <RightBars v-if="big" @send_keycode="send_keycode"/>
          <div class="skeleton absolute w-full h-full bg-opacity-20" v-if="loading"></div>
        </div>
          
      </div>
    </div>
    <div v-if="!big" class="indicator-item indicator-center indicator-middle badge badge-lg badge-neutral bg-opacity-20 font-bold">
      <span >{{ index+1 }}</span>
    </div>
    
  </div>
  
</template>
<script>
import JMuxer from 'jmuxer'
import LeftBars from './LeftBars.vue';
import RightBars from './RightBars.vue';
import BottomBar from './BottomBar.vue';
export default {
  name: 'Miniremote',
  components: {
    LeftBars,
    RightBars,
    BottomBar
  },
  props: {
    max_size: {
      type: Number,
      default: 400
    },
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
      timer_task_status: null,
      jmuxer: null,
      scrcpy: null,
      loading: true,
      task_status: 'IDLE',
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
    get_task_status() {
      this.$service
        .get_task_status({
          serial: this.device.serial
        })
        .then(res => {
          this.task_status = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    stop_task() {
      this.$service
        .stop_task({
          serial: this.device.serial
        })
        .then(res => {
        })
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
        let mydevice=this.device
        mydevice.index=this.index
        this.$emitter.emit('openDevice', mydevice)
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
        this.scrcpy.send(this.max_size)
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
    if (this.big){
      this.timer_task_status = setInterval(() => {
        this.get_task_status()
      }, 1000)
    }
  },
  unmounted() {
    if (this.scrcpy) {
      this.scrcpy.close()
    }
    // this.$emitter.off('syncEventData');
    clearInterval(this.timer_fps)
    clearInterval(this.timer_task_status)
  }
}
</script>
