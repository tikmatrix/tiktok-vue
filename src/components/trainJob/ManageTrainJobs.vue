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
                            <th class="px-4 py-2 border font-bold">{{ $t('endTime') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('status') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('account') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('device') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('group') }}</th>
                            <th class="px-4 py-2 border font-bold">{{ $t('actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(train_job, index) in slotProps.items" :key="index"
                            :class="{ 'bg-gray-100': index % 2, 'hover:bg-gray-200': true }">
                            <td class="px-4 py-2 border">{{ train_job.id }}</td>
                            <td class="px-4 py-2 border">{{ train_job.start_time }}</td>
                            <td class="px-4 py-2 border">{{ train_job.endTime }}</td>
                            <td class="px-4 py-2 border" :class="{
                                'text-green-500': train_job.status === 2,
                                'text-red-500': train_job.status === 3,
                                'text-yellow-500': train_job.status === 1,
                                'text-gray-500': train_job.status === 0
                            }">
                                {{ {
                                    0: $t('waiting'), 1: $t('execing'), 2: $t('success'), 3: $t('failed')
                                }[train_job.status] }}
                            </td>
                            <td class="px-4 py-2 border">{{ train_job.account }}</td>
                            <td class="px-4 py-2 border">{{ train_job.device || 'N/A' }}</td>
                            <td class="px-4 py-2 border">{{ train_job.group_name || 'N/A' }}</td>
                            <td class="px-4 py-2 border space-x-4">
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    @click="retry(train_job)">{{ $t('retry') }}</button>
                                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    @click="deleteJob(train_job)">{{ $t('delete') }}</button>
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
