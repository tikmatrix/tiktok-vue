<template>
    <div class=" w-full">
        <Pagination :items="materials" :pageSize="10" :searchKeys="['name']" @refresh="get_materials">
            <template v-slot:buttons>
                <!-- <Button @click="create_material" label="add" /> -->
            </template>
            <template v-slot:default="slotProps">
                <table class="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('name') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('status') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('preview') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('group') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(material, index) in slotProps.items" :key="index"
                            :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                            <td class="px-4 py-2 border">{{ material.id }}</td>
                            <td class="px-4 py-2 border">{{ material.name }}</td>
                            <td class="px-4 py-2 border" :class="{
                                'text-green-500': material.used === 0,
                                'text-red-500': material.used === 1,
                            }">
                                {{ {
                                    0: $t('unused'), 1: $t('used')
                                }[material.used] }}
                            </td>
                            <td class="px-4 py-2 border cursor-pointer" @click="show_material(material)">
                                <template v-if="material.name.endsWith('.mp4') || material.name.endsWith('.webm')">
                                    <video :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none">
                                    </video>
                                </template>
                                <template v-else>
                                    <img :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none" />
                                </template>
                            </td>
                            <td class="px-4 py-2 border">{{ material.group_name }}</td>
                            <td class="px-4 py-2 border space-x-4">
                                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    @click="delete_material(material)">{{ $t('delete') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                console.log(res)
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
                console.log(res)
                this.$emit('delete')
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
  
  