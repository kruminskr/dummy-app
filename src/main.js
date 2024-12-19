import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import "vue-toastification/dist/index.css";

const app = createApp(App)

const options = {
    timeout: 3000, 
    position: "bottom-left",}

app.use(Toast, options);
app.use(createPinia())
app.use(router)

app.mount('#app')
