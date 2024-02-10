<template>
    <div class=" w-full">
        <Pagination :items="avatars" :pageSize="10" :searchKeys="['name']" @refresh="get_avatars">
            <template v-slot:buttons>
                <Button @click="add_avatar" label="add" icon="fa fa-add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('preview') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(avatar, index) in slotProps.items" :key="index">
                                <td>{{ avatar.id }}</td>
                                <td>{{ avatar.name }}</td>
                                <td>
                                    <div class="avatar">
                                        <div class="w-24 rounded-full">
                                            <img :src="`${avatar.name}`" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="delete_avatar(avatar)">{{ $t('delete') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
        <input id="upload_avatar_input" type="file" v-on:change="on_upload_avatar" multiple hidden>
    </div>
</template>
<script>
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'

export default {
    name: 'app',
    components: {
        Button,
        Pagination
    },
    data() {
        return {
            avatars: [],
        }
    },
    methods: {
        get_avatars() {
            this.$service.get_avatars().then(res => {
                console.log(res)
                this.avatars = res.data
            }).catch(err => {
                console.log(err)
            })
        },

        delete_avatar(avatar) {
            this.$service.delete_avatar({
                id: avatar.id
            }).then(res => {
                console.log(res)
                this.$emit('delete')
            }).catch(err => {
                console.log(err)
            })
        },
        add_avatar() {
            document.getElementById('upload_avatar_input').click()
        },
        on_upload_avatar(e) {
            const formData = new FormData()
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i])
            }
            this.$service.upload_avatar(formData).then(res => {
                console.log(res)
                this.get_avatars()
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_avatars();

    }

}
</script>
  
  