<template>
    <div class="p-4 grid grid-cols-10">
        <div class="relative col-span-4 ">
            <img ref="screen" v-bind:src="img" class=" rounded-lg border-4  border-black shadow-lg cursor-pointer"
                @mousedown="mouseDownListener" @mouseup="mouseUpListener" @mouseleave="mouseLeaveListener"
                @mousemove="mouseMoveListener" />
            <div v-if="showEffect" class="absolute rounded-full w-12 h-12 bg-white opacity-50 pointer-events-none"
                :style="{ top: `${effectY}px`, left: `${effectX}px` }"></div>
            <!-- add a tast running tips -->
            <div class="absolute top-0 p-1 bg-red-500 text-white rounded-lg w-full text-left"
                v-show="task_status == 'running'">
                <span class="">
                    Auto Task Running
                </span>
                <span class=" font-bold">{{ loading_text }}</span>
            </div>
        </div>
        <div class="p-1 col-span-6">
            <p class="p-1 text-lg font-bold">{{ device.serial }}
                <!-- <Button label="repair" icon="fa-solid fa-wrench" @click="repair(device.serial)" /> -->
            </p>
            <p class="p-1 ">FPS: <span class="text-green-500" v-text="fps.toFixed(1)"></span></p>
            <p class="p-1 ">IP: <span class="text-red-500" v-text="ip"></span></p>
            <details class="collapse collapse-arrow bg-base-200">
                <summary class="collapse-title text-xl font-medium">{{ $t('quickOperation') }}</summary>
                <div class="collapse-content">
                    
                    <Button label="720x1280" icon="fa-solid fa-mobile" @click="shell('wm size 720x1280')" />
                    <Button label="1080x1920" icon="fa-solid fa-mobile" @click="shell('wm size 1080x1920')" />
                    <Button label="1440x2560" icon="fa-solid fa-mobile" @click="shell('wm size 1440x2560')" />
                    <Button label="resetSize" icon="fa-solid fa-mobile" @click="shell('wm size reset')" />
                    <Button label="240" icon="fa-solid fa-mobile" @click="shell('wm density 240')" />
                    <Button label="320" icon="fa-solid fa-mobile" @click="shell('wm density 320')" />
                    <Button label="480" icon="fa-solid fa-mobile" @click="shell('wm density 480')" />
                    <Button label="resetDensity" icon="fa-solid fa-mobile" @click="shell('wm density reset')" />
                    <Button label="showTimeSetting" icon="fa-solid fa-clock" @click="shell('am start -a android.settings.DATE_SETTINGS')" />
                    <Button label="menu" icon="fa-solid fa-bars" @click="shell('input keyevent KEYCODE_APP_SWITCH')" />
                    <Button label="back" icon="fa-solid fa-chevron-left" @click="shell('input keyevent KEYCODE_BACK')" />
                    <Button label="home" icon="fa-solid fa-home" @click="shell('input keyevent KEYCODE_HOME')" />
                    <Button label="wakeup" icon="fa-solid fa-mobile-screen"
                        @click="shell('input keyevent KEYCODE_WAKEUP')" />
                    <Button label="sleep" icon="fa-solid fa-mobile" @click="shell('input keyevent KEYCODE_SLEEP')" />
                    <Button label="openTiktok" icon="fa-brands fa-tiktok"
                        @click="shell('am start -n com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity')" />
                    <Button label="stopTiktok" icon="fa-brands fa-tiktok"
                        @click="shell('am force-stop com.zhiliaoapp.musically')" />
                    <Button label="clearTiktok" icon="fa-solid fa-trash"
                        @click="shell('pm clear com.zhiliaoapp.musically')" />
                    <Button @click="enable_proxy" label="enableProxy"
                        icon="fa-solid fa-link" />
                    <Button @click="shell('settings put global http_proxy :0')" label="disableProxy"
                        icon="fa-solid fa-unlink" />
                    <Button label="openWhoer" icon="fa-brands fa-wikipedia-w"
                        @click="shell('am start -a android.intent.action.VIEW -d https://whoer.net')" />
                    <Button label="ipinfo" icon="fa-solid fa-info" @click="shell('am start -a android.intent.action.VIEW -d https://ipinfo.io')" />
                    <Button label="reboot" icon="fa-solid fa-sync" @click="shell('reboot')" />
                    <Button label="init" icon="fa-solid fa-wrench" @click="repair(device.serial)" />
                </div>
            </details>
            <details class="collapse collapse-arrow bg-base-200">
                <summary class="collapse-title text-xl font-medium">{{ $t('autoScripts') }}</summary>
                <div class="collapse-content">
                    
                    <Button @click="script('profile', device.serial)" label="setProfile" icon="fa-solid fa-user"
                        :disabled="task_status == 'running'" />
                    <Button @click="script('torch_on', device.serial)" label="torchOn" icon="fa-solid fa-lightbulb"
                        :disabled="task_status == 'running'" />
                    <Button @click="script('torch_off', device.serial)" label="torchOff" icon="fa-solid fa-lightbulb"
                        :disabled="task_status == 'running'" />
                    
                    <Button label="register" icon="fa-solid fa-address-card" @click="script('register', device.serial)"
                        :disabled="task_status == 'running'" />
                    <Button label="registerAll" icon="fa-solid fa-address-card"
                        @click="script('register', device.serial, ['8'])" :disabled="task_status == 'running'" />
                    <Button label="login" icon="fa-solid fa-address-card" @click="script('login', device.serial)"
                        :disabled="task_status == 'running'" />
                </div>
            </details>
            <details class="collapse collapse-arrow bg-base-200">
                <summary class="collapse-title text-xl font-medium">{{ $t('input_output') }}</summary>
                <div class="collapse-content">
                    <input v-model="text" :placeholder="$t('inputText')" v-on:keyup.enter="inputText"
                        class="w-full p-2 my-2 border-2 border-gray-300 rounded">
                    <input id="upload_video_input" type="file" v-on:change="on_upload_video" multiple hidden>
                    <Button label="readClipboard" icon="fa-solid fa-clipboard" @click="readClipboard" />
                    <Button label="uploadVideo" icon="fa-solid fa-upload" @click="uploadVideo" />
                </div>

            </details>
            <div class="divider divider-info">{{ $t('logs') }}</div>
            <div class="p-1">
                <div class="mockup-code">
                    <pre data-prefix=">"
                        v-for="detail in connect_details"><code class="text-success">{{ detail }}</code></pre>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Button from '../Button.vue'
