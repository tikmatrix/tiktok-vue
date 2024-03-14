<template>
    <div class="w-full">
        <Pagination :items="accounts" :searchKeys="['email', 'username', 'device', 'device_index']" @refresh="get_accounts">
            <template v-slot:buttons>
                <Button @click="add_account" label="add" icon="fa fa-add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('email') }}</th>
                                <th>{{ $t('username') }}</th>
                                <th>{{ $t('fans') }}</th>
                                <th>{{ $t('device') }}</th>
                                <th>{{ $t('group') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(account, index) in slotProps.items" :key="index">
                                <td>{{ account.id }}</td>
                                <td>{{ account.email }}</td>
                                <td>
                                    <a class="link link-primary" :href="`https://www.tiktok.com/${account.username}`" target="_blank">{{ account.username }}</a>
                                </td>
                                <td>{{ account.fans }}</td>
                                
                                <td>
                                    <a class="cursor-pointer underline text-blue-500"
                                        @click="show_device(account.device)">{{ account.device_index }} - {{ account.device }}</a>
                                </td>

                                <td>{{ account.group_name }}</td>
                                <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="editAccount(account)">{{ $t('edit') }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deleteAccount(account)">{{ $t('delete') }}</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>

        <Modal :show="currentAccount" @close="currentAccount = null">
            <Edit :account="currentAccount" @update="updateAccount" />
        </Modal>
        <Modal :show="showAddAccount" @close="showAddAccount = false">
            <Add @add="addAccount" />
        </Modal>
        
        <Modal :show="currentDevice" @close="handleDeviceClose">
            <Remote :device="currentDevice" />
        </Modal>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Edit from './Edit.vue'
import Add from './Add.vue'
import Pagination from '../Pagination.vue'
import Remote from '../device/Remote.vue'
import { inject } from 'vue';
export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Edit,
        Add,
        Pagination,
        Remote
    },
    setup() {
        const devices = inject('devices');
        return { devices: devices.list };
    },
    data() {
        return {
            accounts: [],
            groups: [],
            devices: [],
            currentAccount: null,
            showAddAccount: false,
            currentDevice: null,
        }
    },
    methods: {
        handleDeviceClose() {
            this.currentDevice = null;
        },
        show_device(device) {
            this.currentDevice = this.devices.find(d => d.serial === device)
        },

        get_accounts() {
            this.currentAccount = null
            this.$service.get_accounts().then(res => {
                this.accounts = res.data
                this.accounts.forEach(account => {
                    let device_index = this.devices.findIndex(device => device.serial === account.device);
                    account.device_index = device_index+1;
                })
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },
        add_account() {
            this.showAddAccount = true
        },
        addAccount(account) {
            this.$service.add_account({
                email: account.email,
                pwd: account.pwd,
                fans: account.fans,
                device: account.device,
                group_id: account.group_id,
                username: account.username,
            }).then(res => {
                this.showAddAccount = false
                this.get_accounts()
            }).catch(err => {
                console.log(err)
            })
        },
        editAccount(account) {
            this.currentAccount = account;
        },
        updateAccount(account) {
            this.$service.update_account({
                id: account.id,
                email: account.email,
                pwd: account.pwd,
                fans: account.fans,
                device: account.device,
                group_id: account.group_id,
                username: account.username,
            }).then(res => {
                this.get_accounts()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteAccount(account) {
            this.$service.delete_account({
                id: account.id
            }).then(res => {
                this.get_accounts()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.accounts.forEach(account => {
                    let group = this.groups.find(group => group.id === account.group_id);
                    account.group_name = group ? group.name : 'Group not found';
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_accounts();

    }

}
</script>
