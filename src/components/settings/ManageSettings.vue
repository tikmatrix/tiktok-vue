<template>
    <div class="flex flex-col items-start p-12  w-full">
        <h1 class="text-2xl mb-6">{{ $t('settings') }}</h1>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('proxyServerTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="Proxy Server" class="input input-primary w-full join-item"
                    v-model="settings.proxy_url" />
                <button class="btn btn-primary join-item" @click="set_settings">{{ $t('save') }}</button>
            </div>

            <div class="label">
                <span class="label-text-alt">example: 192.168.0.1:8090</span>
            </div>
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
                <span class="label-text">{{ $t('timezoneTips') }}</span>
            </div>
            <div class="join">
                <input type="text" placeholder="TimeZone" class="input input-primary w-full max-w-md join-item"
                    v-model="settings.timezone" />
                <button class="btn btn-primary join-item" @click="set_settings">{{ $t('save') }}</button>
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
                <button class="btn btn-primary join-item" @click="set_settings">{{ $t('save') }}</button>
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

                <button class="btn btn-primary join-item" @click="set_settings">{{ $t('save') }}</button>
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

                <button class="btn btn-primary join-item" @click="set_settings">{{ $t('save') }}</button>
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
    },
    mounted() {
        this.get_settings()
    }
}
</script>
