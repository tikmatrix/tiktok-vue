<template>
    <button :class="`btn btn-sm ${color} ml-2 mb-1 mt-1`" :disabled="disabled || isLoading" @click="handleClick">
        <span class="loading loading-spinner" v-if="isLoading"></span>
        <font-awesome-icon v-if="icon && !isLoading" :icon="icon" class="h-4 w-4" />
        {{ isLoading ? $t('execing') : $t(`${label}`) }}
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
            default: 'btn-success'
        },
        loadingTime: {
            type: Number,
            default: 1000 // default to 1 seconds
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