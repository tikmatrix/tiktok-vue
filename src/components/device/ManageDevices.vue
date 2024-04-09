<template>
  <div class="w-full">
    <BatchButtons :devices="devices" />
    <Pagination :items="devices" :searchKeys="['serial', 'account']" @refresh="get_devices">
      <template v-slot:buttons>
        <div class="p-2 bg-base-200 rounded-lg shadow-md ml-2">
            <div class="form-control">
                <label class="label cursor-pointer">
                    <kbd class="kbd">{{ settings.adb_mode }}</kbd>
                    <input ref="adb_model_input" name="toggle" type="checkbox" class="toggle ml-2" v-model="settings.adb_mode"
                        true-value="TCP" false-value="USB" @change="update_setting"/>
                    <MyButton label="Scan TCP" icon="fa-solid fa-wifi" @click="scan_tcp" v-if="settings.adb_mode=='TCP'"/>
                </label>
            </div>
        </div>
       </template>
      <template v-slot:default="slotProps">
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 p-4">
          <Miniremote v-for="(device, index) in slotProps.items" :device="device" :index="index" :key="device.serial" @show_device="show_device" />
        </div>
        <div v-if="slotProps.items.length == 0&&settings.adb_mode=='TCP'" class="p-4">
          <div role="alert" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>No devices found! Please connect your device via TCP!</span>
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
    Pagination
  },
  data() {
    return {
      currentDevice: null,
      settings: {
        adb_mode: ''
      }
    }
  },
  
  methods: {
    handleDeviceClose() {
      this.currentDevice = null
    },

    show_device(device) {
      this.currentDevice = device
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
      })
    },
    update_setting() {
      console.log('adb_mode changed to:', this.settings.adb_mode)
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
