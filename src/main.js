import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import { Message } from 'element-plus'
import 'element-plus/dist/index.css'

// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'

const app = createApp(App);
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
app.config.globalProperties.$http = axios

// $message
app.config.globalProperties.$message = Message

app.use(store).use(ElementPlus).use(router).mount('#app')
