<template>
    <label for="my-drawer" aria-label="close Menu" class="drawer-overlay"></label>
    <div class="flex-1 hidden lg:block p-4">
        <font-awesome-icon icon="fa-brands fa-tiktok" />
        <a class="btn btn-ghost text-xl">{{ $t('siteName') }}</a>
    </div>
    <ul class="menu p-4 w-60 min-h-full bg-base-200 text-base-content">


        <!-- <div class="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 class="text-lg text-gray-700 mb-2">{{ $t('connectionMode') }}</h2>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">{{ settings.adb_mode }}</span>
                    <input id="toggle" name="toggle" type="checkbox" class="toggle" v-model="settings.adb_mode"
                        true-value="tcp" false-value="usb" />
                </label>
            </div>

        </div> -->
        <li v-for="(item, index) in menuItems" :key="index">
            <a :class="{ 'active': selectedItem === index }" @click="selectItem(index, item)">
                <font-awesome-icon :icon="item.icon" /> {{ $t(`${item.name}`) }}
            </a>
        </li>

        <li>
            <p class="text-sm text-gray-400  p-3">{{ $t('version') + ': ' + settings.version }}</p>
        </li>
    </ul>
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
                { name: 'publishJobs', icon: 'robot' },
                { name: 'trainJobs', icon: 'sync-alt' },
                { name: 'dialogWatcher', icon: 'exclamation-circle' },
                { name: 'settings', icon: 'cogs' },
            ]
            , open: false,

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
            this.update_setting()
            if (newVal === 'tcp' && oldVal === 'usb') {
                this.$service.script({
                    script: 'switch_tcp',
                }).then(res => {
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

        this.get_settings();
    }
}
</script>