import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import axios from 'axios';
import Cookies from 'js-cookie';

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import "vue-toastification/dist/index.css";

const app = createApp(App)

const options = {
    timeout: 3000, 
    position: "bottom-left",
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Retrives fresh token from the backends
const getRefreshToken = async () => {
    try {
      const token = Cookies.get('token')
  
      const headers = {
        'Authorization': token
      }
      const {data} = await axios.get('http://localhost:3000/api/app/auth/token', {headers})
  
      Cookies.set('token', data)
  
      return data;
    } catch (error) {
      return error;
    }
  }

// handles situation when access token is expired
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.data[0]?.code === 'TOKEN_INVALID') {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await getRefreshToken();
                    isRefreshing = false;

                    processQueue(null, newToken);
                } catch (refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError, null);
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = token;
                return axios(originalRequest);
            });
        }

        return Promise.reject(error);
    }
);

app.use(Toast, options);
app.use(createPinia())
app.use(router)

app.mount('#app')
