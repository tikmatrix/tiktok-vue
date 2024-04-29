<template>
  <div class="bg-white m-4 flex flex-col rounded-lg shadow">
    <div class="bg-blue-500 p-4 rounded-t-lg">
      <div class="flex flex-row items-center">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="text-white h-8 w-8 mr-2" />
        <div>
          <span class="text-xl text-white font-bold">{{ $t('siteName') }}</span>
          <br>
          <span class="text-xs text-white font-sans">www.tikmatrix.com</span>
          <span class="text-sm text-white ml-2">v{{ settings.version }}</span>
        </div>

        <font-awesome-icon icon="fa-solid fa-angle-left"
          class="text-white h-6 w-6 ml-4 bg-blue-300 p-2 rounded-lg cursor-pointer" />
      </div>
    </div>
    <div class="p-4">
      <div role="tablist" class="tabs tabs-lifted">
        <a ref="settings" role="tab" class="tab tab-active" @click="selectTab('settings')">{{ $t('general') }}</a>
        <a ref="tools" role="tab" class="tab" @click="selectTab('tools')">{{ $t('toolbox') }}</a>
      </div>
      <div class="flex flex-row flex-wrap mt-2">
        <button v-for="(item, index) in menuItems" :key="index"
          class="btn btn-sm bg-blue-500 hover:bg-blue-300 border-0 text-white tooltip text-xs block font-normal ml-1 mb-1 min-w-max"
          :data-tip="$t(item.name)" @click="selectItem(index, item)">
          <font-awesome-icon :icon="item.icon" class="h-3 w-3" />{{ $t(`${item.name}`) }}
        </button>
      </div>
      <div class="flex flex-col">
        <span class="font-sans">{{ $t('groups') }}</span>
        <div class="cursor-pointer items-center" @click="showAddGroup = !showAddGroup">
          <font-awesome-icon icon="fa-solid fa-plus" class="h-4 w-4 text-blue-500" />
          <span class="text-xs text-blue-500">{{ $t('addGroup') }}</span>
        </div>
        <input v-if="showAddGroup" class="input input-sm input-bordered w-full max-w-xs" type="text"
          v-model="newGroupName" />
        <div class="flex flex-row form-control items-center" v-for="(item, index) in groups" :key="item.id">
          <label class="label cursor-pointer">
            <input type="checkbox" class="checkbox checkbox-sm" @change="selectAll(item.id)"
              :checked="selectedAlls[item.id]" />
            <span class="label-text text-blue-500  text-xs">{{ item.name }}({{ groupDevices[item.id].length }})</span>
          </label>
          <span class="label-text text-xs text-right flex-1">{{ $t('selected') }}
            {{ selections[item.id].length }}
            {{ $t('units') }}
          </span>
          <div class="tooltip" :data-tip="$t('moveToGroup')">
            <details :ref="'moveToGroupMenu_' + item.id" class="dropdown dropdown-top">
              <summary class="btn btn-xs bg-transparent hover:bg-transparent border-0">
                <font-awesome-icon icon="fa-solid fa-share" class="text-blue-500"></font-awesome-icon>
              </summary>
              <ul class="dropdown-content z-[10] menu menu-sm p-2 shadow bg-base-200 rounded-box w-52">
                <li v-for="(subitem, index) in groups" :key="subitem.id"><a @click="moveToGroup(item.id, subitem.id)">{{
                  subitem.name }}</a>
                </li>
              </ul>
            </details>
          </div>
        </div>

        <div class="flex flex-row form-control items-center">
          <label class="label cursor-pointer">
            <input type="checkbox" class="checkbox checkbox-sm" @change="selectAll(0)" :checked="selectedAlls[0]" />
            <span class="label-text text-blue-500 text-xs">{{ $t('allDevices') }} ({{ groupDevices[0].length }})</span>
          </label>
          <span class="label-text text-xs text-right flex-1">{{ $t('selected') }}
            {{ selections[0].length }}
            {{ $t('units') }}
          </span>
          <div class="tooltip" :data-tip="$t('moveToGroup')">
            <details ref="moveToGroupMenu" class="dropdown dropdown-top">
              <summary class="btn btn-xs bg-transparent hover:bg-transparent border-0">
                <font-awesome-icon icon="fa-solid fa-share" class="text-blue-500"></font-awesome-icon>
              </summary>
              <ul class="dropdown-content z-[10] menu menu-sm p-2 shadow bg-base-200 rounded-box w-52">
                <li v-for="(item, index) in groups" :key="item.id"><a @click="moveToGroup(0, item.id)">{{
                  item.name }}</a>
                </li>
              </ul>
            </details>
          </div>
        </div>
        <drag-select v-model="selection">
          <drag-select-option v-for="(item, index) in devices" :value="item.serial" :key="item.serial">
            {{ index + 1 }}
          </drag-select-option>
        </drag-select>
      </div>
    </div>
  </div>

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
      selectedItemIndex: 1,
      menuItems: [],
      fullMenuItems: [
        { name: 'dashboard', icon: 'tachometer-alt' },
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
      },
      selection: [],
      newGroupName: '',
      showAddGroup: false,
      groups: [],
      selections: {
        0: [],
      },
      selectedAlls: {
        0: false
      },
      groupDevices: {
        0: [],
      }
    }
  },

  emits: ['menu_selected'],
  methods: {
    moveToGroup(src_id, dst_id) {
      this.$service.move_to_group({ src_id: src_id, dst_id: dst_id }).then(res => {
        this.refreshSelections()
        this.$refs.moveToGroupMenu.removeAttribute('open')
        for (let i = 0; i < this.groups.length; i++) {
          // console.log(this.$refs['moveToGroupMenu_' + this.groups[i].id])
          this.$refs['moveToGroupMenu_' + this.groups[i].id][0].removeAttribute('open')
        }
      })
    },
    get_groups() {
      this.$service
        .get_groups()
        .then(res => {
          this.groups = res.data
          this.refreshSelections()
        })
    },
    uploadFiles(files) {
      const formData = new FormData()
      formData.append('serials', this.selection)
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      this.$service
        .upload_video(formData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    installApks(files) {
      const formData = new FormData()
      formData.append('serials', this.selection)
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      this.$service
        .install(formData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    adb_command(args) {
      this.$service
        .adb_command({
          serials: this.selection,
          args: args
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    script(name, args = []) {
      this.$service
        .script({
          name: name,
          serials: this.selection,
          args: args
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectTab(tab) {
      switch (tab) {
        case 'settings':
          this.$refs.settings.classList.add('tab-active')
          this.$refs.tools.classList.remove('tab-active')
          break
        case 'tools':
          this.$refs.settings.classList.remove('tab-active')
          this.$refs.tools.classList.add('tab-active')
          break
      }
    },
    selectAll(id) {
      this.selectedAlls[id] = !this.selectedAlls[id]
      console.log(this.devices);

      if (this.selectedAlls[id]) {
        if (id == 0) {
          this.selection = this.devices.map(device => device.serial)
        } else {
          this.selection = this.devices.filter(device => device.group_id === id).map(device => device.serial)
        }
      } else {
        this.selection = []
      }
      console.log(this.selection);
      this.refreshSelections()
    },
    refreshSelections() {
      this.groupDevices[0] = this.devices;
      for (let i = 0; i < this.groups.length; i++) {
        this.selections[this.groups[i].id] = []
        this.selectedAlls[this.groups[i].id] = false
        this.groupDevices[this.groups[i].id] = this.devices.filter(device => device.group_id === this.groups[i].id)
      }
      this.selections[0] = this.devices.filter(device => this.selection.includes(device.serial))
      this.selectedAlls[0] = this.selections[0].length > 0
      for (let i = 0; i < this.groups.length; i++) {
        let group_id = this.groups[i].id
        this.selections[group_id] = this.devices.filter(device => device.group_id === group_id)
          .filter(device => this.selection.includes(device.serial)).map(device => device.serial)
        this.selectedAlls[group_id] = this.selections[group_id].length > 0
      }

    },
    get_menus() {
      this.$service.get_menus().then(res => {
        this.menuItems = this.fullMenuItems.filter(item => res.data.includes(item.name))
        // this.selectItem(this.selectedItemIndex, this.menuItems[this.selectedItemIndex])
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
    this.get_groups()
    this.$emitter.on('openDevice', (device) => {
      this.selection.push(device.serial)
      this.refreshSelections()
    });
    this.$emitter.on('closeDevice', (device) => {
      this.selection = []
      this.refreshSelections()
    });
    this.$emitter.on('adbEventData', (data) => {
      console.log("receive adbEventData: ", data)
      this.adb_command(data.args)

    });
    this.$emitter.on('scriptEventData', (data) => {
      console.log("receive scriptEventData: ", data)
      this.script(data.name, data.args)
    });
    this.$emitter.on('uploadFiles', (files) => {
      this.uploadFiles(files)
    });
    this.$emitter.on('installApks', (files) => {
      this.installApks(files)
    });
    this.$emitter.on('initDevice', () => {
      this.initDevice()
    });
    this.$emitter.on('eventData', (data) => {
      let new_data = {
        devices: [...this.selection],
        data: data
      }
      this.$emitter.emit('syncEventData', new_data)
    });
  }
}
</script>
