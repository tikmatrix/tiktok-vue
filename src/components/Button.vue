<template>
    <button
        :class="`px-4 py-2 rounded m-1 ${color} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`"
        :disabled="disabled || isLoading" @click="handleClick">
        <font-awesome-icon v-if="icon" :icon="icon" />
        <span class="m-1">{{ isLoading ? $t('execing') + '...' : $t(`${label}`) }}</span>
    </button>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'bg-blue-500 text-white'
        },
        loadingTime: {
            type: Number,
            default: 3000 // default to 3 seconds
        }
    },
    data() {
        return {
            isLoading: false
        }
    },
    methods: {
        handleClick() {
            this.isLoading = true
            setTimeout(() => {
                this.isLoading = false
            }, this.loadingTime)
        }
    }
}
</script>