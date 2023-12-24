import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

axios.defaults.baseURL = "http://185.241.54.108:5002";

axios.interceptors.request.use(async request => {
    if (request.url === '/api/v1/auth/refresh/') return request;

    const shouldRefreshAt = localStorage.getItem('shouldRefreshAt');
    const refreshToken = localStorage.getItem('sm-rt');
    const shouldRefresh = shouldRefreshAt && refreshToken && (+shouldRefreshAt < Date.now());

    if (shouldRefresh) {
        await axios.post('/api/v1/auth/refresh/', { refresh: refreshToken })
            .then(response => {
                localStorage.setItem("sm-at", response.data.access);
                localStorage.removeItem('shouldRefreshAt');
                localStorage.setItem("shouldRefreshAt", new Date().getTime() + 55 * 1000);
                // authStore.refreshToken(response.data.access);
                axios.defaults.headers['Authorization'] = "Bearer " + response.data.access;
                request.headers.Authorization = `Bearer ${response.data.access}`;
                return request;
            })
            .catch(error => {
                console.log(error);
                return request
            });
    }
    return request
});

app.mount('#app')
