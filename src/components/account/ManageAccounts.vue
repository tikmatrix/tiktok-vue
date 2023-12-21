<template>
    <div class="w-full">
        <div ref="header" class="w-full p-4 bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <Button @click="add_account" label="add" />
        </div>
        <table class="w-full text-left table-auto border-collapse">
            <thead :style="{ top: `${headerHeight - 3}px` }" class="sticky bg-white z-10">
                <tr>
                    <th class="px-4 py-2 border font-bold">{{ $t('email') }}</th>
                    <!-- <th class="px-4 py-2 border font-bold">{{ $t('password') }}</th> -->
                    <!-- <th class="px-4 py-2 border font-bold">{{ $t('shop_creator') }}</th> -->
                    <th class="px-4 py-2 border font-bold">{{ $t('autoTrain') }}</th>
                    <!-- <th class="px-4 py-2 border font-bold">{{ $t('fans') }}</th> -->
                    <th class="px-4 py-2 border font-bold">{{ $t('device') }}</th>
                    <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(account, index) in accounts" :key="index"
                    :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                    <td class="px-4 py-2 border">{{ account.email }}</td>
                    <!-- <td class="px-4 py-2 border">{{ account.pwd }}</td> -->
                    <!-- <td class="px-4 py-2 border">{{ parseInt(account.shop_creator) === 0 ? $t('disable') : $t('enable') }}</td> -->
                    <td class="px-4 py-2 border">{{ parseInt(account.automated) === 0 ? $t('disable') : $t('enable') }}</td>
                    <!-- <td class="px-4 py-2 border">{{ account.fans }}</td> -->
                    <td class="px-4 py-2 border">{{ account.device }}</td>
                    <td class="px-4 py-2 border space-x-4">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            @click="editAccount(account)">{{ $t('edit') }}</button>
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            @click="deleteAccount(account)">{{ $t('delete') }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
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

export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Edit,
        Add
    },
    data() {
        return {
            headerHeight: 0,
            accounts: [],
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
                automated: Number(account.automated),
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
                email: account.email,
                pwd: account.pwd,
                fans: account.fans,
                device: account.device,
                shop_creator: Number(account.shop_creator),
                automated: Number(account.automated),
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
        }
    },
    mounted() {
        this.headerHeight = this.$refs.header.offsetHeight;
        this.get_accounts()
    }

}
</script>
