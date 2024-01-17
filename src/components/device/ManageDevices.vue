<template>
    <div class=" w-full">
        <Pagination :items="devices" :pageSize="5" searchKey="serial">
            <template v-slot:buttons>
                <BatchButtons @get_devices="get_devices" />
            </template>
            <template v-slot:default="slotProps">
                <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <Miniremote v-for="(device, index) in slotProps.items" :device="device" :index="device.id"
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

export default {
    name: 'app',
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
            devices: [],
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
        get_devices() {
            this.$service.get_devices().then(res => {
                this.devices = res.data
                this.get_accounts();
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
        get_accounts() {
            this.$service.get_accounts().then(res => {
                this.accounts = res.data
                this.devices.forEach(device => {
                    device.account = this.accounts.find(account => account.device === device.serial)?.username
                })
                //append group_id to device
                this.devices.forEach(device => {
                    device.group_id = this.accounts.find(account => account.device === device.serial)?.group_id
                })
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                //append group_name to device
                this.devices.forEach(device => {
                    device.group_name = this.groups.find(group => group.id === device.group_id)?.name
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_devices()
    },


}
</script>

  