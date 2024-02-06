<template>
    <div class="min-h-screen bg-gray-800 text-white flex flex-col">
        <h1 class="text-2xl p-3 mb-6">
            <font-awesome-icon icon="fa-brands fa-tiktok" /> {{ $t('siteName') }}
        </h1>
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 class="text-lg text-gray-700 mb-2">{{ $t('connectionMode') }}</h2>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">{{ settings.adb_mode }}</span>
                    <input id="toggle" name="toggle" type="checkbox" class="toggle" v-model="settings.adb_mode"
                        true-value="tcp" false-value="usb" />
                </label>
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
            <p class="text-sm text-gray-400  p-3">{{ $t('version') + ': ' + settings.version }}</p>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {

            selectedItem: 0,
            menuItems: [
                { name: 'devices', icon: 'mobile-alt' },
                { name: 'groups', icon: 'users' },
                { name: 'accounts', icon: 'user' },
                { name: 'materials', icon: 'images' },
                { name: 'musics', icon: 'music' },
                { name: 'avatars', icon: 'user-circle' },
                { name: 'autoPublish', icon: 'robot' },
                { name: 'autoTrain', icon: 'sync-alt' },
                { name: 'dialogWatcher', icon: 'exclamation-circle' },
                { name: 'settings', icon: 'cogs' },
            ]
            , open: false,
            showDemoTip: false,
            editMode: false,
            inputCode: '',
            settings: {
                version: '0.0.1',
                adb_mode: ''
            }
        }
    },
    watch: {
        'settings.adb_mode': function (newVal, oldVal) {
            console.log('adb_mode changed from', oldVal, 'to', newVal);

            if (newVal === 'tcp' && oldVal === 'usb') {
                this.$service.script({
                    script: 'switch_tcp',
                }).then(res => {
                    console.log(res)
                    this.update_setting()
                }).catch(err => {
                    console.log(err)
                })
            } else if (newVal === 'usb' && oldVal === 'tcp') {
                this.$service.script({
                    script: 'switch_usb',
                }).then(res => {
                    console.log(res)
                    this.update_setting()
                }).catch(err => {
                    console.log(err)
                })
            }
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
                this.$refs.licenseInput.focus();
            });
        },
        disableEditMode() {
            this.editMode = false;
        },

        get_settings() {
            this.$service.get_settings().then((res) => {
                this.settings = res.data;
            });
        },
        update_setting() {
            this.$service.update_settings(this.settings).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.selectItem(this.selectedItem, this.menuItems[this.selectedItem]);
        this.showDemoTip = import.meta.env.VITE_APP_MOCK === 'true';
        this.get_settings();
    }
}
</script>