<template>
    <div class="w-full">
        <Pagination :items="accounts" :pageSize="10" searchKey="email">
            <template v-slot:buttons>
                <Button @click="add_account" label="add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="flex flex-wrap align-top">
                    <table class="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border font-bold">{{ $t('email') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('password') }}</th>
                                <!-- <th class="px-4 py-2 border font-bold">{{ $t('shop_creator') }}</th> -->
                                <!-- <th class="px-4 py-2 border font-bold">{{ $t('fans') }}</th> -->
                                <th class="px-4 py-2 border font-bold">{{ $t('device') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('group') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(account, index) in slotProps.items" :key="index"
                                :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                                <td class="px-4 py-2 border">{{ account.email }}</td>
                                <td class="px-4 py-2 border">{{ account.pwd }}</td>
                                <!-- <td class="px-4 py-2 border">{{ parseInt(account.shop_creator) === 0 ? $t('disable') : $t('enable') }}</td> -->
                                <!-- <td class="px-4 py-2 border">{{ account.fans }}</td> -->
                                <td class="px-4 py-2 border">{{ account.device }}</td>
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
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Edit from './Edit.vue'
import Add from './Add.vue'
import Pagination from '../Pagination.vue'

export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Edit,
        Add,
        Pagination
    },
    data() {
        return {
            accounts: [],
            groups: [],
            currentAccount: null,
            showAddAccount: false,
        }
    },
    methods: {
        get_accounts() {
            this.currentAccount = null
            this.$service.get_accounts().then(res => {
                console.log(res)
                this.accounts = res.data
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
                        console.log(account.group_name)
                        return
                    }
                    console.log(account.group_id)
                    account.group_name = this.groups.find(group => group.id === account.group_id).name
                    console.log(account.group_name)
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
