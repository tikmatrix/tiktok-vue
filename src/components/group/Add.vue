<template>
    <div class="flex flex-col items-start p-4">

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('name') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.name" />
        </div>

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('autoTrain') }}:</label>
            <input type="checkbox" class="toggle toggle-accent" v-model="group.auto_train" true-value="1" false-value="0" />
        </div>

        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('startTime') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.train_start_time"
                placeholder="00:00" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('autoPublish') }}:</label>
            <input type="checkbox" class="toggle toggle-accent" v-model="group.auto_publish" true-value="1"
                false-value="0" />
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
                <span class="label-text">Number: {{ group.title.split('\n').filter(line => line.trim() !== '').length
                }}</span>
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
                @click="add">{{ $t('add') }}</button>
        </div>
    </div>
</template>

<script>

export default {
    components: {
    },
    data() {
        return {
            group: {
                auto_train: 1,
                auto_publish: 1,
                publish_start_time: '02:10,03:10',
                train_start_time: '20:00,21:00',
                publish_type: 1,
                title: '',
            },
        };
    },
    emits: ['add'],
    methods: {
        add() {
            // Check publish_start_time format 00:00,01:00,02:00,...
            if (!this.group.train_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('train_start_time format error')
                return
            }
            if (!this.group.publish_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('publish_start_time format error')
                return
            }
            this.$emit('add', this.group);
        },
    },
    mounted() {

    }
};
</script>