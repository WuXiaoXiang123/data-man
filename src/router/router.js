/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewsRouter from './views/' // 页面路由
Vue.use(VueRouter)
//创建路由

const orPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return orPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes: ViewsRouter,
})

export default router
