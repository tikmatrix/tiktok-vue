<template>
    <div class="flex flex-col items-start p-4">

        <div class="grid grid-cols-4 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('name') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="group.name" />
        </div>

        <div class="grid grid-cols-8 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-2">{{ $t('autoTrain') }}:</label>
            <input type="checkbox" class="toggle toggle-accent col-span-1" v-model="group.auto_train" true-value="1"
                false-value="0" />
            <div role="alert" class="alert col-span-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-info shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ $t('trainTimeTips') }}</span>
            </div>
        </div>

        <div class="grid grid-cols-8 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-2">{{ $t('trainTimes') }}:</label>

            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time1" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time2" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time3" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time4" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time5" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="train_time6" placeholder="00:00" />
        </div>
        <div class="grid grid-cols-8 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-2">{{ $t('autoPublish') }}:</label>
            <input type="checkbox" class="toggle toggle-accent" v-model="group.auto_publish" true-value="1"
                false-value="0" />
            <div role="alert" class="alert col-span-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-info shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ $t('publishTimeTips') }}</span>
            </div>
        </div>
        <div class="grid grid-cols-8 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-2">{{ $t('publishTimes') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time1" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time2" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time3" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time4" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time5" placeholder="00:00" />
            <input class="border-2 border-gray-300 p-2 rounded col-span-1" v-model="publish_time6" placeholder="00:00" />
        </div>
        <div class="grid grid-cols-4 w-full items-center gap-2 mb-2">
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


        <div class="grid grid-cols-4 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('title') }}</label>

            <textarea class="textarea textarea-success w-full max-w-xs" placeholder="Titles" autocomplete="off"
                v-model="group.title">
            </textarea>
            <div class="label">
                <span class="label-text">Number: {{ group.title ? group.title.split('\n').filter(line => line.trim() !==
                    '').length : 0 }}</span>
            </div>
        </div>

        <div class="grid grid-cols-4 w-full items-center gap-2 mb-2">
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
    props: {
        group: {
            type: Object,
            required: true,

        },
    },

    components: {
    },
    data() {
        return {
            train_time1: '',
            train_time2: '',
            train_time3: '',
            train_time4: '',
            train_time5: '',
            train_time6: '',
            publish_time1: '',
            publish_time2: '',
            publish_time3: '',
            publish_time4: '',
            publish_time5: '',
            publish_time6: '',
        };
    },
    emits: ['add'],
    methods: {
        add() {
            this.group.train_start_time = [this.train_time1, this.train_time2, this.train_time3, this.train_time4, this.train_time5, this.train_time6].join(',');
            this.group.publish_start_time = [this.publish_time1, this.publish_time2, this.publish_time3, this.publish_time4, this.publish_time5, this.publish_time6].join(',');
            // Check publish_start_time format 00:00,01:00,02:00,...
            if (!this.group.train_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('train_start_time format error')
                return
            }
            if (!this.group.publish_start_time.match(/^(\d{2}:\d{2},)*\d{2}:\d{2}$/)) {
                alert('publish_start_time format error')
                return
            }
            if (this.group.id) {
                this.$emit('update', this.group);
            } else {
                this.$emit('add', this.group);
            }

        },
    },
    mounted() {
        if (this.group.train_start_time) {
            const [train_time1, train_time2, train_time3, train_time4] = this.group.train_start_time.split(',');
            this.train_time1 = train_time1;
            this.train_time2 = train_time2;
            this.train_time3 = train_time3;
            this.train_time4 = train_time4;
        }
        if (this.group.publish_start_time) {
            const [publish_time1, publish_time2, publish_time3, publish_time4] = this.group.publish_start_time.split(',');
            this.publish_time1 = publish_time1;
            this.publish_time2 = publish_time2;
            this.publish_time3 = publish_time3;
            this.publish_time4 = publish_time4;
        }
    }
};
</script>