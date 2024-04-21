<template>
    <div class="flex flex-col justify-start">
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Home"
      @click="$emit('send_keycode','home')">
        <font-awesome-icon icon="fa-solid fa-home" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Back"
      @click="$emit('send_keycode','back')">
        <font-awesome-icon icon="fa fa-reply" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Task"
      @click="$emit('send_keycode','task')">
        <font-awesome-icon icon="fa fa-window-restore" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Up"
      @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '1000', '500', '500', '300']})">
        <font-awesome-icon icon="fa-arrow-up" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Down"
      @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'swipe', '500', '500', '500', '1000', '300']})">
        <font-awesome-icon icon="fa-arrow-down" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Left"
      @click="$emitter.emit('adbEventData',{args:['shell', 'input','swipe', '1000', '500', '500', '500', '300' ]})">
        <font-awesome-icon icon="fa-arrow-left" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Right"
      @click="$emitter.emit('adbEventData',{args:['shell', 'input','swipe', '500', '500', '1000', '500', '300']})">
        <font-awesome-icon icon="fa-arrow-right" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Power"
      @click="$emitter.emit('adbEventData',{args:['shell', 'input', 'keyevent', 'KEYCODE_POWER']})">
        <font-awesome-icon icon="fa fa-lightbulb" class="h-4 w-4" />
      </button>
      <button class="btn bg-red-500 hover:bg-red-700 text-white font-bold rounded tooltip" data-tip="Restart"
      @click="$emitter.emit('adbEventData',{args:['shell', 'reboot']})">
        <font-awesome-icon icon="fa fa fa-refresh" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Upload"
      @click="uploadVideo">
        <font-awesome-icon icon="fa fa-upload" class="h-4 w-4" />
        <input id="upload_video_input" type="file" v-on:change="on_upload_video" multiple hidden />

      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="Input Text"
      @click="show_text_input_dialog">
        <font-awesome-icon icon="fa fa-keyboard" class="h-4 w-4" />
      </button>
      <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold rounded tooltip" data-tip="ADB"
      @click="show_adb_input_dialog">
        <font-awesome-icon icon="fa fa-terminal" class="h-4 w-4" />
      </button>
    </div>
    <dialog ref="input_dialog" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg">{{ input_dialog_title }}</h3>
        <label class="input input-bordered flex items-center gap-2 my-4">
          <input type="text" class="grow" placeholder="" v-model="input_dialog_text" v-on:keyup.enter="input_callback" />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-primary" @click="input_callback">Enter</button>
          </form>
        </div>
      </div>
    </dialog>
</template>
<script>
export default {
  name: 'RightBars',
  data() {
    return {
      input_dialog_text: '',
      input_dialog_title: '',
      input_callback: () => {},
    }
  },
  methods: {
    show_text_input_dialog() {
      this.$refs.input_dialog.showModal()
      this.input_dialog_title = 'Input Text'
      this.input_callback = this.post_input_dialog
    },
    show_adb_input_dialog() {
      this.$refs.input_dialog.showModal()
      this.input_dialog_title = 'ADB Input'
      this.input_callback = this.post_adb_input_dialog
    },
    post_input_dialog() {
      let encodedText = btoa(this.input_dialog_text)
      this.$emitter.emit('adbEventData',{args:['shell', 'am', 'broadcast', '-a', 'ADB_INPUT_TEXT', '--es', 'text', `"${encodedText}"`]})
      this.input_dialog_text = ''
      this.$refs.input_dialog.close()
    },
    post_adb_input_dialog() {
      let args = this.input_dialog_text.split(' ')
      this.$emitter.emit('adbEventData',{args:args})
      this.input_dialog_text = ''
      this.$refs.input_dialog.close()
    },
    uploadVideo() {
      document.getElementById('upload_video_input').click()
    },
    on_upload_video(e) {
      console.log(e.target.files)
      this.$emitter.emit('uploadFiles',e.target.files)
    },
  }
}
</script>
