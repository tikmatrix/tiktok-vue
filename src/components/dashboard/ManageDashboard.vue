<template>
    <div class="flex flex-col items-start p-12 w-full">
        <div class="toast toast-top toast-center z-50" v-if="showToast">
            <div class="alert alert-success">
                <span>Copied!</span>
            </div>
        </div>
        <h1 class="text-2xl mb-6">{{ $t('dashboard') }}</h1>
        <ul class="steps">
            <li class="step step-primary">Download TikTok Matrix</li>
            <li class="step step-primary">Open TikTok Matrix</li>
            <li class="step step-primary">Create Matrix Group</li>
            <li class="step step-primary">Config Matrix Group</li>
            <li class="step step-primary">Auto Register Accounts</li>
            <li class="step step-primary">Auto Train</li>
            <li class="step step-primary">Auto Publish</li>
        </ul>
        <div class="divider"></div>
        <div class="stats shadow">

            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'mobile-alt']" />
                </div>
                <div class="stat-title">Device Count</div>
                <div class="stat-value">2000</div>
                <div class="stat-desc">100% active</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'users']" />
                </div>
                <div class="stat-title">Account Count</div>
                <div class="stat-value">16000</div>
                <div class="stat-desc">100% active</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'robot']" />
                </div>
                <div class="stat-title">Train Jobs</div>
                <div class="stat-value">20.3k</div>
                <div class="stat-desc">success rate 98%</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <font-awesome-icon :icon="['fas', 'robot']" />
                </div>
                <div class="stat-title">Publish Jobs</div>
                <div class="stat-value">21.3k</div>
                <div class="stat-desc">success rate 99%</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-primary">
                    <font-awesome-icon :icon="['fas', 'cogs']" />
                </div>
                <div class="stat-title">Train Queue</div>
                <div class="stat-value">200</div>
                <div class="stat-desc">in queue</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-primary">
                    <font-awesome-icon :icon="['fas', 'cogs']" />
                </div>
                <div class="stat-title">Publish Queue</div>
                <div class="stat-value">300</div>
                <div class="stat-desc">in queue</div>
            </div>


        </div>
        <div class="divider"></div>
        <div class="stats bg-secondary text-secondary-content">
            <div class="stat">
                <div class="stat-title">Matrix Group A</div>
                <div class="stat-value">30k views</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos</button>
                    <button class="btn btn-sm btn-primary ml-2">Accounts</button>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Matrix Group B</div>
                <div class="stat-value">33k views</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos</button>
                    <button class="btn btn-sm btn-primary ml-2">Accounts</button>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Matrix Group C</div>
                <div class="stat-value">35k views</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos</button>
                    <button class="btn btn-sm btn-primary ml-2">Accounts</button>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Matrix Group C</div>
                <div class="stat-value">35k views</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos</button>
                    <button class="btn btn-sm btn-primary ml-2">Accounts</button>
                </div>
            </div>
            <div class="stat">
                <div class="stat-title">Matrix Group C</div>
                <div class="stat-value">35k views</div>
                <div class="stat-actions">
                    <button class="btn btn-sm btn-success">Videos</button>
                    <button class="btn btn-sm btn-primary ml-2">Accounts</button>
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
            settings: {},
            license: {
                uid: '',
                key: '',
                status: '',
                name: '',
                left_days: 0
            },
            showToast: false,
        }
    },
    methods: {
        get_settings() {
            this.$service.get_settings().then((res) => {
                this.settings = res.data;
            });
        },
        set_settings() {
            this.$service.update_settings(this.settings).then((res) => {
                console.log(res);
            });
        },
        copyuid() {
            //copy uid to clipboard
            navigator.clipboard.writeText(this.license.uid).then(() => {
                console.log('Async: Copying to clipboard was successful!');
                this.showToast = true;
                setTimeout(() => {
                    this.showToast = false;
                }, 2000);
            }, (err) => {
                console.error('Async: Could not copy text: ', err);
            });

        },
        get_license() {
            this.$service.get_license().then((res) => {
                this.license = res.data;
            });
        },
        add_license() {
            this.$service.add_license({
                key: this.license.key
            }).then((res) => {
                console.log(res);
                this.get_license();
            });
        }
    },
    mounted() {
        this.get_settings()
        this.get_license()
    }
}
</script>
