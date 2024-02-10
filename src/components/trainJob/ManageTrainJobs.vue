<template>
    <div class="w-full">
        <Pagination :items="jobs" :pageSize="10" :searchKeys="['device', 'id', 'account']" @refresh="get_train_jobs">
            <template v-slot:buttons>
                <!-- <Button @click="create_job" label="add" /> -->
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('startTime') }}</th>
                                <th>{{ $t('status') }}</th>
                                <th>{{ $t('account') }}</th>
                                <th>{{ $t('device') }}</th>
                                <th>{{ $t('group') }}</th>
                                <th>{{ $t('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(train_job, index) in slotProps.items" :key="index">
                                <td>{{ train_job.id }}</td>
                                <td>{{ train_job.start_time }}</td>
                                <td>
                                    <div class="badge badge-neutral" v-if="train_job.status == '0'"> {{ $t('waiting') }}
                                    </div>
                                    <div class="badge badge-primary" v-else-if="train_job.status == '1'"> {{
                                        $t('execing') }} </div>
                                    <div class="badge badge-success" v-else-if="train_job.status == '2'"> {{
                                        $t('success') }} </div>
                                    <div class="badge badge-error" v-else-if="train_job.status == '3'"> {{
                                        $t('failed') }} </div>
                                </td>
                                <td>{{ train_job.account }}</td>
                                <td>
                                    <a class="cursor-pointer underline text-blue-500"
                                        @click="show_device(train_job.device)">{{
                                            train_job.device }}</a>
                                </td>
                                <td>{{ train_job.group_name || 'N/A' }}</td>
                                <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="retry(train_job)">{{ $t('retry') }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deleteJob(train_job)">{{ $t('delete') }}</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>

    </div>
</template>
<script>
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'
import { inject } from 'vue';

export default {
    name: 'app',
    components: {
        Button,
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
        handleDeviceClose() {
            this.currentDevice = null;
        },
        show_device(device) {
            this.currentDevice = this.devices.find(d => d.serial === device)
        },
        get_train_jobs() {
            this.currentJob = null
            this.$service.get_train_jobs().then(res => {
                this.jobs = res.data
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },

        retry(train_job) {
            this.$service.update_train_job({
                id: train_job.id,
                status: 0,
            }).then(res => {
                this.get_train_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteJob(train_job) {
            this.$service.delete_train_job({
                id: train_job.id,
            }).then(res => {
                console.log(res)
                this.get_train_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.jobs.forEach(train_job => {
                    if (train_job.group_id === 0) {
                        train_job.group_name = this.$t('defaultGroup')
                        return
                    }
                    train_job.group_name = this.groups.find(group => group.id === train_job.group_id).name
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_train_jobs()
    }
}
</script>
