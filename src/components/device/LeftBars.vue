<template>
    <div class="flex flex-col justify-start" >
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('openTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-n', 'com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('open') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('stopTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'force-stop', 'com.zhiliaoapp.musically']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4 text-yellow-500" />
        <span class="text-xs block font-normal">{{ $t('stop') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('clearTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'pm', 'clear', 'com.zhiliaoapp.musically']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4 text-pink-500" />
        <span class="text-xs block font-normal">{{ $t('clear') }}</span>
        </button>
        
       
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('enableProxy')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', `${settings.proxy_url}`]})">
        <font-awesome-icon icon="fa-solid fa-link" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('proxy') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('disableProxy')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', ':0']})">
        <font-awesome-icon icon="fa-solid fa-unlink" class="h-4 w-4 text-yellow-500" />
        <span class="text-xs block font-normal">{{ $t('proxy') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('openWhoer')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://whoer.net']})">
        <font-awesome-icon icon="fa-brands fa-wikipedia-w" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">Whoer</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('login')"
        @click="$emitter.emit('scriptEventData',{name:'login',args:[]})">
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('login') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('register')"
        @click="$emitter.emit('scriptEventData',{name:'register',args:['1']})">
        <font-awesome-icon icon="fa-solid fa-user-plus" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('register') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('train')"
        @click="$emitter.emit('scriptEventData',{name:'train',args:['0','50','50','50','','300','']})">
        <font-awesome-icon icon="fa-solid fa-graduation-cap" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('train') }}</span>
        </button>
        <button class="btn bg-transparent hover:bg-transparent border-0 text-black-500 hover:text-blue-700 p-0 block tooltip" :data-tip="$t('init')"
        @click="$emitter.emit('initDevice')">
        <font-awesome-icon icon="fa-solid fa-arrows-rotate" class="h-4 w-4 text-blue-500" />
        <span class="text-xs block font-normal">{{ $t('init') }}</span>
        </button>
        
    </div>
</template>
<script>
export default {
  name: 'LeftBars',
  data() {
    return {
      settings: {
        proxy_url: 'http://127.0.0.1:8090'
      }
    }
  },
  methods: {
    get_settings() {
      this.$service.get_settings().then(res => {
        this.settings = res.data
      })
    },
  },
  mounted() {
    this.get_settings()
  },
}
</script>
