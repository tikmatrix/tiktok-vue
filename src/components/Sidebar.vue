<template>
    <div class="min-h-screen bg-gray-800 text-white flex flex-col">
        <h1 class="text-2xl p-3 mb-6">
            <font-awesome-icon icon="fa-brands fa-tiktok" /> {{ $t('siteName') }}
        </h1>
        <div class="flex items-center p-3 space-x-2">
            <font-awesome-icon icon="fa-solid fa-key" class="text-xl" />
            <div class="ml-3">
                <!-- If in edit mode, show input field. -->
                <input ref="cdkInput" v-if="editMode" v-model="cdk.code" @blur="disableEditMode"
                    @keyup.enter="disableEditMode" class="bg-gray-800 text-white" />
                <!-- If cdk.name is not empty and not in edit mode, display it. -->
                <span v-else-if="cdk.name">{{ cdk.name }}</span>
                <!-- Otherwise, show 'Please enter CDK' text. -->
                <span v-else @click="enableEditMode">请填写 CDK</span>
                <div v-if="cdk.name" class="text-sm font-medium leading-none text-gray-400">{{ cdk.code }}</div>
            </div>
        </div>
        <hr class="mb-6" />
        <ul>
            <li v-for="(item, index) in menuItems" :key="index">
                <a href="#" class="m-1 p-3 block rounded hover:bg-gray-700"
                    :class="{ 'bg-gray-700': selectedItem === index }" @click="selectItem(index, item)">
                    <font-awesome-icon :icon="item.icon" /> {{ $t(`${item.name}`) }}
                </a>
            </li>
        </ul>
        <div class="mt-auto">
            <div v-show="showDemoTip" class="m-2">
                <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p class="font-bold">{{ $t('demoTip', { email: 'admin@niostack.com' }) }}</p>
                    <a href="https://t.me/+iGhozoBfAbI5YmE1">Join Telegram Group</a>
                </div>
            </div>
            <div class="relative inline-flex items-center bg-gray-800 rounded-full p-2 border border-white">
                <font-awesome-icon icon="globe" class="text-white" />
                <div class="relative">
                    <div @click="open = !open"
                        class="appearance-none bg-transparent border-0 text-white pl-2 pr-8 rounded-full cursor-pointer">
                        {{ $i18n.locale === 'en' ? 'English' : '中文' }}
                    </div>
                    <div v-show="open"
                        class="absolute z-10 mb-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 bottom-full">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div @click="changeLocale('en')"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem">
                                English
                            </div>
                            <div @click="changeLocale('zh-CN')"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem">
                                中文
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="text-sm text-gray-400  p-3">{{ $t('version') + ': ' + version }}</p>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            version: '0.0.1',
            selectedItem: 0,
            menuItems: [
                { name: 'devices', icon: 'laptop' },
                { name: 'groups', icon: 'users' },
                { name: 'accounts', icon: 'user' },
                { name: 'materials', icon: 'images' },
                { name: 'autoPublish', icon: 'robot' },
                { name: 'autoTrain', icon: 'sync-alt' },
                { name: 'dialogWatcher', icon: 'exclamation-circle' },
            ]
            , open: false,
            showDemoTip: false,
            cdk: {
                name: '',
                code: ''
            },
            editMode: false
        }
    },
    methods: {
        selectItem(index, item) {
            this.selectedItem = index;
            this.$emit('menu_selected', item);
        },
        changeLocale(locale) {
            this.$i18n.locale = locale;
            this.open = false;
        },
        enableEditMode() {
            this.editMode = true;
            this.$nextTick(() => {
                this.$refs.cdkInput.focus();
            });
        },
        disableEditMode() {
            this.editMode = false;
            this.add_cdk();
        },
        get_cdk() {
            this.$service.get_cdk().then((res) => {
                this.cdk = res.data;
            });
        },
        add_cdk() {
            this.$service.add_cdk({
                code: this.cdk.code
            }).then((res) => {
                this.cdk = res.data;
            });
        }
    },
    mounted() {
        this.selectItem(this.selectedItem, this.menuItems[this.selectedItem]);
        this.showDemoTip = import.meta.env.VITE_APP_MOCK === 'true';
    }
}
</script>