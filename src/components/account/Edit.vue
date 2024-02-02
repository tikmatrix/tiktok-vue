<template>
    <div class="flex flex-col items-start p-4 min-h-96">
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('email') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="account.email" />
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right">{{ $t('password') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded w-full" v-model="account.pwd" />
        </div>
        <!-- <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right">{{ $t('fans') }}:</label>
            <input class="border-2 border-gray-300 p-2 rounded w-full" v-model="account.fans" type="number"/>
        </div> -->
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('device') }}:</label>
            <div class="relative col-span-2">
                <input class="border-2 border-gray-300 p-2 rounded w-full" v-model="account.device"
                    @click="showDeviceList = !showDeviceList" readonly />
                <div class="absolute z-10 bg-white border border-gray-300 rounded mt-2 w-full overflow-y-auto max-h-32"
                    v-show="showDeviceList">
                    <div class="cursor-pointer p-2 hover:bg-gray-200" v-for="(device, index) in devices"
                        :key="device.serial" @click="selectDevice(device)">{{ device.id }} - {{ device.serial }}
                        <!-- <span v-if="device.email" class="text-green-500 m-1">{{ device.email }}</span>
                        <span v-else class="text-red-500 m-1">{{ $t('unbinded') }}</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('group') }}:</label>
            <div class="relative col-span-2">
                <input class="border-2 border-gray-300 p-2 rounded w-full" v-model="account.group_name"
                    @click="showGroupList = !showGroupList" readonly />
                <div class="absolute z-10 bg-white border border-gray-300 rounded mt-2 w-full overflow-y-auto max-h-32"
                    v-show="showGroupList">
                    <div class="cursor-pointer p-2 hover:bg-gray-200" v-for="(group, index) in groups" :key="group.id"
                        @click="selectGroup(group)">{{ group.id }} - {{ group.name }}
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="grid grid-cols-3 w-full items-center gap-2 mb-2">
            <label class="font-bold text-right col-span-1">{{ $t('shop_creator') }}:</label>
            <select class="border-2 border-gray-300 p-2 rounded col-span-2" v-model="account.shop_creator">
                <option value="0">{{ $t('disable') }}</option>
                <option value="1">{{ $t('enable') }}</option>
            </select>
        </div> -->

        <!-- other fields... -->
        <div class="mt-4 w-full flex justify-end">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="update">{{ $t('update') }}</button>
        </div>
    </div>
</template>

<script>
import { inject } from 'vue';
export default {
    setup() {
        const devices = inject('devices');
        return { devices: devices.list };
    },
    props: {
        account: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showDeviceList: false,
            showGroupList: false,
            groups: [],
        };
    },
    methods: {
        update() {
            this.$emit('update', this.account);
        },

        selectDevice(device) {
            this.account.device = device.serial;
            this.showDeviceList = false;
        },
        get_groups() {
            this.$service.get_groups().then(res => {
                this.groups = res.data
                this.account.group_name = this.groups.find(group => group.id === this.account.group_id).name
            }).catch(err => {
                console.log(err)
            })
        },
        selectGroup(group) {
            this.account.group_id = group.id;
            this.account.group_name = group.name;
            this.showGroupList = false;
        },
    },
    mounted() {
        this.account.group_name = this.account.group_id
        this.get_groups();
    }
};
</script>