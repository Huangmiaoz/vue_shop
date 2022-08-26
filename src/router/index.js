import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/List.vue';
import Add from '../components/goods/Add.vue';
import Order from '../components/order/Order.vue';
import Report from '../components/report/Report.vue';
const routes = [
  {path : '/', redirect : 'login'},
  {path : '/login', component : Login},
  {
    path : '/home', 
    component : Home, 
    redirect:'welcome', 
    children :[
      { path : '/welcome',component : Welcome},
      { path : '/users',component : User},
      { path : '/rights', component : Rights},
      { path : '/roles', component : Roles},
      { path : '/categories', component : Cate},
      { path : '/params', component : Params},
      { path : '/goods', component : List},
      { path : '/goods/add', component : Add},
      { path : '/orders', component : Order},
      { path : '/reports', component : Report},
      
    ]
  },
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
