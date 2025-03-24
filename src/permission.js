/**
 * 全站权限配置
 *
 */
import router from './router/router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(() => {
  NProgress.done()
  //判断登录页的情况
  const { name } = router.history.current
  //根据当前的标签也获取label的值动态设置浏览器标题
  document.title = name || '动态数据脱敏'
})
