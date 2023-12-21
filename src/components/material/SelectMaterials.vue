<template>
    <div class="w-full overflow-x-auto whitespace-nowrap">
        <div class="flex flex-nowrap align-top">
            <div class="m-4 border-2 border-black shadow-lg rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 relative"
                v-for="material in materials">

                <template v-if="material.name.endsWith('.mp4') || material.name.endsWith('.webm')">
                    <video :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none">
                    </video>
                </template>
                <template v-else>
                    <img :src="`${material.name}`" class="w-[100px] h-[100px] max-w-none" />
                </template>
                <button
                    class="absolute top-0 right-0 m-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    @click="$emit('select', material)">+</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'app',
    components: {
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
            this.$service.get_materials_byused({
                used: 0
            }).then(res => {
                console.log(res)
                this.materials = res.data
            }).catch(err => {
                console.log(err)
            })
        },

    },
    mounted() {
        this.get_materials()
    }

}
</script>
  
  