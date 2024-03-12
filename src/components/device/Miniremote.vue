<template>
    <div @click="$emit('show_device', device)"
        class="relative rounded-lg border-4 border-black shadow-xl cursor-pointer transform hover:scale-105 transition-transform duration-100">
        <img v-bind:src="img" />
        <div class="absolute top-0 left-0 text-white">
            <h1 class=" font-bold text-lg p-2">{{ index + 1 }}</h1>
        </div>
    </div>
</template>
<script>
import Button from '../Button.vue'
import useClipboard from 'vue-clipboard3';
export default {
    components: {
        Button
    },
    props: {
        index: {
            type: Number,
            default: 0
        },
        device: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    setup(props) {
        const { toClipboard } = useClipboard()
        const copyToClipboard = () => {
            toClipboard(props.device.serial)
        }
        return {
            copyToClipboard
        }
    },
    data() {
        return {
            img: 'preview.jpg',
            err: '',
            display: null,
            mjpeg: null,
            scrcpy: null,
        }
    },
    methods: {
        syncDisplay() {
            this.scrcpy = new WebSocket(`ws://${this.device.agent_ip}:7092`);
            this.scrcpy.onopen = () => {
                this.readonly = false
                this.scrcpy.send(`${this.device.serial}`)
                // max size: 800
                this.scrcpy.send(800)
                // control: false
                this.scrcpy.send('false')
            }
            this.scrcpy.onclose = () => {
                this.readonly = true
                this.img = 'preview.jpg'
            }
            this.scrcpy.onerror = () => {
                this.readonly = true
                this.img = 'preview.jpg'
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
    },
    mounted() {
        this.syncDisplay()
    },
    unmounted() {
        if (this.scrcpy) {
            this.scrcpy.close()
        }
    }, 
}
</script>