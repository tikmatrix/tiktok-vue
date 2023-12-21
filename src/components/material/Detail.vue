<template>
    <div class="m-4 flex">
        <template v-if="material.name.endsWith('.mp4') || material.name.endsWith('.webm')">
            <video :src="`${material.name}`" class="max-w-[800px] max-h-[800px] rounded-lg" controls>
            </video>
        </template>
        <template v-else>
            <img :src="`${material.name}`" class="max-w-full max-h-screen rounded-lg" />
        </template>
        <div class="m-1">
            <p class="p-1 text-lg font-bold">{{ material.create_time }}</p>
            <Button label="delete" icon="trash" @click="delete_material(material)" />
        </div>
    </div>
</template>
<script>
import Button from '../Button.vue'
export default {
    props: {
        material: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    components: {
        Button
    },
    data() {
        return {
        }
    },
    methods: {
        delete_material() {
            this.$service.delete_material({
                id: this.material.id
            }).then(res => {
                console.log(res)
                this.$emit('delete')
            }).catch(err => {
                console.log(err)
            })
        },
    }

}
</script>