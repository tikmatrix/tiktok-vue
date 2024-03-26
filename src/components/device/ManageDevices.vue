<template>
    <div class=" w-full">
        <BatchButtons />
        <Pagination :items="devices" :searchKeys="['serial', 'account']" @refresh="get_devices">
            <template v-slot:default="slotProps">
                <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 p-4">
                    <Miniremote v-for="(device, index) in slotProps.items" :device="device" :index="index"
                        :key="device.serial" @show_device="show_device" />
                </div>
            </template>
        </Pagination>
        <Modal :show="currentDevice" @close="handleDeviceClose">
            <Remote :device="currentDevice" />
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
        }
    },

    methods: {
        handleDeviceClose() {
            this.currentDevice = null;
        },


        show_device(device) {
            this.currentDevice = device

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