<template>
    <div class=" w-full">
        <Pagination :items="materials" :pageSize="10" :searchKeys="['name']" @refresh="get_materials">
            <template v-slot:buttons>
                <!-- <Button @click="create_material" label="add" /> -->
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('status') }}</th>
                                <th>{{ $t('preview') }}</th>
                                <th>{{ $t('group') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(material, index) in slotProps.items" :key="index">
                                <td>{{ material.id }}</td>
                                <td>{{ material.name }}</td>
                                <td>
                                    <div class="badge badge-success" v-if="material.used == '0'"> {{ $t('unused') }}
                                    </div>
                                    <div class="badge badge-error" v-else> {{ $t('used') }} </div>
                                </td>
                                <td @click="show_material(material)">
                                    <div class="cursor-pointer">
                                        <template v-if="material.name.endsWith('.mp4') || material.name.endsWith('.webm')">
                                            <video :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none">
                                            </video>
                                        </template>
                                        <template v-else>
                                            <img :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none" />
                                        </template>
                                    </div>
                                </td>
                                <td>{{ material.group_name }}</td>
                                <td>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="delete_material(material)">{{ $t('delete') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>

        <Modal :show="showDetailView" @close="showDetailView = false">
            <Detail :material="currentMaterial" />
        </Modal>
    </div>
</template>
<script>
import Detail from './Detail.vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'

export default {
    name: 'app',
    components: {
        Detail,
        Modal,
        Button,
        Pagination
    },
    data() {
        return {
            materials: [],
            groups: [],
            currentMaterial: null,
            showDetailView: false,
        }
    },
    methods: {
        get_materials() {
            this.currentMaterial = null
            this.$service.get_materials().then(res => {
                this.materials = res.data
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },
        show_material(material) {
            this.showDetailView = true
            this.currentMaterial = material

        },
        delete_material(material) {
            this.$service.delete_material({
                id: material.id
            }).then(res => {
                this.get_materials()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.materials.forEach(material => {
                    if (material.group_id === 0) {
                        material.group_name = this.$t('defaultGroup')
                        return
                    }
                    material.group_name = this.groups.find(group => group.id === material.group_id).name
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_materials();

    }

}
</script>
  
  