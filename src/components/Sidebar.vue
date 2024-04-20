<template>
  <label for="my-drawer" aria-label="close Menu" class="drawer-overlay"></label>
  <div class="flex-1 hidden lg:block p-4">
    <font-awesome-icon icon="fa-brands fa-tiktok" />
    <a class="btn btn-ghost text-xl">{{ $t('siteName') }}</a>
  </div>
  <ul class="menu p-4 h-screen w-auto bg-base-200 text-base-content">
    <li v-for="(item, index) in menuItems" :key="index">
      <a :class="{ active: selectedItemIndex === index }" @click="selectItem(index, item)">
        <font-awesome-icon :icon="item.icon" class="w-4 h-4" /> {{ $t(`${item.name}`) }}
      </a>
     
    </li>

    <li>
      <p class="text-sm text-gray-400 p-3">{{ $t('version') + ': ' + settings.version }}</p>
    </li>
  </ul>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'Sidebar',
  setup() {
    const devices = inject('devices')

    return { devices: devices.list }
  },
  props: {
    selectedItem: String,
    default: 'dashboard'

  },
  data() {
    return {
      selectedItemIndex: 0,
      menuItems: [],
      fullMenuItems: [
        { name: 'dashboard', icon: 'tachometer-alt' },
        { name: 'devices', icon: 'mobile-alt' },
        { name: 'groups', icon: 'users' },
        { name: 'accounts', icon: 'user' },
        { name: 'analytics', icon: 'chart-bar' },
        { name: 'materials', icon: 'images' },
        { name: 'comments', icon: 'comment' },
        { name: 'proxys', icon: 'globe' },
        { name: 'postBots', icon: 'upload' },
        { name: 'editBots', icon: 'video' },
        { name: 'musics', icon: 'music' },
        { name: 'avatars', icon: 'user-circle' },
        { name: 'publishJobs', icon: 'robot' },
        { name: 'trainJobs', icon: 'sync-alt' },
        { name: 'dialogWatcher', icon: 'exclamation-circle' },
        { name: 'settings', icon: 'cogs' }
      ],
      settings: {
        version: '0.0.1',
      }
    }
  },
  
  emits: ['menu_selected'],
  methods: {
    get_menus() {
      this.$service.get_menus().then(res => {
        this.menuItems = this.fullMenuItems.filter(item => res.data.includes(item.name))
        this.selectItem(this.selectedItemIndex, this.menuItems[this.selectedItemIndex])
      })
    },
    selectItem(index, item) {
      this.selectedItemIndex = index
      this.$emit('menu_selected', item)
    },
    get_settings() {
      this.$service.get_settings().then(res => {
        this.settings = res.data
      })
    },
    update_setting() {
      this.$service
        .update_settings(this.settings)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.get_menus()
    
    this.get_settings()
  }
}
</script>
