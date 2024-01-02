<template>
    <button
        :class="`lg:px-4 lg:py-2 rounded lg:m-1 px-2 py-1 m-0.5 ${color} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:' + hoverColor}`"
        :disabled="disabled || isLoading" @click="handleClick">
        <font-awesome-icon v-if="icon" :icon="icon" />
        <span class="lg:m-1 m-0.5">{{ isLoading ? $t('execing') + '...' : $t(`${label}`) }}</span>
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
    computed: {
        hoverColor() {
            return this.color.replace('500', '700');
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