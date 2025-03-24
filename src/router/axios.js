/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import router from '@/router/router'
import { serialize } from '@/util/util'
import { Message } from 'element-ui'
import website from '@/config/website'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const axiosInstance = axios.create({
  timeout: 10 * 1000,
  baseURL: '/api',
})

//返回其他状态码
axiosInstance.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500
}
//跨域请求，允许保存cookie
axiosInstance.defaults.withCredentials = true
// NProgress 配置
NProgress.configure({
  showSpinner: false,
})
//http request拦截
axiosInstance.interceptors.request.use(
  (config) => {
    //开启 progress bar
    NProgress.start()
    const meta = config.meta || {}
    const isToken = meta.isToken === false

    //让每个请求携带token
    //headers中配置text请求
    if (config.text === true) {
      config.headers['Content-Type'] = 'text/plain'
    }
    //headers中配置serialize为true开启序列化
    if (config.method === 'post' && meta.isSerialize === true) {
      config.data = serialize(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//http response 拦截
axiosInstance.interceptors.response.use(
  (res) => {
    //关闭 progress bar
    NProgress.done()
    //获取状态码
    const status = res.data.code || res.status
    const statusWhiteList = website.statusWhiteList || []
    const message = res.data.msg || res.data.error_description || '未知错误'
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res)
    //如果是401则跳转到登录页面
    if (status === 401) router.push({ path: '/sso-login' })
    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      Message({
        message: message,
        type: 'error',
      })
      return Promise.reject(new Error(message))
    }
    return res
  },
  (error) => {
    NProgress.done()
    return Promise.reject(new Error(error))
  },
)

export default axiosInstance
