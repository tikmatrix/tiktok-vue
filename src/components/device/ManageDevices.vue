<template>
    <div class=" w-full">
        <BatchButtons @get_devices="get_devices" class="sticky top-0 z-10" />
        <p class="font-bold">{{ $t('totalDevices') }}: {{ devices.length }}</p>
        <Button @click="prevPage" :disabled="currentPage <= 1" label="previous" :loading-time=300 />
        <Button @click="nextPage" :disabled="currentPage >= pageCount" label="next" :loading-time=300 />
        <input v-model="searchSerial" :placeholder="$t('enterDeviceSerial')"
            class="w-full p-3 my-2 border-2 border-gray-300 rounded" />
        <div class="flex flex-wrap align-top">
            <Miniremote v-for="(device, index) in paginatedDevices" :device="device"
                :index="(currentPage - 1) * pageSize + index + 1" :key="device.serial" @show_device="show_device"
                @show_shell="show_shell" />
        </div>
        <Modal :show="currentDevice" @close="handleDeviceClose">
            <Remote :device="currentDevice" />
        </Modal>
        <Modal :show="currentShell" @close="handleShellClose">
            <iframe class="m-4 w-[90vh] h-[80vh] overflow-hidden"
                :src="`http://${this.currentShell.agent_ip}:${this.currentShell.forward_port}/term`"></iframe>
        </Modal>
    </div>
</template>
<script>
import BatchButtons from './BatchButtons.vue'
import Miniremote from './Miniremote.vue'
import Remote from './Remote.vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'

export default {
    name: 'app',
    components: {
        Miniremote,
        Remote,
        BatchButtons,
        Button,
        Modal,
    },
    data() {
        return {
            devices: [],
            currentDevice: null,
            currentShell: null,
            currentPage: 1,
            pageSize: 5,
            searchSerial: '',
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.devices.length / this.pageSize);
        },
        paginatedDevices() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            if (this.searchSerial) {
                return this.devices.filter(device => device.serial.includes(this.searchSerial)).slice(start, end);
            } else {
                return this.devices.slice(start, end);
            }

        }
    },
    methods: {

        handleDeviceClose() {
            this.currentDevice = null;
        },
        handleShellClose() {
            this.currentShell = null;
        },
        get_devices() {
            this.$service.get_devices().then(res => {
                this.devices = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        show_device(device) {
            this.currentDevice = device

        },
        show_shell(device) {
            this.currentShell = device

        },
        nextPage() {
            if (this.currentPage < this.pageCount) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    },
    mounted() {
        this.get_devices()
    },


}
</script>
  
  