<template>
    <div class="w-full p-4 bg-gray-200 border-b border-gray-300">
        <label class="text-gray-700  font-bold">{{ $t('batchAction') }}</label>
        <Button icon="fa fa-refresh" @click="$emit('get_devices')" label="refresh" />
        <input id="app_install_input" type="file" v-on:change="on_app_install" hidden>
        <Button icon="fa fa-upload" @click="app_install" label="installApk" />
        <Button icon="fa fa-trash" @click="app_uninstall" label="uninstallApk" />
        <Button label="menu" icon="fa-solid fa-bars" @click="shell('input keyevent KEYCODE_APP_SWITCH')" />
        <Button label="back" icon="fa-solid fa-chevron-left" @click="shell('input keyevent KEYCODE_BACK')" />
        <Button label="home" icon="fa-solid fa-home" @click="shell('input keyevent KEYCODE_HOME')" />
        <Button label="wakeup" icon="fa-solid fa-mobile-screen" @click="shell('input keyevent KEYCODE_WAKEUP')" />
        <Button label="sleep" icon="fa-solid fa-mobile" @click="shell('input keyevent KEYCODE_SLEEP')" />
        <Button label="openTiktok" icon="fa-brands fa-tiktok"
            @click="shell('am start -n com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity')" />
        <Button label="stopTiktok" icon="fa-brands fa-tiktok" @click="shell('am force-stop com.zhiliaoapp.musically')" />
        <Button @click="shell('settings put global http_proxy 192.168.0.100:7890')" label="enableProxy"
            icon="fa-solid fa-link" />
        <!-- <Button @click="shell('settings put global http_proxy :0')" label="disableProxy" icon="fa-solid fa-unlink" /> -->

        <Button @click="script('connect_wifi')" label="connectWifi" />
        <Button @click="script('disconnect_wifi')" label="disconnectWifi" />
        <Button @click="script('torch_on')" label="torchOn" />
        <Button @click="script('torch_off')" label="torchOff" />
        <!-- <Button @click="shell('settings put global auto_time 1')" label="openAutoDateTime" />
        <Button @click="shell('settings put global auto_time 0')" label="closeAutoDateTime" /> -->
        <Button @click="script('datetime')" label="setTimeAndLanguage" />
        <Button @click="script('info')" label="infoCrawler" />
        <Button @click="shell('am start -a android.settings.DEVICE_INFO_SETTINGS')" label="showSimInfo" />
        <Button @click="shell('input swipe 500 0 500 1000')" label="openNotification" />
        <Button @click="shell('reboot')" label="rebootAll" color="bg-red-500 text-white" />
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

    },
}
</script>