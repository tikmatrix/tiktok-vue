<template>
    <div class="flex flex-col items-start p-12 w-full">

        <h1 class="text-2xl mb-6">{{ $t('dashboard') }}</h1>
        <div class="divider">{{ $t('quickStart') }}</div>
        <ul class="steps">
            <li class="step step-primary">{{ $t('step.step1') }}</li>
            <li class="step step-primary">{{ $t('step.step2') }}</li>
            <li class="step step-primary">{{ $t('step.step3') }}</li>
            <li class="step step-primary">{{ $t('step.step4') }}</li>
            <li class="step step-primary">{{ $t('step.step5') }}</li>
            <li class="step step-primary">{{ $t('step.step6') }}</li>
            <li class="step step-primary">{{ $t('step.step7') }}</li>
        </ul>
        <div class="divider">{{ $t('overview') }}</div>
        <div class="stats shadow">
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                </div>
                <div class="stat-title">{{ $t('deviceCount') }}</div>
                <div class="stat-value">{{ device_count }}</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'users']" />
                </div>
                <div class="stat-title">{{ $t('accountCount') }}</div>
                <div class="stat-value">{{ account_count }}</div>
            </div>
        </div>
        <div class="divider">{{ $t('overview') }}</div>
        <div class="stats shadow">

            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'robot']" />
                </div>
                <div class="stat-title">{{ $t('trainJobCount') }}</div>
                <div class="stat-value">{{ train_job_count }}</div>
                <div class="stat-desc">success rate {{ train_job_sucess_rate * 100 }}%</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'robot']" />
                </div>
                <div class="stat-title">{{ $t('publishJobCount') }}</div>
                <div class="stat-value">{{ publish_job_count }}</div>
                <div class="stat-desc">success rate {{ publish_job_sucess_rate * 100 }}%</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-primary">
                    <font-awesome-icon :icon="['fas', 'cogs']" />
                </div>
                <div class="stat-title">{{ $t('trainJobQueue') }}</div>
                <div class="stat-value">{{ train_job_queue }}</div>
                <div class="stat-desc">{{ running_train_job_count }} is running</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-primary">
                    <font-awesome-icon :icon="['fas', 'cogs']" />
                </div>
                <div class="stat-title">{{ $t('publishJobQueue') }}</div>
                <div class="stat-value">{{ publish_job_queue }}</div>
                <div class="stat-desc">{{ running_publish_job_count }} is running</div>
            </div>
        </div>
        <div class="divider">{{ $t('matrixGroup') }}</div>
        <div class="stats bg-primary text-primary-content carousel carousel-center rounded-box w-full">
            <div class="stat carousel-item">
                <div class="stat-value">Matrix Group A</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos:99</button>
                    <button class="btn btn-sm btn-info ml-2">Accounts:100</button>

                </div>
            </div>
            <div class="divider lg:divider-horizontal"></div>
            <div class="stat carousel-item">
                <div class="stat-value">Matrix Group B</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos:99</button>
                    <button class="btn btn-sm btn-info ml-2">Accounts:100</button>
                </div>
            </div>
            <div class="divider lg:divider-horizontal"></div>
            <div class="stat carousel-item">
                <div class="stat-value">Matrix Group C</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos:99</button>
                    <button class="btn btn-sm btn-info ml-2">Accounts:100</button>
                </div>
            </div>
            <div class="divider lg:divider-horizontal"></div>
            <div class="stat carousel-item">
                <div class="stat-value">Matrix Group D</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos:99</button>
                    <button class="btn btn-sm btn-info ml-2">Accounts:100</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Button from '../Button.vue'

export default {
    name: 'app',
    components: {
        Button,
    },
    data() {
        return {
            device_count: 0,
            account_count: 0,
            train_job_count: 0,
            train_job_sucess_rate: 0,
            running_train_job_count: 0,
            publish_job_count: 0,
            publish_job_sucess_rate: 0,
            running_publish_job_count: 0,
            train_job_queue: 0,
            publish_job_queue: 0,
            groups: []
        }
    },
    methods: {
        count_online_device() {
            this.$service.count_online_device().then(res => {
                this.device_count = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        count_all_account() {
            this.$service.count_all_account().then(res => {
                this.account_count = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        count_train_job_by_status() {
            this.$service.count_train_job_by_status().then(res => {
                const status_count_list = res.data;
                const { all_count, success_count, queue_count, running_count } = status_count_list.reduce((acc, item) => {
                    acc.all_count += item.count;
                    if (item.status === 2) {
                        acc.success_count = item.count;
                    }
                    if (item.status === 1) {
                        acc.running_count = item.count;
                    }
                    if (item.status === 0) {
                        acc.queue_count = item.count;
                    }
                    return acc;
                }, { all_count: 0, success_count: 0, queue_count: 0 });

                this.train_job_count = all_count;
                this.train_job_sucess_rate = (success_count / all_count).toFixed(4);
                this.train_job_queue = queue_count;
                this.running_train_job_count = running_count;
            }).catch(err => {
                console.log(err);
            });
        },
        count_publish_job_by_status() {
            this.$service.count_publish_job_by_status().then(res => {
                const status_count_list = res.data;
                const { all_count, success_count, queue_count, running_count } = status_count_list.reduce((acc, item) => {
                    acc.all_count += item.count;
                    if (item.status === 2) {
                        acc.success_count = item.count;
                    }
                    if (item.status === 1) {
                        acc.running_count = item.count;
                    }
                    if (item.status === 0) {
                        acc.queue_count = item.count;
                    }
                    return acc;
                }, { all_count: 0, success_count: 0, queue_count: 0 });

                this.publish_job_count = all_count;
                this.publish_job_sucess_rate = (success_count / all_count).toFixed(4);
                this.publish_job_queue = queue_count;
                this.running_publish_job_count = running_count;
            }).catch(err => {
                console.log(err);
            });
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
            }).catch(err => {
                console.log(err)
            })
        },
    },
    mounted() {
        this.count_online_device()
        this.count_all_account()
        this.count_train_job_by_status()
        this.count_publish_job_by_status()
        this.get_groups()
    }
}
</script>
