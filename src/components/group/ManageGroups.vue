<template>
    <div class="w-full">
        <Pagination :items="groups" :searchKeys="['name']" @refresh="get_groups">
            <template v-slot:buttons>
                <Button @click="add_group" label="add" icon="fa fa-add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('autoTrain') }}</th>
                                <th>{{ $t('autoPublish') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(group, index) in slotProps.items" :key="index">
                                <td>{{ group.id }}</td>
                                <td>{{ group.name }}</td>
                                <td>
                                    <div class="badge badge-success" v-if="group.auto_train == '1'"> {{ $t('enable') }}
                                    </div>
                                    <div class="badge badge-error" v-else> {{ $t('disable') }} </div>
                                </td>
                                <td>
                                    <div class="badge badge-success" v-if="group.auto_publish == '1'"> {{ $t('enable') }}
                                    </div>
                                    <div class="badge badge-error" v-else> {{ $t('disable') }} </div>
                                </td>

                                <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="editgroup(group)">{{ $t('edit') }}</button>
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="addMaterial(group)">{{ $t('addMaterial') }}: {{
                                                group.unused_material_count
                                            }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deletegroup(group)">{{ $t('delete') }}</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
        <input id="upload_material_input" type="file" v-on:change="on_upload_material" multiple hidden>
        <Modal :show="showMoal" @close="showMoal = false">
            <Add :group="currentGroup || defaultGroup" @update="updateGroup" @add="addgroup" />
        </Modal>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Add from './Add.vue'
import Pagination from '../Pagination.vue'

export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Add,
        Pagination
    },
    data() {
        return {
            groups: [],
            currentGroup: null,
            showMoal: false,
            defaultGroup: {
                name: '',
                auto_train: 0,
                train_start_time: '00:00',
                auto_publish: 0,
                publish_start_time: '00:00',
                publish_type: 1,
                title: '',
                product_link: '',
                floow_probable: 50,
                like_probable: 50,
                collect_probable: 50,
            },
        }
    },
    methods: {
        get_groups() {
            this.showMoal = false
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
            this.showMoal = true
        },
        addgroup(group) {

            this.$service.add_group({
                name: group.name,
                auto_train: Number(group.auto_train),
                auto_publish: Number(group.auto_publish),
                publish_start_time: group.publish_start_time,
                train_start_time: group.train_start_time,
                title: group.title,
                publish_type: Number(group.publish_type),
                product_link: group.product_link,
                floow_probable: Number(group.floow_probable),
                like_probable: Number(group.like_probable),
                collect_probable: Number(group.collect_probable),

            }).then(res => {
                this.showMoal = false
                this.get_groups()
            }).catch(err => {
                console.log(err)
            })
        },
        editgroup(group) {
            this.showMoal = true;
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
                publish_type: Number(group.publish_type),
                product_link: group.product_link,
                floow_probable: Number(group.floow_probable),
                like_probable: Number(group.like_probable),
                collect_probable: Number(group.collect_probable),

            }).then(res => {
                this.get_groups()
            }).catch(err => {
                console.log(err)
            })
        },
        deletegroup(group) {
            this.$service.delete_group({
                id: group.id
            }).then(res => {
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
