<template>
    <div class="w-full">
        <Pagination :items="jobs" :searchKeys="['device', 'id', 'account']" @refresh="get_publish_jobs">
            <template v-slot:buttons>
                <Button @click="retry_all_failed" label="retryAllFaied" />
                <Button onclick="confirm_modal.showModal()" label="clearAll" />
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('startTime') }}</th>
                                <th>{{ $t('status') }}</th>
                                <th>{{ $t('material') }}</th>
                                <th>{{ $t('username') }}</th>
                                <th>{{ $t('device') }}</th>
                                <th>{{ $t('group') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(publish_job, index) in slotProps.items" :key="index">
                                <td>{{ publish_job.id }}</td>
                                <td>{{ publish_job.start_time }}</td>
                                <td>
                                    <div class="badge badge-neutral" v-if="publish_job.status == '0'"> {{ $t('waiting') }}
                                    </div>
                                    <div class="badge badge-primary" v-else-if="publish_job.status == '1'"> {{
                                        $t('execing') }} </div>
                                    <div class="badge badge-success" v-else-if="publish_job.status == '2'"> {{
                                        $t('success') }} </div>
                                    <div class="badge badge-error" v-else-if="publish_job.status == '3'"> {{
                                        $t('failed') }} </div>
                                </td>
                                <td>
                                    <template
                                        v-if="publish_job.material.endsWith('.mp4') || publish_job.material.endsWith('.webm')">
                                        <video :src="`${publish_job.material}`" class="w-[100px] h-[100px] max-w-none">
                                        </video>
                                    </template>
                                    <template v-else>
                                        <img :src="`${publish_job.material}`" class="w-[100px] h-[100px] max-w-none" />
                                    </template>
                                </td>
                                <td>{{ publish_job.username }}</td>
                                <td>
                                    <a class="cursor-pointer underline text-blue-500"
                                        @click="show_device(publish_job.device)">{{
                                            publish_job.device }}</a>
                                </td>
                                <td>{{ publish_job.group_name || 'N/A' }}</td>
                                <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="retry(publish_job)">{{ $t('retry') }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deleteJob(publish_job)">{{ $t('delete') }}</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
        <Modal :show="currentDevice" @close="handleDeviceClose">
            <Remote :device="currentDevice" />
        </Modal>
        <dialog id="confirm_modal" class="modal">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg">Confirm Clear All?</h3>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-primary" @click="delete_all">Confirm</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'
import Remote from '../device/Remote.vue'
import { inject } from 'vue';
export default {
    name: 'app',
    components: {
        Button,
        Modal,
        Remote,
        Pagination
    },
    setup() {
        const devices = inject('devices');
        return { devices: devices.list };
    },
    data() {
        return {
            jobs: [],
            groups: [],
            devices: [],
            currentDevice: null,
        }
    },
    methods: {
        delete_all() {
            this.$service.delete_all_publish_jobs().then(res => {
                this.get_publish_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        handleDeviceClose() {
            this.currentDevice = null;
        },
        show_device(device) {
            this.currentDevice = this.devices.find(d => d.serial === device)
        },
        get_publish_jobs() {
            this.currentJob = null
            this.$service.get_publish_jobs().then(res => {
                this.jobs = res.data
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },

        retry(publish_job) {
            this.$service.update_publish_job({
                id: publish_job.id,
                status: 0,
                publish_type: publish_job.publish_type,
            }).then(res => {
                this.get_publish_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteJob(publish_job) {
            this.$service.delete_publish_job({
                id: publish_job.id,
            }).then(res => {
                console.log(res)
                this.get_publish_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.jobs.forEach(publish_job => {
                    if (publish_job.group_id === 0) {
                        publish_job.group_name = this.$t('defaultGroup')
                        return
                    }
                    publish_job.group_name = this.groups.find(group => group.id === publish_job.group_id).name
                })
            }).catch(err => {
                console.log(err)
            })
        },
        retry_all_failed() {
            this.$service.retry_all_failed_publish_job().then(res => {
                this.get_publish_jobs()
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.get_publish_jobs();
    }
}
</script>
