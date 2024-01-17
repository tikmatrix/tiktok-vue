<template>
    <div class="m-4">
        <div class="m-5">
            <span
                class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center whitespace-nowrap">{{
                    device.id }}</span>
            <span class="m-1" @click="copyToClipboard">{{ device.serial }}</span><br />
            <span v-if="device.account" class="text-green-500 m-1">{{ device.account }}</span>
            <span v-else class="text-red-500 m-1">{{ $t('unbinded') }}</span>
            <Button label="shell" :loadingTime=1 color="bg-gray-500 text-white" icon="fa-solid fa-terminal"
                @click="$emit('show_shell', device)" />
        </div>
        <img @click="$emit('show_device', device)" v-bind:src="img"
            class="rounded-lg  cursor-pointer transform hover:scale-105 transition-transform duration-200" />
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