<template>
  <div class="w-full">
    <BatchButtons :devices="devices" />
    <div class="divider"></div>
    <span class="text-lg font-bold ml-2">{{ selection.length }} Devices Selected</span>
    <drag-select v-model="selection">
      <drag-select-option v-for="(item, index) in devices" :value="index+1" :key="index+1">
        {{index+1}}
      </drag-select-option>
    </drag-select>
    <Pagination ref="device_panel" :items="devices" :searchKeys="['serial', 'account']" :showRefBtn="false">
      <template v-slot:buttons>
        <div class="p-2 bg-accent rounded-lg shadow-md ml-2">
            <div class="form-control center">
                <label class="swap swap-flip">
                  <input type="checkbox" @change="toggleUsbTcp" :checked="isTcp" />
                  <div class="swap-on ml-1">
                    <font-awesome-icon icon="fa-solid fa-network-wired" />
                    <kbd class="kbd">TCP</kbd>
                  </div>
                  <div class="swap-off ml-1">
                    <font-awesome-icon icon="fas fa-plug" />
                    <kbd class="kbd">USB</kbd>
                  </div>
                </label>
            </div>
        </div>

        <div class="p-2 bg-base-300 rounded-lg shadow-md ml-2" @click="expand">
          <label class="cursor-pointer label">
            <font-awesome-icon icon="fa-solid fa-expand" />
          </label>
        </div>
       </template>
      <template v-slot:default="slotProps">
      <div class="flex flex-wrap gap-2 p-4">
        <div>
          <Miniremote v-if="selectedIndex>=0"
                :device="devices[selectedIndex]" 
                :index="selectedIndex"
                :sync="true"
                :scrcpy="selectedScrcpy"
                :selectedIndex="selectedIndex"/>
        </div>
        <div class="flex flex-wrap gap-2 flex-1">
          <div
            v-for="(device, index) in devices" 
            :key="device.serial">
            <Miniremote 
              :device="device" 
              :index="index"
              :sync="selection.includes(index+1)"
              @show_device="show_device" />
          </div>
        </div>
      </div>
        <div v-if="slotProps.items.length == 0&&settings.adb_mode=='TCP'" class="p-4">
          <div role="alert" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Plase wait 10 seconds ! System is scanning and connecting your net devices.</span>
          </div>
          
        </div>
        <div v-if="slotProps.items.length == 0&&settings.adb_mode=='USB'"  class="p-4">
          <div role="alert" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>No devices found! Please connect your device via USB!</span>
          </div>
        </div>
      </template>
    </Pagination>
    <Modal :show="currentDevice" @close="handleDeviceClose">
      <Remote :device="currentDevice" />
    </Modal>
  </div>
</template>
<script>
import MyButton from '../Button.vue'
import BatchButtons from './BatchButtons.vue'
import Miniremote from './Miniremote.vue'
import Remote from './Remote.vue'
import Modal from '../Modal.vue'
import Pagination from '../Pagination.vue'
import { inject } from 'vue'
export default {
  name: 'app',
  setup() {
    const devices = inject('devices')

    return { devices: devices.list }
  },
  components: {
    MyButton,
    Miniremote,
    Remote,
    BatchButtons,
    Modal,
    Pagination,
  },
  data() {
    return {
      currentDevice: null,
      settings: {
        adb_mode: ''
      },
      isTcp: false,
      fullscreen: false,
      selectedIndex: -1,
      selection: [],
    }
  },
  
  methods: {
    expand() {
      // fullscreen: fixed top-0 left-0 w-screen h-screen z-10
      if (this.fullscreen) {
        this.$refs.device_panel.$el.classList.remove('w-screen')
        this.$refs.device_panel.$el.classList.remove('h-screen')
        this.$refs.device_panel.$el.classList.remove('fixed')
        this.$refs.device_panel.$el.classList.remove('top-0')
        this.$refs.device_panel.$el.classList.remove('left-0')
        this.$refs.device_panel.$el.classList.remove('z-10')
        this.$refs.device_panel.$el.classList.remove('overflow-y-auto')
        this.fullscreen = false
      }else{
        this.$refs.device_panel.$el.classList.add('w-screen')
        this.$refs.device_panel.$el.classList.add('h-screen')
        this.$refs.device_panel.$el.classList.add('fixed')
        this.$refs.device_panel.$el.classList.add('top-0')
        this.$refs.device_panel.$el.classList.add('left-0')
        this.$refs.device_panel.$el.classList.add('z-10')
        this.$refs.device_panel.$el.classList.add('overflow-y-auto')
        this.fullscreen = true
      }
      
    },
    handleDeviceClose() {
      this.currentDevice = null
    },

    show_device(index,scrcpy) {
      // this.currentDevice = device
      this.selectedIndex = index;
      this.selectedScrcpy = scrcpy;
      console.log(this.selectedIndex)
      this.selection = [index+1]
    },
    get_groups() {
      this.$service
        .get_groups()
        .then(res => {
          this.groups = res.data
          this.devices.forEach(device => {
            device.group_name = this.groups.find(group => group.id === device.group_id)?.name
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    get_settings() {
      this.$service.get_settings().then(res => {
        this.settings = res.data
        this.isTcp = this.settings.adb_mode === 'TCP'
        console.log(this.isTcp)
      })
    },
    toggleUsbTcp() {
      this.isTcp = !this.isTcp
      this.settings.adb_mode = this.isTcp ? 'TCP' : 'USB'
      console.log('adb_mode changed to:', this.settings.adb_mode)
      if (this.settings.adb_mode === 'TCP') {
        this.scan_tcp()
      }
      this.$service
        .update_settings(this.settings)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    scan_tcp() {
      this.$service
        .scan_tcp({})
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.get_settings()
  }
}
</script>
