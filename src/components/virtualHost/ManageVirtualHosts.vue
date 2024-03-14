<template>
    <div class="w-full">
        <Pagination :items="virtualHosts" :searchKeys="[ 'host']" @refresh="get_virtualHosts">
            <template v-slot:buttons>
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('host') }}</th>
                                <th>{{ $t('edit_bot') }}</th>
                                <th>{{ $t('post_bot') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in slotProps.items" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <a class="link link-primary">{{ item.host }}</a>
                                </td>
                                <td class="text-center">
                                        <div class="stats bg-gradient-to-r from-primary to-success text-primary-content">
                                            <div class="stat">
                                                <div class="stat-title text-white">{{ $t('background') }}</div>
                                                <div class="stat-value">99</div>
                                                <div class="stat-actions">
                                                    <button class="btn btn-sm btn-success text-white">{{ $t('upload_background') }}</button>
                                                </div>
                                            </div>
                                            
                                            <div class="stat">
                                                <div class="stat-title text-white">{{ $t('overlay') }}</div>
                                                <div class="stat-value">3</div>
                                                <div class="stat-actions">
                                                    <button class="btn btn-sm btn-success text-white">{{ $t('upload_overlay') }}</button>
                                                </div>
                                            </div>
                                            <div class="stat">
                                                <div class="stat-title text-white">{{ $t('running') }}</div>
                                                <div class="stat-value">12h</div>
                                                <div class="stat-actions">
                                                    <button class="btn btn-sm btn-error text-white">{{ $t('stop_bot') }}</button>
                                                </div>
                                            </div>
                                        </div>
                                </td>
                                <td class="text-center">
                                    <div class="stats bg-gradient-to-r from-primary to-success text-primary-content">
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('videos') }}</div>
                                            <div class="stat-value">99</div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-success text-white">{{ $t('download_video') }}</button>
                                            </div>
                                        </div>
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('running') }}</div>
                                            <div class="stat-value">12h</div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-error text-white">{{ $t('stop_bot') }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                               

                                <!-- <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="editAnalytics(item)">{{ $t('edit') }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deleteAnalytics(item)">{{ $t('delete') }}</button>
                                    </div>
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'
export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Pagination,
    },
    data() {
        return {
            virtualHosts: [],
            currentVirtualHost: null,
            showAdd: false,
        }
    },
    methods: {
        get_virtualHosts() {
            this.currentVirtualHost = null
            this.$service.get_virtualHosts().then(res => {
                console.log(res)
                this.virtualHosts = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        start_multiLogin() {
            this.$service.start_multiLogin().then(res => {
                console.log(res)
            })
        },
        start_editBot() {
            this.$service.start_editBot().then(res => {
                console.log(res)
            })
        },
        start_postBot() {
            this.$service.start_postBot().then(res => {
                console.log(res)
            })
        }
        
       
    },
    mounted() {
        this.get_virtualHosts();
    }

}
</script>
