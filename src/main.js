import Vue from 'vue'
import App from './App'
import router from './router/router'
import './permission' // 权限
import Element from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
