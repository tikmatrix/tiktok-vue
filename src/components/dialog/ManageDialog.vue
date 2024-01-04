<template>
    <div class="w-full">
        <Pagination :items="watchers" :pageSize="10" searchKey="conditions">
            <template v-slot:buttons>
                <Button @click="add_watcher" label="add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="flex flex-wrap align-top">
                    <table class="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('conditions') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('action') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('status') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(watcher, index) in slotProps.items" :key="index"
                                :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                                <td class="px-4 py-2 border">{{ watcher.id }}</td>
                                <td class="px-4 py-2 border">{{ watcher.conditions }}</td>
                                <td class="px-4 py-2 border">{{ watcher.action }}</td>
                                <td class="px-4 py-2 border">{{ parseInt(watcher.status) === 0 ? $t('disable') :
                                    $t('enable') }}</td>
                                <td class="px-4 py-2 border space-x-4">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="editWatcher(watcher)">{{ $t('edit') }}</button>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="deleteWatcher(watcher)">{{ $t('delete') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>

        <Modal :show="currentWatcher" @close="currentWatcher = null">
            <Edit :watcher="currentWatcher" @update="updateWatcher" />
        </Modal>
        <Modal :show="showAddWatcher" @close="showAddWatcher = false">
            <Add @add="addWatcher" />
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
            watchers: [],
            currentWatcher: null,
            showAddWatcher: false,
        }
    },
    methods: {
        get_watchers() {
            this.$service.get_watchers().then(res => {
                this.watchers = res.data
            }).catch(err => {
                console.log(err)
            })
        },

        add_watcher() {
            this.showAddWatcher = true
        },
        addWatcher(watcher) {
            this.$service.add_watcher({
                conditions: watcher.conditions,
                action: watcher.action,
                status: watcher.status,
            }).then(res => {
                this.showAddWatcher = false
                this.get_watchers()
            }).catch(err => {
                console.log(err)
            })
        },
        editWatcher(watcher) {
            this.currentWatcher = watcher;
        },
        updateWatcher(watcher) {
            this.$service.update_account({
                id: watcher.id,
                conditions: watcher.conditions,
                action: watcher.action,
                status: watcher.status,
            }).then(res => {
                console.log(res)
                this.currentWatcher = null
                this.get_watchers()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteWatcher(watcher) {
            this.$service.delete_watcher({
                id: watcher.id
            }).then(res => {
                console.log(res)
                this.get_watchers()
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_watchers();

    }

}
</script>
