<template>
    <div @click="$emit('show_device', device)"
        class="relative rounded-lg border-4 border-black shadow-xl cursor-pointer transform hover:scale-105 transition-transform duration-100">
        <img v-bind:src="img" />

        <div class="absolute top-2 left-2 p-1 text-white bg-black bg-opacity-50 rounded-lg">
            <h1 class=" font-bold text-lg">{{ index + 1 }}</h1>
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
            ws: null,
        }
    },
    methods: {
        syncDisplay() {
            this.ws = this.$service.connect_ws("minicap", this.device.agent_ip, this.device.forward_port)

            this.ws.onclose = () => {
                console.log('onclose', arguments)
            }
            this.ws.onerror = () => {
                console.log('onerror', arguments)
            }
            this.ws.onmessage = (message) => {
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
                    // console.log("receive message:", message.data)
                } else if (/^rotation/.test(message.data)) {
                    this.rotation = parseInt(message.data.substr('rotation '.length), 10);
                    console.log("rotation:", this.rotation)
                } else {
                    console.log("receive message:", message.data)
                }
            }
            this.ws.onopen = () => {
                console.log('onopen', arguments)
                this.ws.send(`ws://127.0.0.1:${this.device.forward_port}/minicap`)
            }
        },
    },
    mounted() {
        this.syncDisplay()
    },
    unmounted() {
        if (this.ws) {
            this.ws.close()
        }
    },
}
</script>