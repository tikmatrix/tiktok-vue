<template>
    <div class=" w-full">
        <div class="w-full p-4 bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <Button @click="upload_material" label="add" />
            <input id="upload_material_input" type="file" v-on:change="on_upload_material" multiple hidden>
        </div>
        <div class="flex flex-wrap align-top">
            <div class="overflow-hidden m-4 border-2 border-black shadow-lg rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 relative"
                v-for="material in materials">
                <div class="bg-blue-500 overflow-hidden whitespace-nowrap absolute right-[-40px] top-[10px] transform rotate-[45deg] shadow-md"
                    v-if="material.used === 0">
                    <span
                        class="border border-blue-600 text-white block font-bold text-base leading-none my-0.5 px-12 text-center text-shadow-md">{{
                            $t('unused') }}</span>
                </div>
                <div class="bg-red-500 overflow-hidden whitespace-nowrap absolute right-[-40px] top-[10px] transform rotate-[45deg] shadow-md"
                    v-else>
                    <span
                        class="border border-red-600 text-white block font-bold text-base leading-none my-0.5 px-12 text-center text-shadow-md">{{
                            $t('used') }}</span>
                </div>
                <template v-if="material.name.endsWith('.mp4') || material.name.endsWith('.webm')">
                    <video @click="show_material(material)" :src="`${material.name}`" class="w-[105px] h-[180px]">
                    </video>
                </template>
                <template v-else>
                    <img @click="show_material(material)" :src="`${material.name}`" class="w-[105px] h-[180px]" />
                </template>
            </div>
        </div>
        <Modal :show="currentMaterial" @close="currentMaterial = null">
            <Detail :material="currentMaterial" @delete="get_materials" />
        </Modal>
    </div>
</template>
<script>
import Detail from './Detail.vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'

export default {
    name: 'app',
    components: {
        Detail,
        Modal,
        Button,
    },
    data() {
        return {
            materials: [],
            currentMaterial: null,
        }
    },
    methods: {
        get_materials() {
            this.currentMaterial = null
            this.$service.get_materials().then(res => {
                console.log(res)
                this.materials = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        show_material(material) {
            console.log(material)
            this.currentMaterial = material

        },
        upload_material() {
            document.getElementById('upload_material_input').click()
        },
        on_upload_material(e) {
            //拼接FormData
            const formData = new FormData()
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i])
                console.log(e.target.files[i])
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            this.$service.upload_material(formData).then(res => {
                console.log(res)
                this.get_materials()
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.get_materials()
    }

}
</script>
  
  