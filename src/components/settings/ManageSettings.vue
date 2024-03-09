<template>
    <div class="flex flex-col items-start p-12 w-full">
        <div class="toast toast-top toast-center z-50" v-if="showToast">
            <div class="alert alert-success">
                <span>Copied!</span>
            </div>
        </div>
        <h1 class="text-2xl mb-6">{{ $t('settings') }}</h1>
        <label class="form-control w-full max-w-md">

            <div class="join">
                <input type="text" placeholder="uid" class="input input-primary w-full join-item" v-model="license.uid"
                    disabled />
                <Button @click="copyuid" label="copy" :loading-time="1" />
            </div>

            <div class="label">
                <span class="label-text">{{ $t('licenseTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="license key" class="input input-primary w-full join-item"
                    v-model="license.key" />
                <Button @click="add_license" label="save" :loading-time=2000 />
            </div>

            <div class="label">
                <label class="label-text-alt text-red-500 font-bold" v-if="license.status != 'pass'">{{
                    license.status }}</label>
                <label class="label-text-alt" v-if="license.status == 'pass'">
                    For: <label class="text-green-500 font-bold">{{ license.name }}</label>
                    Left: <label class="text-red-500 font-bold">{{ license.left_days }}</label> days.
                </label>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('proxyServerTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="Proxy Server" class="input input-primary w-full join-item"
                    v-model="settings.proxy_url" />
                <Button @click="set_settings" label="save" :loading-time=2000 />

            </div>

            <div class="label">
                <span class="label-text-alt">example: 192.168.0.1:7890</span>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('timezoneTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="TimeZone" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.timezone" />
                <Button @click="set_settings" label="save" :loading-time=2000 />
            </div>

            <div class="label">
                <span class="label-text-alt">example: GMT+00:00</span>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('wifiTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="Wifi name" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.wifi_name" />
                <input type="text" placeholder="Wifi password" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.wifi_password" />
                <Button @click="set_settings" label="save" :loading-time=2000 />
            </div>

            <div class="label">
                <span class="label-text-alt">your wifi ssid and password. </span>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('emailTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="email suffix" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.email_suffix" />

                <Button @click="set_settings" label="save" :loading-time=2000 />
            </div>

            <div class="label">
                <span class="label-text-alt">example: @niostack.com </span>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('openaiTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="openai_api_key" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.openai_api_key" />

                <Button @click="set_settings" label="save" :loading-time=2000 />
            </div>

            <div class="label">
                <span class="label-text-alt">example: sk-xxxxxxxxxxxxxxxx </span>
            </div>
        </label>
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