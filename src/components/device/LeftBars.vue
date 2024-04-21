<template>
    <div class="flex flex-col justify-start" >
        <button class="btn bg-green-500 hover:bg-green-700 text-white font-bold rounded tooltip" :data-tip="$t('openTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-n', 'com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
        </button>
        <button class="btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded tooltip" :data-tip="$t('stopTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'force-stop', 'com.zhiliaoapp.musically']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
        </button>
        <button class="btn bg-red-500 hover:bg-red-700 text-white font-bold rounded tooltip" :data-tip="$t('clearTiktok')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'pm', 'clear', 'com.zhiliaoapp.musically']})">
        <font-awesome-icon icon="fa-brands fa-tiktok" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showTimeSetting')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.settings.DATE_SETTINGS']})">
        <font-awesome-icon icon="fa fa-clock" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showLanguageSetting')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-n', 'com.android.settings/.LanguageSettings']})">
        <font-awesome-icon icon="fa fa-language" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('showSimInfo')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.settings.DEVICE_INFO_SETTINGS']})">
        <font-awesome-icon icon="fa fa-mobile" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('openNotification')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '0', '500', '1000']})">
        <font-awesome-icon icon="fa fa-bell" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('enableProxy')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', `${this.settings.proxy_url}`]})">
        <font-awesome-icon icon="fa-solid fa-link" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('disableProxy')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'settings', 'put', 'global', 'http_proxy', ':0']})">
        <font-awesome-icon icon="fa-solid fa-unlink" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('openWhoer')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://whoer.net']})">
        <font-awesome-icon icon="fa-brands fa-wikipedia-w" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('ipinfo')"
        @click="$emitter.emit('adbEventData',{args:['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'https://ipinfo.io']})">
        <font-awesome-icon icon="fa-solid fa-info" class="h-4 w-4" />
        </button>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" :data-tip="$t('enableTCP')"
        @click="$emitter.emit('adbEventData',{args:['tcpip', '5555']})">
        <font-awesome-icon icon="fa-solid fa-network-wired" class="h-4 w-4" />
        </button>
    </div>
</template>
<script>
export default {
  name: 'LeftBars',
}
</script>
