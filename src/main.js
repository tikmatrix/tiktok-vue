import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as service from './service'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* add some free styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
/* add icons to the library */
library.add(fas, fab,)
import { i18n } from './i18n.js'



const app = createApp(App)
app.use(VueAxios, axios)
app.use(i18n)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.config.globalProperties.$service = service
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')


