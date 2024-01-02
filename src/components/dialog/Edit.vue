<template>
    <div class="flex flex-col items-start p-4 min-h-96">
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('conditions') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="watcher.conditions" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('action') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="watcher.action" />
        </div>


        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('status') }}:</label>
            <select class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="watcher.status">
                <option value="0">Disable</option>
                <option value="1">Enable</option>
            </select>
        </div>

        <!-- other fields... -->
        <div class="mt-4 w-full flex justify-end">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="update">{{ $t('update') }}</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        watcher: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
        };
    },
    methods: {
        update() {
            this.$emit('update', this.watcher);
        },

    },
    mounted() {
    }
};
</script>