<template>
    <div class="w-full">
        <Pagination :items="virtualHosts" :searchKeys="['name', 'host']" @refresh="get_virtualHosts">
            <template v-slot:buttons>
                <Button @click="add" label="add" icon="fa fa-add" />
                <Button @click="startAll" label="startAll" icon="fa fa-play" :showLoading="startAllLoading" />
                <Button @click="stopAll" label="stopAll" icon="fa fa-stop" :showLoading="stopAllLoading" />
                <Button @click="initAll" label="initAll" icon="fa fa-refresh" :showLoading="initAllLoading" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('name') }}</th>
                                <th>{{ $t('host') }}</th>
                                <th>{{ $t('bot') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in slotProps.items" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <a class="link link-primary" :href="'vnc://' + item.host" target="_blank">
                                        vnc://{{ item.host }}</a>
                                </td>
                                <td class="text-left" v-if='item.bot_type == "1"'>

                                    <div class="stats bg-gradient-to-r from-primary to-success text-primary-content">
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('background') }}</div>
                                            <div class="stat-value">{{ item.status.background_video_count }}
                                                <span class="loading loading-spinner text-warning"
                                                    v-if="item.status?.uploading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-success text-white"
                                                    :disabled="item.status?.uploading"
                                                    @click="upload_background(item)">{{ $t('upload') }}

                                                </button>
                                            </div>
                                            <input ref="upload_input_background" type="file"
                                                v-on:change="on_upload_background" multiple hidden>
                                        </div>

                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('overlay') }}</div>
                                            <div class="stat-value">{{ item.status.overlay_video_count }}
                                                <span class="loading loading-spinner text-warning"
                                                    v-if="item.status?.uploading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-success text-white"
                                                    :disabled="item.status?.uploading" @click="upload_overlay(item)">
                                                    {{ $t('upload') }}

                                                </button>
                                            </div>
                                            <input ref="upload_input_overlay" type="file"
                                                v-on:change="on_upload_overlay" multiple hidden>
                                        </div>
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('finished') }}</div>
                                            <div class="stat-value">{{ item.status.finished_video_count }}

                                            </div>
                                        </div>
                                        <div class="stat">
                                            <div class="stat-title text-white">
                                                {{ item.status?.status == 1 ? $t('running') : $t('stopped') }}</div>
                                            <div class="stat-value">{{ format_time(item.status?.uptime || 0) }}
                                                <span class="loading loading-spinner text-warning"
                                                    v-if="item.status?.loading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button @click="start_edit_bot(item)"
                                                    class="btn btn-sm btn-primary text-white"
                                                    :disabled="item.status?.loading" v-if="item.status?.status == 0">
                                                    {{ $t('start_bot') }}
                                                </button>
                                                <button @click="stop_edit_bot(item)"
                                                    class="btn btn-sm btn-error text-white"
                                                    :disabled="item.status?.loading" v-else>
                                                    {{ $t('stop_bot') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-left" v-else>
                                    <div class="stats bg-gradient-to-r from-primary to-success text-primary-content">
                                        <div class="stat">
                                            <div class="stat-title text-white">{{ $t('videos') }}</div>
                                            <div class="stat-value">
                                                {{ item.status?.video_count || 0 }}
                                            </div>
                                            <div class="stat-actions">
                                                <button class="btn btn-sm btn-success text-white">
                                                    {{ $t('download') }}</button>
                                            </div>
                                        </div>
                                        <div class="stat">
                                            <div class="stat-title text-white">
                                                {{ item.status?.status == 1 ? $t('running') : $t('stopped') }}</div>
                                            <div class="stat-value">{{ format_time(item.status?.uptime || 0) }}
                                                <span class="loading loading-spinner text-warning"
                                                    v-if="item.status?.loading"></span>
                                            </div>
                                            <div class="stat-actions">
                                                <button @click="start_post_bot(item)"
                                                    class="btn btn-sm btn-primary text-white"
                                                    :disabled="item.status?.loading" v-if="item.status?.status == 0">
                                                    {{ $t('start_bot') }}
                                                </button>
                                                <button @click="stop_post_bot(item)"
                                                    class="btn btn-sm btn-error text-white"
                                                    :disabled="item.status?.loading" v-else>
                                                    {{ $t('stop_bot') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>


                                <td>
                                    <div class="space-x-4">
                                        <Button label="init" icon="fa fa-refresh" @click="init_virtualHost(item)" />
                                        <Button
                                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            label="edit" icon="fa fa-edit" @click="edit(item)" />
                                        <Button
                                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            label="delete" icon="fa fa-trash" @click="delete_virtualHost(item)" />
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
                <div class="col-span-2 flex items-center gap-4">
                    <div class="flex items-center">
                        <input type="radio" id="postBot" value="0" v-model="currentVirtualHost.bot_type"
                            class="form-radio text-blue-500 h-4 w-4">
                        <label for="postBot" class="ml-2">Post Bot</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" id="editBot" value="1" v-model="currentVirtualHost.bot_type"
                            class="form-radio text-blue-500 h-4 w-4">
                        <label for="editBot" class="ml-2">Edit Bot</label>
                    </div>
                </div>
                <input class="input input-bordered w-full max-w-xs" placeholder="name" autocomplete="off"
                    v-model="currentVirtualHost.name">
                <input class="input input-bordered w-full max-w-xs" placeholder="host" autocomplete="off"
                    v-model="currentVirtualHost.host">
                <input class="input input-bordered w-full max-w-xs" placeholder="port" autocomplete="off"
                    v-model="currentVirtualHost.port">
                <input class="input input-bordered w-full max-w-xs" placeholder="username" autocomplete="off"
                    v-model="currentVirtualHost.username">
                <input class="input input-bordered w-full max-w-xs" placeholder="password" autocomplete="off"
                    v-model="currentVirtualHost.password">
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
            startAllLoading: false,
            stopAllLoading: false,
            initAllLoading: false
        }
    },
    methods: {
        upload_overlay(item) {
            this.currentVirtualHost = item
            this.$refs.upload_input_overlay[0].click()
        },
        on_upload_overlay(e) {
            this.currentVirtualHost.status.uploading = true;
            const totalFiles = e.target.files.length;
            let index = 0;
            const uploadBatch = () => {
                const formData = new FormData();
                formData.append('id', this.currentVirtualHost.id);
                formData.append('dir', "overlay");
                for (let i = 0; i < 10 && index < totalFiles; i++, index++) {
                    formData.append('files', e.target.files[index]);
                    this.currentVirtualHost.status.overlay_video_count++;
                }
                this.$service.upload_to_virtualHost(formData).then(res => {

                    if (index < totalFiles) {
                        uploadBatch(); // Upload next batch
                    } else {
                        this.currentVirtualHost.status.uploading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.currentVirtualHost.status.uploading = false;
                });
            };
            uploadBatch();
        },
        upload_background(item) {
            this.currentVirtualHost = item
            this.$refs.upload_input_background[0].click()
        },
        on_upload_background(e) {
            this.currentVirtualHost.status.uploading = true;
            const totalFiles = e.target.files.length;
            let index = 0;

            const uploadBatch = () => {
                const formData = new FormData();
                formData.append('id', this.currentVirtualHost.id);
                formData.append('dir', "Backgrounds");
                for (let i = 0; i < 10 && index < totalFiles; i++, index++) {
                    formData.append('files', e.target.files[index]);
                    this.currentVirtualHost.status.background_video_count++;
                }
                this.$service.upload_to_virtualHost(formData).then(res => {
                    if (index < totalFiles) {
                        uploadBatch(); // Upload next batch
                    } else {
                        this.currentVirtualHost.status.uploading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.currentVirtualHost.status.uploading = false;
                });
            };

            uploadBatch();
        },
        initAll() {
            this.initAllLoading = true
            let ids = []
            for (let i = 0; i < this.virtualHosts.length; i++) {
                ids.push(this.virtualHosts[i].id)
            }
            this.$service.init_virtualHost({
                ids: ids.join(',')
            }).then(res => {
                this.initAllLoading = false
            })
        },
        startAll() {
            this.startAllLoading = true
            let ids = []
            for (let i = 0; i < this.virtualHosts.length; i++) {
                ids.push(this.virtualHosts[i].id)
                this.virtualHosts[i].status.loading = true
            }
            this.$service.start_post_bot({
                ids: ids.join(',')
            }).then(res => {
                this.startAllLoading = false
                for (let i = 0; i < this.virtualHosts.length; i++) {
                    this.virtualHosts[i].status.loading = false
                    this.virtualHosts[i].status.status = 1
                    this.virtualHosts[i].status.uptime = 2
                }
            })
        },
        stopAll() {
            this.stopAllLoading = true
            let ids = []
            for (let i = 0; i < this.virtualHosts.length; i++) {
                ids.push(this.virtualHosts[i].id)
                this.virtualHosts[i].status.loading = true
            }
            this.$service.stop_post_bot({
                ids: ids.join(',')
            }).then(res => {
                this.stopAllLoading = false
                for (let i = 0; i < this.virtualHosts.length; i++) {
                    this.virtualHosts[i].status.loading = false
                    this.virtualHosts[i].status.status = 0
                    this.virtualHosts[i].status.uptime = 0
                }
            })
        },
        add() {
            this.currentVirtualHost = {
                bot_type: '0',
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
                ids: item.id
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
                //set default bot type
                for (let i = 0; i < this.virtualHosts.length; i++) {
                    if (!this.virtualHosts[i].bot_type) {
                        this.virtualHosts[i].bot_type = '0'
                    }
                }
                this.update_status();
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
                ids: item.id
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
                ids: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
                item.status.status = 0
            }).catch(err => {
                console.log(err)
                item.status.loading = false
            })
        },
        start_edit_bot(item) {
            item.status.loading = true
            this.$service.start_edit_bot({
                ids: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
                item.status.status = 1
            }).catch(err => {
                console.log(err)
                item.status.loading = false
            })
        },
        stop_edit_bot(item) {
            item.status.loading = true
            this.$service.stop_edit_bot({
                ids: item.id
            }).then(res => {
                console.log(res)
                item.status.loading = false
                item.status.status = 0
            }).catch(err => {
                console.log(err)
                item.status.loading = false
            })
        },
        update_status() {
            for (let i = 0; i < this.virtualHosts.length; i++) {
                if (this.virtualHosts[i].status?.loading) {
                    continue
                }
                !this.virtualHosts[i].status && (this.virtualHosts[i].status = {})
                // this.virtualHosts[i].status.loading = true
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
        }
    },
    mounted() {
        this.get_virtualHosts();

        this.update_status_timer = setInterval(() => {
            this.update_status()
        }, 5000)
    },
    unmounted() {
        clearInterval(this.update_status_timer)
    }

}
</script>