<template>
    <div class=" w-full">
        <Pagination :items="devices" :pageSize="16" :searchKeys="['serial', 'account']" @refresh="get_devices">
            <template v-slot:buttons>
                <BatchButtons />
            </template>
            <template v-slot:default="slotProps">
                <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 p-4">
                    <Miniremote v-for="(device, index) in slotProps.items" :device="device" :index="index"
                        :key="device.serial" @show_device="show_device" @show_shell="show_shell" />
                </div>
            </template>
        </Pagination>
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
import Pagination from '../Pagination.vue'
import { inject } from 'vue';
export default {
    name: 'app',
    setup() {
        const devices = inject('devices');

        return { devices: devices.list };
    },
    components: {
        Miniremote,
        Remote,
        BatchButtons,
        Button,
        Modal,
        Pagination
    },
    data() {
        return {
            currentDevice: null,
            currentShell: null,
        }
    },

    methods: {
        handleDeviceClose() {
            this.currentDevice = null;
        },
        handleShellClose() {
            this.currentShell = null;
        },

        show_device(device) {
            this.currentDevice = device

        },
        show_shell(device) {
            this.currentShell = device
        },

        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.devices.forEach(device => {
                    device.group_name = this.groups.find(group => group.id === device.group_id)?.name
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
    }


}
</script>

  