<template>
    <div class="flex flex-col items-start p-4">
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('startTime') }}</label>
            <VueDatePicker class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="job.start_time"
                format="yyyy-MM-dd HH:mm:ss" position="center" locale="zh" time-picker-inline></VueDatePicker>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('material') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="job.material"
                @click="openMaterialLibrary" readonly />
            <SelectMaterials class="border-2 border-gray-300 p-2 rounded col-span-3" v-if="showMaterialLibrary"
                @select="selectMaterial" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('account') }}</label>
            <div class="relative col-span-2">
                <input class="border-2 border-gray-300 p-2 rounded w-full" v-model="job.account"
                    @click="showAccountList = !showAccountList" readonly />
                <div class="absolute z-10 bg-white border border-gray-300 rounded mt-2 w-full overflow-y-auto"
                    style="max-height: 200px;" v-show="showAccountList">
                    <div class="cursor-pointer p-2 hover:bg-gray-200" v-for="(account, index) in accounts"
                        :key="account.email" @click="selectAccount(account)">{{ index + 1 }} - {{ account.device.slice(-4)
                        }} - {{ account.email }}</div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('title') }}</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="job.title" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('tags') }}</label>
            <div class="border-2 border-gray-300 p-2 rounded col-span-2 flex flex-wrap">
                <span class="bg-blue-200 text-blue-800 m-1 p-1 rounded cursor-pointer"
                    v-for="(tag, index) in job.tags?.split(' ')" :key="tag" @click="removeTag(index)">{{ tag }}</span>
                <input class="flex-grow" @input="addTag" v-model="newTag" />
            </div>
        </div>
        <!-- other fields... -->
        <div class=" mt-32 w-full flex justify-end">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="create">{{ $t('add') }}</button>
        </div>
    </div>
</template>

<script>
import SelectMaterials from '../material/SelectMaterials.vue';

export default {
    components: {
        SelectMaterials
    },
    data() {
        return {
            job: {
                tags: '',//空格分隔的tag
                start_time: new Date(),
                account: '',
                material: ''
            },
            newTag: '',
            showMaterialLibrary: false,
            showAccountList: false,
            accounts: []
        };
    },
    emits: ['create'],
    methods: {
        create() {
            this.$emit('create', this.job);
        },
        addTag(event) {
            let value = event.target.value;
            //value中包含空格和其他内容
            if (value.includes(' ') && value.trim() !== '') {
                this.job.tags += value;
                this.newTag = '';
                console.log(this.job.tags);
            }
        },
        removeTag(index) {
            let tags = this.job.tags.split(' ');
            tags.splice(index, 1);
            this.job.tags = tags.join(' ');
        },
        openMaterialLibrary() {
            this.showMaterialLibrary = true;
        },
        selectMaterial(material) {
            this.job.material = material.name;
            this.showMaterialLibrary = false;
        },
        selectAccount(account) {
            this.job.account = account.email;
            this.showAccountList = false;
        }
    },
    mounted() {
        this.$service.get_accounts().then(res => {
            console.log(res)
            //过滤automated=0的账号
            res.data = res.data.filter(account => account.automated === 1 && account.online === 1);
            //按照device排序
            res.data.sort((a, b) => {
                return a.device.localeCompare(b.device);
            });
            this.accounts = res.data
        }).catch(err => {
            console.log(err)
        })
    }
};
</script>