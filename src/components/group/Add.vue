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
            <label class="font-bold text-right col-span-1">{{ $t('autoPublish') }}:</label>
            <select class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.auto_publish">
                <option value="0">{{ $t('disable') }}</option>
                <option value="1">{{ $t('enable') }}</option>
            </select>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('startTime') }}</label>
            <VueDatePicker class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.start_time"
                format="HH:mm:ss" position="center" locale="zh" time-picker></VueDatePicker>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('title') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.title" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('tags') }}</label>
            <div class="border-2 border-gray-300 p-2 rounded col-span-2 flex flex-wrap">
                <span class="bg-blue-200 text-blue-800 m-1 p-1 rounded cursor-pointer"
                    v-for="(tag, index) in group.tags?.split(' ')" :key="tag" @click="removeTag(index)">{{ tag }}</span>
                <input class="flex-grow" @input="addTag" v-model="newTag" />
            </div>
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
                tags: '',//空格分隔的tag
                start_time: new Date(),
            },
            newTag: '',
        };
    },
    emits: ['add'],
    methods: {
        add() {
            this.$emit('add', this.group);
        },
        addTag(event) {
            let value = event.target.value;
            //value中包含空格和其他内容
            if (value.includes(' ') && value.trim() !== '') {
                this.group.tags += value;
                this.newTag = '';
                console.log(this.group.tags);
            }
        },
        removeTag(index) {
            let tags = this.group.tags.split(' ');
            tags.splice(index, 1);
            this.group.tags = tags.join(' ');
        },

    },
    mounted() {

    }
};
</script>