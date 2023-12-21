<template>
    <div class="w-full">
        <Pagination :items="jobs" :pageSize="10" searchKey="account">
            <template v-slot:buttons>
                <Button @click="create_job" label="add" />
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
                            <td class="px-4 py-2 border space-x-4">
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    @click="editJob(job)">{{ $t('edit') }}</button>
                                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    @click="deleteJob(job)">{{ $t('delete') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </Pagination>
        <Modal :show="currentJob" @close="currentJob = null">
            <Edit :job="currentJob" @update="updateJob" />
        </Modal>
        <Modal :show="showCreateView" @close="showCreateView = false">
            <Create @create="add_job" />
        </Modal>
    </div>
</template>
<script>
import Create from './Create.vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Edit from './Edit.vue'
import Pagination from '../Pagination.vue'

export default {
    name: 'app',
    components: {
        Create,
        Modal,
        Button,
        Edit,
        Pagination
    },
    data() {
        return {
            jobs: [],
            currentJob: null,
            showCreateView: false,
        }
    },
    methods: {
        get_jobs() {
            this.currentJob = null
            this.$service.get_jobs().then(res => {
                console.log(res)
                this.jobs = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        create_job() {
            this.showCreateView = true
        },
        add_job(job) {
            this.showCreateView = false
            this.$service.add_job({
                start_time: new Date(job.start_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
                material: job.material,
                account: job.account,
                title: job.title,
                tags: job.tags,
            }).then(res => {
                console.log(res)
                this.get_jobs()
            }).catch(err => {
                console.log(err)
            })
        },
        editJob(job) {
            this.currentJob = job;
        },
        updateJob(job) {
            this.$service.update_job({
                id: job.id,
                start_time: new Date(job.start_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
                material: job.material,
                account: job.account,
                title: job.title,
                tags: job.tags,
                status: Number(job.status),
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
        }
    },
    mounted() {
        this.get_jobs()
    }

}
</script>
