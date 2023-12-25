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
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.start_time" placeholder="00:00" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('title') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.title" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('tags') }}</label>
            <div class="border-2 border-gray-300 p-2 rounded col-span-2 flex flex-wrap">
                <span class="bg-blue-200 text-blue-800 m-1 p-1 rounded cursor-pointer" v-for="(tag, index) in tags"
                    :key="tag" @click="removeTag(index)" v-if="tags">
                    {{ tag }}
                </span>
                <input class="flex-grow" @input="addTag" v-model="newTag" />
            </div>
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
            newTag: '',
            tags: []
        };
    },
    emits: ['update'],
    methods: {
        update() {
            //check start_time format 00:00
            if (!this.group.start_time.match(/^\d{2}:\d{2}$/)) {
                alert('start_time format error')
                return
            }
            this.group.tags = this.tags.join(' ');
            this.$emit('update', this.group);
        },
        addTag(event) {
            let value = event.target.value;
            //value中包含空格和其他内容
            if (value.includes(' ') && value.trim() !== '') {
                this.newTag = '';
                this.tags.push('#' + value.trim());
            }
        },
        removeTag(index) {
            this.tags.splice(index, 1);
        },

    },
    mounted() {
        this.tags = this.group.tags.split(' ');
    }
};
</script>