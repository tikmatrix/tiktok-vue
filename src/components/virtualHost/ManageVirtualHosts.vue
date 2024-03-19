<template>
    <div class="w-full">
        <Pagination :items="virtualHosts" :searchKeys="[ 'name','host']" @refresh="get_virtualHosts">
            <template v-slot:buttons>
                <Button @click="add" label="add" icon="fa fa-add" />
                <Button @click="startAll" label="startAll" icon="fa fa-play" />
                <Button @click="stopAll" label="stopAll" icon="fa fa-stop" />
                <Button @click="initAll" label="initAll" icon="fa fa-refresh" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('host') }}</th>
                                <!-- <th>{{ $t('edit_bot') }}</th> -->
                                <th>{{ $t('post_bot') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in slotProps.items" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <a class="link link-primary" :href="'vnc://'+item.host" target="_blank">vnc://{{ item.host }}</a>
                                </td>
                                <!-- <td class="text-center">
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
                                </td> -->
                                <td class="text-left">
                                    <div class="stats bg-gradient-to-r from-primary to-success text-primary-content">
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('videos') }}</div>
                                            <div class="stat-value">
                                                {{item.status?.video_count || 0}}
                                                <span class="loading loading-spinner text-warning" v-if="item.status?.loading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-success text-white">{{ $t('download_video') }}</button>
                                            </div>
                                        </div>
                                        <div class="stat">
                                            <div class="stat-title text-white">{{item.status?.status == 1 ? $t('running') : $t('stopped') }}</div>
                                            <div class="stat-value">{{format_time(item.status?.uptime || 0)}}
                                                <span class="loading loading-spinner text-warning"  v-if="item.status?.loading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button @click="start_post_bot(item)" class="btn btn-sm btn-primary text-white" 
                                                :disabled="item.status?.loading"
                                                v-if="item.status?.status == 0">
                                                    {{ $t('start_bot') }}
                                                </button>
                                                <button @click="stop_post_bot(item)" class="btn btn-sm btn-error text-white" 
                                                :disabled="item.status?.loading"
                                                v-else>
                                                    {{ $t('stop_bot') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                               

                                <td>
                                    <div class="space-x-4">
                                        <Button label="init" icon="fa fa-refresh" @click="init_virtualHost(item)" />
                                        <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        label="edit" icon="fa fa-edit"
                                            @click="edit(item)" />
                                        <Button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        label="delete" icon="fa fa-trash"
                                            @click="delete_virtualHost(item)" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
    </div>
    <!-- Open the modal using ID.showModal() method -->
    <dialog ref="add_dialog" class="modal">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg">Add new Virtual Host!</h3>
               
                <div class="flex flex-col items-center gap-2 mb-2 w-full">
                    <input class="input input-bordered w-full max-w-xs" placeholder="name" autocomplete="off" v-model="currentVirtualHost.name">
                    <input class="input input-bordered w-full max-w-xs" placeholder="host" autocomplete="off" v-model="currentVirtualHost.host">
                    <input class="input input-bordered w-full max-w-xs" placeholder="port" autocomplete="off" v-model="currentVirtualHost.port">
                    <input class="input input-bordered w-full max-w-xs" placeholder="username" autocomplete="off" v-model="currentVirtualHost.username">
                    <input class="input input-bordered w-full max-w-xs" placeholder="password" autocomplete="off" v-model="currentVirtualHost.password">
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-primary" @click="add_or_update_virtualHost">Save</button>
                    </form>
                </div>
            </div>
        </dialog>
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
            currentVirtualHost: {},
            update_status_timer: null,
        }
    },
    methods: {
        initAll() {
            for (let i = 0; i < this.virtualHosts.length; i++) {
                this.init_virtualHost(this.virtualHosts[i])
            }           
        },
        startAll() {
            for (let i = 0; i < this.virtualHosts.length; i++) {
                this.start_post_bot(this.virtualHosts[i])
            }
        },
        stopAll() {
            for (let i = 0; i < this.virtualHosts.length; i++) {
                this.stop_post_bot(this.virtualHosts[i])
            }
        },
        add() {
            this.currentVirtualHost = {
                name: '',
                host: '',
                port: '22',
                username: '',
                password: '',
            }
            this.$refs.add_dialog.showModal()
        },
        edit(item) {
            this.currentVirtualHost = item
            this.$refs.add_dialog.showModal()
        },
        delete_virtualHost(item) {
            this.$service.delete_virtualHost({
                id: item.id
            }).then(res => {
                console.log(res)
                this.get_virtualHosts()
            })
        },
        init_virtualHost(item) {
            item.status.loading = true
            this.$service.init_virtualHost({
                id: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
            })
        },
        format_time(time) {
            //format seconds to * s or * m or * h
            if (time < 60) {
                return time + ' s'
            } else if (time < 3600) {
                return Math.floor(time / 60) + ' m'
            } else {
                //keep 2 decimal
                return (time / 3600).toFixed(2) + ' h'
            }
        },
        get_virtualHosts() {
            this.$service.get_virtualHosts().then(res => {
                this.virtualHosts = res.data
                //sort by name
                this.virtualHosts.sort((a, b) => {
                    return a.name.localeCompare(b.name)
                })
            }).catch(err => {
                console.log(err)
            })
        },
        add_or_update_virtualHost() {
            this.$service.add_or_update_virtualHost(this.currentVirtualHost).then(res => {
                this.get_virtualHosts()
            }).catch(err => {
                console.log(err)
            })
        },
        start_post_bot(item) {
            item.status.loading = true
            this.$service.start_post_bot({
                id: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
                item.status.status = 1
            }).catch(err => {
                console.log(err)
                item.status.loading = false
            })
        },
        stop_post_bot(item) {
            item.status.loading = true
            this.$service.stop_post_bot({
                id: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
                item.status.status = 0
            }).catch(err => {
                console.log(err)
                item.status.loading = false
            })
        },
        start_editBot() {
            this.$service.start_editBot().then(res => {
                console.log(res)
            })
        },
    },
    mounted() {
        this.get_virtualHosts();
        this.update_status_timer = setInterval(() => {
            for (let i = 0; i < this.virtualHosts.length; i++) {
                if (this.virtualHosts[i].status?.loading) {
                    continue
                }
                !this.virtualHosts[i].status && (this.virtualHosts[i].status = {})
                this.virtualHosts[i].status.loading = true
                this.$service.get_post_bot_status({
                    id: this.virtualHosts[i].id
                }).then(res => {
                    this.virtualHosts[i].status = res.data
                    this.virtualHosts[i].status.loading = false
                }).catch(err => {
                    console.log(err)
                    this.virtualHosts[i].status.loading = false
                })
            }
        },3000)
    },
    unmounted() {
        clearInterval(this.update_status_timer)
    }

}
</script>