export default {
    props: {
        device: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    components: {
        Button
    },
    data() {
        return {
            img: 'preview.jpg',
            rotation: 0,
            command: "",
            text: "",
            readonly: true,
            fps: 0,
            periodImageCount: 0,
            showEffect: false,
            effectX: 0,
            effectY: 0,
            scrcpy: null,
            touch: false,
            task_status: "idle",
            timer_fps: null,
            timer_task_status: null,
            loading_text: "",
            timer_loading: null,
            connect_details: [],
            settings: {},
            ip: "0.0.0.0",
        }
    },
    methods: {
        uploadVideo(group) {
            this.currentGroup = group
            document.getElementById('upload_video_input').click()
        },
        on_upload_video(e) {
            const formData = new FormData()
            formData.append('serial', this.device.serial)
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i])
            }
            this.$service.upload_video(`http://${this.device.agent_ip}:8091`,formData).then(res => {
            }).catch(err => {
                console.log(err)
            })
        },
        enable_proxy() {
            this.shell(`settings put global http_proxy ${this.settings.proxy_url}`)
            this.$service.enable_proxy_rule({
                serial: this.device.serial,
                ip: this.ip
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        get_ip() {
            this.$service.get_ip({
                baseURL: `http://${this.device.agent_ip}:8091`,
                serial: this.device.serial
            }).then(res => {
                this.ip = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        readClipboard() {
            this.$service.read_clipboard({
                baseURL: `http://${this.device.agent_ip}:7091`,
                serial: this.device.serial
            }).then(res => {
                this.text = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        get_task_status() {
            this.$service.get_task_status({
                serial: this.device.serial
            }).then(res => {
                this.task_status = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        repair(serial) {
            this.$service.init({
                serial: serial,
                init: 0
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        inputText() {
            let encodedText = btoa(this.text);
            this.shell(`am broadcast -a ADB_INPUT_TEXT --es text "${encodedText}"`)
            this.text = ""
        },
        shell(cmd) {
            this.$service.shell({
                serial: this.device.serial,
                cmd: cmd
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        script(script, serial, args) {
            this.$service.script({
                script: script,
                serial: serial,
                args: args
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        coords(boundingW, boundingH, relX, relY, rotation) {
            var w, h, x, y;
            switch (rotation) {
                case 0:
                    w = boundingW
                    h = boundingH
                    x = relX
                    y = relY
                    break
                case 90:
                    w = boundingH
                    h = boundingW
                    x = boundingH - relY
                    y = relX
                    break
                case 180:
                    w = boundingW
                    h = boundingH
                    x = boundingW - relX
                    y = boundingH - relY
                    break
                case 270:
                    w = boundingH
                    h = boundingW
                    x = relY
                    y = boundingW - relX
                    break
            }
            return {x,y,w,h }
        },
        touchSync(operation, event) {
            var e = event;
            if (e.originalEvent) {
                e = e.originalEvent
            }
            e.preventDefault()
            let x = e.offsetX, y = e.offsetY
            let w = e.target.clientWidth, h = e.target.clientHeight
            let scaled = this.coords(w, h, x, y, this.rotation);
            this.scrcpy.send(JSON.stringify({
                operation: operation, // u, d, c, w
                x: scaled.x,
                y: scaled.y,
                w: scaled.w,
                h: scaled.h
            }))
        },
        mouseMoveListener(event) {
            if (this.readonly) {
                return
            }
            if (!this.touch) {
                return
            }
            this.touchSync('m', event)
            this.updateEffectPosition(event)
        },
        mouseUpListener(event) {
            if (this.readonly) {
                return
            }
            this.touchSync('u', event)
            this.showEffect = false;
            this.touch = false;
        },
        mouseLeaveListener(event) {
            if (this.readonly) {
                return
            }
            if (!this.touch) {
                return
            }
            this.touchSync('u', event)
            this.showEffect = false;
            this.touch = false;
        },
        mouseDownListener(event) {
            if (this.readonly) {
                return
            }
            this.touchSync('d', event)
            this.updateEffectPosition(event)
            this.touch = true;
        },
        updateEffectPosition(event) {
            var e = event;
            if (e.originalEvent) {
                e = e.originalEvent
            }
            e.preventDefault()
            this.showEffect = true;
            let x = e.offsetX, y = e.offsetY
            this.effectX = x - 25;
            this.effectY = y - 25;
        },
        
        syncDisplay() {
            this.connect_details.push("try to connect device...")
            this.scrcpy = new WebSocket(`ws://${this.device.agent_ip}:7092`);
            this.scrcpy.onopen = () => {
                this.readonly = false
                this.scrcpy.send(`${this.device.serial}`)
                 // max size: 1200
                 this.scrcpy.send(1200)
                // control: false
                this.scrcpy.send('false')
                this.connect_details.push("device connected!")
                this.connect_details.push("ready to receive image...")
            }
            this.scrcpy.onclose = () => {
                this.readonly = true
                this.img = 'preview.jpg'
                this.connect_details.push("connect closed!")
            }
            this.scrcpy.onerror = () => {
                this.readonly = true
                this.img = 'preview.jpg'
                this.connect_details.push("connect error!")
            }
            this.scrcpy.onmessage = (message) => {
                if (message.data instanceof Blob) {
                    this.periodImageCount += 1 // help for calculate fps
                    let blob = new Blob([message.data], {
                        type: 'image/jpeg'
                    })
                    let URL = window.URL || window.webkitURL
                    // Revoke the old URL before creating a new one
                    if (this.img) {
                        URL.revokeObjectURL(this.img);
                    }
                    let u = URL.createObjectURL(blob)
                    this.img = u
                } else if (/data size: /.test(message.data)) {
                } else if (/^rotation/.test(message.data)) {
                    this.rotation = parseInt(message.data.substr('rotation '.length), 10);
                    console.log("rotation:", this.rotation)
                }
            }
        },
        get_settings() {
            this.$service.get_settings().then((res) => {
                this.settings = res.data;
            });
        },
    },
    mounted() {
        this.get_ip()
        this.syncDisplay()
        // calculate fps
        this.timer_fps = setInterval(() => {
            this.fps = this.periodImageCount / 0.5
            this.periodImageCount = 0
        }, 500)
        this.timer_task_status = setInterval(() => {
            this.get_task_status()
        }, 1000)
        this.timer_loading = setInterval(() => {
            if (this.loading_text.length > 5) {
                this.loading_text = ""
            } else {
                this.loading_text += "."
            }
        }, 500)
        this.get_settings()
    },
    unmounted() {
        console.log('remote unmounted')
        this.readonly = true
        if (this.scrcpy)
            this.scrcpy.close()
        clearInterval(this.timer_fps)
        clearInterval(this.timer_task_status)
        clearInterval(this.timer_loading)
    },
}
</script>