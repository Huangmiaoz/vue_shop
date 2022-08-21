import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import { ElMessage  } from 'element-plus'
import 'element-plus/dist/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'


import axios from 'axios'

const app = createApp(App);
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求的拦截器
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
app.config.globalProperties.$http = axios

// $message
app.config.globalProperties.$message = ElMessage

app.use(store).use(ElementPlus).use(router).mount('#app')

// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons-vue'

// 统一注册el-icon图标
for(let iconName in ElIconModules){
  app.component(iconName,ElIconModules[iconName])
}
