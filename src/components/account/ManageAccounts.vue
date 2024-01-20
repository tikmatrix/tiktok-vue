<template>
    <div class="w-full">
        <Pagination :items="accounts" :pageSize="10" :searchKeys="['email', 'username', 'device']" @refresh="get_accounts">
            <template v-slot:buttons>
                <Button @click="add_account" label="add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="flex flex-wrap align-top">
                    <table class="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('email') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('password') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('shopCreator') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('username') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('fans') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('earnings') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('device') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('status') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('group') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(account, index) in slotProps.items" :key="index"
                                :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                                <td class="px-4 py-2 border">{{ account.id }}</td>
                                <td class="px-4 py-2 border">{{ account.email }}</td>
                                <td class="px-4 py-2 border">{{ account.pwd }}</td>
                                <td class="px-4 py-2 border">
                                    <span v-if="parseInt(account.shop_creator) === 0" class=" m-1">{{
                                        $t('disable') }}</span>
                                    <span v-else-if="parseInt(account.shop_creator) === 1" class="text-green-500 m-1">{{
                                        $t('enable') }}</span>
                                    <span v-else-if="parseInt(account.shop_creator) === 2" class="text-red-500 m-1">{{
                                        $t('block') }}</span>
                                </td>
                                <td class="px-4 py-2 border">{{ account.username }}</td>
                                <td class="px-4 py-2 border">{{ account.fans }}</td>
                                <td class="px-4 py-2 border">{{ account.earnings }}</td>
                                <td class="px-4 py-2 border">
                                    <a class="cursor-pointer underline text-blue-500"
                                        @click="show_device(account.device)">{{ account.device }}</a>
                                </td>
                                <td class="px-4 py-2 border">
                                    <span v-if="account.online" class="text-green-500 m-1">{{ $t('online') }}</span>
                                    <span v-else class="text-red-500 m-1">{{ $t('offline') }}</span>
                                </td>
                                <td class="px-4 py-2 border">{{ account.group_name }}</td>
                                <td class="px-4 py-2 border space-x-4">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="editAccount(account)">{{ $t('edit') }}</button>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="deleteAccount(account)">{{ $t('delete') }}</button>
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
        get_devices() {
            this.$service.get_devices().then(res => {
                this.devices = res.data
                this.accounts.forEach(account => {
                    account.online = this.devices.find(device => device.serial === account.device)
                })
            }).catch(err => {
                console.log(err)
            })
        },
        get_accounts() {
            this.currentAccount = null
            this.$service.get_accounts().then(res => {
                console.log(res)
                this.accounts = res.data
                this.get_devices();
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
                shop_creator: Number(account.shop_creator),
                group_id: account.group_id,
            }).then(res => {
                console.log(res)
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
                shop_creator: Number(account.shop_creator),
                group_id: account.group_id,
            }).then(res => {
                console.log(res)
                this.get_accounts()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteAccount(account) {
            this.$service.delete_account({
                id: account.id
            }).then(res => {
                console.log(res)
                this.get_accounts()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.accounts.forEach(account => {
                    if (account.group_id === 0) {
                        account.group_name = this.$t('defaultGroup')
                        return
                    }
                    account.group_name = this.groups.find(group => group.id === account.group_id).name
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
