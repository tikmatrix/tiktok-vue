<template>
    <div class="w-full">
        <div ref="header"  class="w-full p-4 bg-gray-200 border-b border-gray-300  sticky top-0 z-10">
            <Button @click="create_job" label="Developing" />
        </div>
        <div>
            
        </div>
        <Modal :show="currentJob" @close="currentJob = null">
            <Edit :job="currentJob" @update="updateJob" />
        </Modal>
        <Modal :show="showCreateView" @close="showCreateView = false">
            <Create @create="add_job" />
        </Modal>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'

export default {
    name: 'app',
    components: {
    Modal,
    Button,
},
    data() {
        return {
            headerHeight: 0,
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
        this.headerHeight = this.$refs.header.offsetHeight;
        this.get_jobs()
    }

}
</script>
