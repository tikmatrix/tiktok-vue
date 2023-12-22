<template>
    <div class="m-4 flex">
        <div class="relative">
            <img ref="screen" v-bind:src="img" class="w-[800px] rounded-lg border-4  border-black shadow-lg cursor-pointer"
                @mousedown="mouseDownListener" @mouseup="mouseUpListener" @mouseleave="mouseLeaveListener"
                @mousemove="mouseMoveListener" />
            <div v-if="showEffect" class="absolute rounded-full w-12 h-12 bg-white opacity-50 pointer-events-none"
                :style="{ top: `${effectY}px`, left: `${effectX}px` }"></div>
        </div>
        <div class="m-1">
            <p class="p-1 text-lg font-bold">{{ device.serial }}
                <Button label="repair" icon="fa-solid fa-wrench" @click="repair(device.serial)" />
            </p>
            <div class="flex items-center space-x-2" v-show="readonly">
                <svg class="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="p-1 text-lg font-bold text-red-500">{{ $t('connecting') }}...</p>
            </div>
            <p class="p-1 text-green-500">fps: <span v-text="fps.toFixed(1)"></span></p>
            <div class="p-1">
                <Button label="menu" icon="fa-solid fa-bars" @click="shell('input keyevent KEYCODE_APP_SWITCH')" />
                <Button label="back" icon="fa-solid fa-chevron-left" @click="shell('input keyevent KEYCODE_BACK')" />
                <Button label="home" icon="fa-solid fa-home" @click="shell('input keyevent KEYCODE_HOME')" />
                <Button label="wakeup" icon="fa-solid fa-mobile-screen" @click="shell('input keyevent KEYCODE_WAKEUP')" />
                <Button label="sleep" icon="fa-solid fa-mobile" @click="shell('input keyevent KEYCODE_SLEEP')" />
                <Button label="openTiktok" icon="fa-brands fa-tiktok"
                    @click="shell('am start -n com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity')" />
                <Button label="stopTiktok" icon="fa-brands fa-tiktok"
                    @click="shell('am force-stop com.zhiliaoapp.musically')" />
                <Button label="clearTiktok" icon="fa-solid fa-trash" @click="clearTiktok" />
            </div>

            <!-- <div class="p-1">
                <p class="text-lg font-bold">快捷操作</p>
                <Button label="打开Whoer.net" icon="fa-brands fa-wikipedia-w"
                    @click="shell('am start -a android.intent.action.VIEW -d https://whoer.net')" />
                <Button label="打开Tiktok" icon="fa-brands fa-tiktok"
                    @click="shell('am start -n com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity')" />
                <input id="upload_material_input" type="file" v-on:change="onFileSelected" hidden>
                <Button label="上传素材" icon="fa-solid fa-video" @click="upload_material" />
                <Button label="清除Tiktok缓存" icon="fa-solid fa-trash" @click="clearTiktok" />
            </div> -->
            <div class="p-1">
                <p class="text-lg font-bold">{{ $t('autoScripts') }}</p>
                <Button label="register" icon="fa-solid fa-address-card" @click="script('register', device.serial)" />
                <Button label="login" icon="fa-solid fa-address-card" @click="script('login', device.serial)" />
                <Button label="uploadAvatar" icon="fa-solid fa-user-plus" @click="script('upload_avatar', device.serial)" />
                <Button label="autoTrain" icon="fa-solid fa-hand-holding-droplet"
                    @click="script('automated', device.serial)" />
            </div>


            <div class="p-1">
                <p class="text-lg font-bold">{{ $t('keyboard') }}</p>
                <input v-model="text" :placeholder="$t('inputText')" v-on:keyup.enter="inputText"
                    class="w-full p-3 my-2 border-2 border-gray-300 rounded">
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
            minicap: null,
            minitouch: null,
            touch: false,
        }
    },
    methods: {
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
        clearTiktok() {
            //弹窗二次确认
            if (confirm("确定要清除Tiktok缓存吗,会退出账号？")) {
                this.shell('pm clear com.zhiliaoapp.musically')
            }
        },
        upload_material() {
            //触发选择文件
            document.getElementById('upload_material_input').click();

        },
        onFileSelected(e) {
            //拼接FormData
            const formData = new FormData()
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i])
            }
            formData.append('serial', this.device.serial)
            this.$service.upload_material(formData).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },

        killMinitouch() {
            this.shell('pkill minitouch')
            this.syncTouchpad()
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

            return {
                xP: x / w,
                yP: y / h,
            }
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
            this.minitouch.send(JSON.stringify({
                operation: operation, // u, d, c, w
                index: 0,
                pressure: 0.5,
                xP: scaled.xP,
                yP: scaled.yP,
            }))
            this.minitouch.send(JSON.stringify({ operation: 'c' }))
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
        syncTouchpad() {
            this.minitouch = this.$service.connect_ws("minitouch", this.device.agent_ip, this.device.forward_port)

            this.minitouch.onopen = (ret) => {
                this.readonly = false
                console.log("minitouch connected")
                this.minitouch.send(JSON.stringify({ // touch reset, fix when device is outof control
                    operation: "r",
                }))
            }
            this.minitouch.onmessage = (message) => {
                console.log("minitouch recv", message)
            }

            this.minitouch.onclose = () => {
                this.readonly = true
                console.log("minitouch closed")
            }
        },
        syncDisplay() {
            this.minicap = this.$service.connect_ws("minicap", this.device.agent_ip, this.device.forward_port)
            this.minicap.onclose = () => {
                console.log('minicap onclose', arguments)
                this.img = 'preview.jpg'
            }
            this.minicap.onerror = () => {
                console.log('minicap onerror', arguments)
            }
            this.minicap.onmessage = (message) => {
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
                    console.log("minicap rotation:", this.rotation)
                } else {
                    console.log("minicap receive message:", message.data)
                }
            }
            this.minicap.onopen = () => {
                console.log('minicap connected')
            }
        },
    },
    mounted() {
        this.syncDisplay()
        // this.syncTouchpad()
        this.killMinitouch()

        // calculate fps
        setInterval(() => {
            this.fps = this.periodImageCount / 0.5
            this.periodImageCount = 0
        }, 500)
    },
    unmounted() {
        console.log('remote unmounted')
        this.readonly = true
        console.log(this.minicap)
        if (this.minicap)
            this.minicap.close()
        if (this.minitouch)
            this.minitouch.close()
    },

}
</script>