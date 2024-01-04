<template>
    <div class="w-full">
        <Pagination :items="groups" :pageSize="10" searchKey="email">
            <template v-slot:buttons>
                <Button @click="add_group" label="add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="flex flex-wrap align-top">
                    <table class="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('name') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('autoPublish') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('autoTrain') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(group, index) in slotProps.items" :key="index"
                                :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                                <td class="px-4 py-2 border">{{ group.id }}</td>
                                <td class="px-4 py-2 border">{{ group.name }}</td>
                                <td class="px-4 py-2 border">{{ parseInt(group.auto_publish) === 0 ? $t('disable') :
                                    $t('enable') }}</td>
                                <td class="px-4 py-2 border">{{ parseInt(group.auto_train) === 0 ? $t('disable') :
                                    $t('enable') }}</td>
                                <td class="px-4 py-2 border space-x-4">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="editgroup(group)">{{ $t('edit') }}</button>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="deletegroup(group)">{{ $t('delete') }}</button>
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="addMaterial(group)">{{ $t('addMaterial') }}: {{ group.unused_material_count
                                        }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
        <input id="upload_material_input" type="file" v-on:change="on_upload_material" multiple hidden>
        <Modal :show="showEditGroup" @close="showEditGroup = false">
            <Edit :group="currentGroup" @update="updateGroup" />
        </Modal>
        <Modal :show="showAddGroup" @close="showAddGroup = false">
            <Add @add="addgroup" />
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
            groups: [],
            currentGroup: null,
            showAddGroup: false,
            showEditGroup: false,
        }
    },
    methods: {
        get_groups() {
            this.showEditGroup = false
            this.showAddGroup = false
            this.currentGroup = null
            this.$service.get_groups().then(res => {
                console.log(res)
                this.groups = res.data
                for (let i = 0; i < this.groups.length; i++) {
                    this.get_unused_material_count(this.groups[i])
                }
            }).catch(err => {
                console.log(err)
            })
        },
        add_group() {
            this.showAddGroup = true
        },
        addgroup(group) {

            this.$service.add_group({
                name: group.name,
                auto_train: Number(group.auto_train),
                auto_publish: Number(group.auto_publish),
                publish_start_time: group.publish_start_time,
                train_start_time: group.train_start_time,
                title: group.title,
                tags: group.tags,
            }).then(res => {
                console.log(res)
                this.showAddGroup = false
                this.get_groups()
            }).catch(err => {
                console.log(err)
            })
        },
        editgroup(group) {
            this.showEditGroup = true;
            this.currentGroup = group
        },
        updateGroup(group) {

            this.$service.update_group({
                id: group.id,
                name: group.name,
                auto_train: Number(group.auto_train),
                auto_publish: Number(group.auto_publish),
                publish_start_time: group.publish_start_time,
                train_start_time: group.train_start_time,
                title: group.title,
                tags: group.tags,
            }).then(res => {
                console.log(res)
                this.get_groups()
            }).catch(err => {
                console.log(err)
            })
        },
        deletegroup(group) {
            this.$service.delete_group({
                id: group.id
            }).then(res => {
                console.log(res)
                this.get_groups()
            }).catch(err => {
                console.log(err)
            })
        },

        addMaterial(group) {
            this.currentGroup = group
            document.getElementById('upload_material_input').click()
        },
        on_upload_material(e) {
            const formData = new FormData()
            formData.append('group_id', this.currentGroup.id)
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i])
            }
            this.$service.upload_material(formData).then(res => {
                console.log(res)
                this.get_unused_material_count(this.currentGroup)
            }).catch(err => {
                console.log(err)
            })
        },
        get_unused_material_count(group) {
            this.$service.get_material_count({
                group_id: group.id,
                used: 0
            }).then(res => {
                group.unused_material_count = res.data
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_groups()
    }

}
</script>
