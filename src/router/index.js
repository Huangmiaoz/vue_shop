import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue';

const routes = [
  {path : '/', redirect : 'login'},
  {path : '/login', component : Login},
  {path : '/home', component : Home}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 挂在路由导航守卫
router.beforeEach((to,from,next) => {
  console.log(to);
  if(to.fullPath === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) {
    return next('/login');
  }
  next();
})

export default router
