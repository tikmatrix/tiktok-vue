<template>
    <div class="flex flex-col items-start p-4">

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('name') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.name" />
        </div>

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('autoTrain') }}:</label>
            <select class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.auto_train">
                <option value="0">{{ $t('disable') }}</option>
                <option value="1">{{ $t('enable') }}</option>
            </select>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('startTime') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.train_start_time"
                placeholder="00:00" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('autoPublish') }}:</label>
            <select class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.auto_publish">
                <option value="0">{{ $t('disable') }}</option>
                <option value="1">{{ $t('enable') }}</option>
            </select>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('publishType') }}:</label>
            <div class="col-span-2 flex items-center gap-4">
                <div class="flex items-center">
                    <input type="radio" id="selfMade" value="1" v-model="group.publish_type"
                        class="form-radio text-blue-500 h-4 w-4">
                    <label for="selfMade" class="ml-2">{{ $t('selfMade') }}</label>
                </div>
                <div class="flex items-center">
                    <input type="radio" id="aiMade" value="2" v-model="group.publish_type"
                        class="form-radio text-blue-500 h-4 w-4">
                    <label for="aiMade" class="ml-2">{{ $t('aiMade') }}</label>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('startTime') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.publish_start_time"
                placeholder="00:00" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('title') }}</label>
            <textarea class="textarea textarea-success w-full max-w-xs" placeholder="Titles" autocomplete="off"
                v-model="group.title">
            </textarea>
            <div class="label">
                <span class="label-text">Number: {{ group.title ? group.title.split('\n').filter(line => line.trim() !==
                    '').length : 0 }}</span>
            </div>
        </div>

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('productLink') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.product_link" />
        </div>
        <!-- other fields... -->
        <div class=" mt-32 w-full flex justify-end">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="update">{{ $t('update') }}</button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
        };
    },
    emits: ['update'],
    methods: {
        update() {
            // Check publish_start_time format 00:00,01:00,02:00,...
            if (!this.group.train_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('train_start_time format error')
                return
            }
            if (!this.group.publish_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('publish_start_time format error')
                return
            }
            this.$emit('update', this.group);
        },


    },
    mounted() {
    }
};
</script>