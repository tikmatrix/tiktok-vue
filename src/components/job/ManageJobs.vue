<template>
    <div class="w-full">
        <Pagination :items="jobs" :pageSize="10" searchKey="account">
            <template v-slot:buttons>
                <!-- <Button @click="create_job" label="add" /> -->
            </template>
            <template v-slot:default="slotProps">
                <table class="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 border font-bold">{{ $t('id') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('startTime') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('status') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('material') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('account') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('device') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('group') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(job, index) in slotProps.items" :key="index"
                            :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                            <td class="px-4 py-2 border">{{ job.id }}</td>
                            <td class="px-4 py-2 border">{{ job.start_time }}</td>
                            <td class="px-4 py-2 border" :class="{
                                'text-green-500': job.status === 2,
                                'text-red-500': job.status === 3,
                                'text-yellow-500': job.status === 1,
                                'text-gray-500': job.status === 0
                            }">
                                {{ { 0: $t('waiting'), 1: $t('execing'), 2: $t('success'), 3: $t('failed') }[job.status] }}
                            </td>
                            <td class="px-4 py-2 border">
                                <template v-if="job.material.endsWith('.mp4') || job.material.endsWith('.webm')">
                                    <video :src="`${job.material}`" class="w-[100px] h-[100px] max-w-none">
                                    </video>
                                </template>
                                <template v-else>
                                    <img :src="`${job.material}`" class="w-[100px] h-[100px] max-w-none" />
                                </template>
                            </td>
                            <td class="px-4 py-2 border">{{ job.account }}</td>
                            <td class="px-4 py-2 border">{{ job.device || 'N/A' }}</td>
                            <td class="px-4 py-2 border">{{ job.group_name || 'N/A' }}</td>
                            <td class="px-4 py-2 border space-x-4">
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    @click="retry(job)">{{ $t('retry') }}</button>
                                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    @click="deleteJob(job)">{{ $t('delete') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </Pagination>

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
            jobs: [],
            groups: [],
        }
    },
    methods: {
        get_jobs() {
            this.currentJob = null
            this.$service.get_jobs().then(res => {
                console.log(res)
                this.jobs = res.data
                this.get_groups();
            }).catch(err => {
                console.log(err)
            })
        },

        retry(job) {
            this.$service.update_job_status({
                id: job.id,
                status: 0,
            }).then(res => {
                console.log(res)
                this.get_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        deleteJob(job) {
            this.$service.delete_job({
                id: job.id,
            }).then(res => {
                console.log(res)
                this.get_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.jobs.forEach(job => {
                    if (job.group_id === 0) {
                        job.group_name = this.$t('defaultGroup')
                        return
                    }
                    job.group_name = this.groups.find(group => group.id === job.group_id).name
                })
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.get_jobs()
    }
}
</script>
