<template>
    <div class="w-full">
        <Pagination :items="musics" :pageSize="10" :searchKeys="['release_name', 'artist_name']" @refresh="get_musics">
            <template v-slot:buttons>
                <Button @click="add_music" label="add" />
            </template>
            <template v-slot:default="slotProps">
                <div class="flex flex-wrap align-top">
                    <table class="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('artistName') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('releaseName') }}</th>
                                <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(music, index) in slotProps.items" :key="index"
                                :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                                <td class="px-4 py-2 border">{{ music.id }}</td>
                                <td class="px-4 py-2 border">{{ music.artist_name }}</td>
                                <td class="px-4 py-2 border">{{ music.release_name }}</td>
                                <td class="px-4 py-2 border space-x-4">
                                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        @click="editmusic(music)">{{ $t('edit') }}</button>
                                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        @click="deletemusic(music)">{{ $t('delete') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
        <input id="upload_material_input" type="file" v-on:change="on_upload_material" multiple hidden>
        <Modal :show="showEditMusic" @close="showEditMusic = false">
            <Edit :music="currentMusic" @update="updateMusic" />
        </Modal>
        <Modal :show="showAddMusic" @close="showAddMusic = false">
            <Add @add="addmusic" />
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
            musics: [],
            currentMusic: null,
            showAddMusic: false,
            showEditMusic: false,
        }
    },
    methods: {
        get_musics() {
            this.showEditMusic = false
            this.showAddMusic = false
            this.currentMusic = null
            this.$service.get_musics().then(res => {
                console.log(res)
                this.musics = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        add_music() {
            this.showAddMusic = true
        },
        addmusic(music) {

            this.$service.add_music({
                release_name: music.release_name,
                artist_name: music.artist_name,
            }).then(res => {
                console.log(res)
                this.showAddMusic = false
                this.get_musics()
            }).catch(err => {
                console.log(err)
            })
        },
        editmusic(music) {
            this.showEditMusic = true;
            this.currentMusic = music
        },
        updateMusic(music) {

            this.$service.update_music({
                id: music.id,
                release_name: music.release_name,
                artist_name: music.artist_name,
            }).then(res => {
                console.log(res)
                this.get_musics()
            }).catch(err => {
                console.log(err)
            })
        },
        deletemusic(music) {
            this.$service.delete_music({
                id: music.id
            }).then(res => {
                console.log(res)
                this.get_musics()
            }).catch(err => {
                console.log(err)
            })
        },

    },
    mounted() {
        this.get_musics()
    }

}
</script>
