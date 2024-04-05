<template>
    <div class="w-full p-4 ">
        <details class="collapse collapse-arrow bg-base-200">
            <summary class="collapse-title text-xl font-medium">{{ $t('batchAction') }}</summary>
            <div class="collapse-content">
                <input id="app_install_input" type="file" v-on:change="on_app_install" hidden>
                <Button icon="fa fa-upload" @click="app_install" label="installApk" />
                <Button icon="fa fa-trash" @click="app_uninstall" label="uninstallApk" />
                <Button label="1080x1920" icon="fa-solid fa-mobile" @click="shell('wm size 1080x1920')" />
                <Button label="320" icon="fa-solid fa-mobile" @click="shell('wm density 320')" />
                <!-- <Button label="menu" icon="fa-solid fa-bars" @click="shell('input keyevent KEYCODE_APP_SWITCH')" /> -->
                <Button label="back" icon="fa-solid fa-chevron-left" @click="shell('input keyevent KEYCODE_BACK')" />
                <Button label="home" icon="fa-solid fa-home" @click="shell('input keyevent KEYCODE_HOME')" />
                <Button label="wakeup" icon="fa-solid fa-mobile-screen"
                    @click="shell('input keyevent KEYCODE_WAKEUP')" />
                <Button label="sleep" icon="fa-solid fa-mobile" @click="shell('input keyevent KEYCODE_SLEEP')" />
                <Button label="openTiktok" icon="fa-brands fa-tiktok"
                    @click="shell('am start -n com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity')" />
                <Button label="stopTiktok" icon="fa-brands fa-tiktok"
                    @click="shell('am force-stop com.zhiliaoapp.musically')" />
                <Button @click="shell(`settings put global http_proxy ${settings.proxy_url}`)" label="enableProxy"
                    icon="fa-solid fa-link" />
                <Button @click="shell('settings put global http_proxy :0')" label="disableProxy"
                    icon="fa-solid fa-unlink" />

                <Button @click="script('connect_wifi')" label="connectWifi" icon="fa-solid fa-wifi" />
                <Button @click="script('unlock')" label="unlock" icon="fa-solid fa-unlock" />
                <!-- <Button @click="script('disconnect_wifi')" label="disconnectWifi" icon="fa-solid fa-wifi-slash" /> -->
                <Button @click="script('torch_on')" label="torchOn" icon="fa-solid fa-lightbulb" />
                <Button @click="script('torch_off')" label="torchOff" icon="fa-solid fa-power-off" />
                <Button @click="shell('am start -a android.settings.DATE_SETTINGS')" label="showTimeSetting"
                    icon="fa-solid fa-clock" />
                <Button @click="shell('am start -a android.settings.DEVICE_INFO_SETTINGS')" label="showSimInfo"
                    icon="fa-solid fa-sim-card" />
                <Button @click="shell('input swipe 500 0 500 1000')" label="openNotification" icon="fa-solid fa-bell" />
                <Button @click="script('clear_notification')" label="clearNotification" icon="fa-solid fa-bell-slash" />
                <Button @click="script('clear_tasks')" label="clearTasks" icon="fa-solid fa-trash" />
                <Button @click="shell('reboot')" label="rebootAll" color="btn-error" icon="fa-solid fa-power-off" />
            </div>
        </details>

    </div>
</template>
<script>
import Button from '../Button.vue'
export default {
    name: 'BatchButtons',
    components: {
        Button
    },
    data() {
        return {
            settings: {}
        }
    },
    methods: {
        shell(cmd) {
            this.$service.shell({
                cmd: cmd
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })

        },
        app_install() {
            document.getElementById("app_install_input").click()
        },
        on_app_install(event) {
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            this.$service.install(formData).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        app_uninstall() {
            // 弹出输入框让用户输入包名
            let packageName = window.prompt("请输入包名");
            if (packageName) {
                this.shell(`pm uninstall ${packageName}`)
            } else {
                console.log("未输入包名");
            }
        },
        script(script, args) {
            this.$service.script({
                script: script,
                args: args
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })

        },
        get_settings() {
            this.$service.get_settings().then((res) => {
                this.settings = res.data;
            });
        },
    },
    mounted() {
        this.get_settings()
    }
}
</script>