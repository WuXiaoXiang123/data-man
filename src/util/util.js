import { validatenull } from './validate'
//表单序列化
export const serialize = (data) => {
  let list = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
export const getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
export const getViewDom = () => {
  return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + ' grayMode'
  } else {
    document.body.className = document.body.className.replace(' grayMode', '')
  }
}
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  let { data, type, param, key } = params
  let result = JSON.parse(JSON.stringify(data))
  if (type == 'Base64') {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele])
    })
  } else if (type == 'Aes') {
    param.forEach((ele) => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString()
    })
  }
  return result
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen()
  } else {
    reqFullScreen()
  }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }

  document.addEventListener('fullscreenchange', function () {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function () {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function () {
    listen()
  })
  document.addEventListener('msfullscreenchange', function () {
    listen()
  })
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen =
    document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i]
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
}
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = (url) => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = ''
  if (validatenull(dic)) return value
  if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
    let index = 0
    index = findArray(dic, value)
    if (index != -1) {
      result = dic[index].label
    } else {
      result = value
    }
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach((ele) => {
      index = findArray(dic, ele)
      if (index != -1) {
        result.push(dic[index].label)
      } else {
        result.push(value)
      }
    })
    result = result.toString()
  }
  return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i
    }
  }
  return -1
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len ? len : 4)
  if (date) random = random + Date.now()
  return random
}
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left,
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
  return window.location.href.split('/#/')[0]
}

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.href.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
}

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBlob = (path, name) => {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveOrOpenBlob(this.response, name)
        return
      }
      const url = URL.createObjectURL(this.response)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
}

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBase64 = (path, name) => {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.response)
      fileReader.onload = function () {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = this.result
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
}

/**
 * 获取单点登录访问地址上的参数
 * @param {String} url - 访问地址
 * @param {String} url - 指定参数
 */

/**
 * [获取url主机部分]
 * 示例URL:http://localhost:1888/xxx
 * @param  {string} prefix [请求前缀]
 * @return {string}          [地址]
 */
export const getUrlHost = (prefix = 'http://') => {
  return prefix + window.location.host
}
/**
 * 通过参数名获取url中的参数值
 * 示例URL:http://maven.casic.com/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * @param {string} name 查询参数名
 * @param {boolean} search 兼容hash模式
 * @returns {string|null}
 */
export const getUrlQuery = (name, search) => {
  let searchUrl = search ? window.location.search.substr(1) : window.location.hash.split('?')[1]
  if (searchUrl) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let value = searchUrl.match(reg)
    if (value != null) return unescape(value[2])
  }
  return null
}
/**
 * 判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
 * @param {string} url
 * @returns {boolean}
 */
export const checkURL = (url) => {
  //下面的代码中应用了转义字符"\"输出一个字符"/"
  const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  const objExp = new RegExp(Expression)
  if (objExp.test(url) == true) {
    return true
  } else {
    return false
  }
}

/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @returns {*}
 */
export function downloadFile(url, fileName) {
  return fetch(url).then((res) => {
    res.blob().then((data) => {
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(new Blob([data]), fileName)
      } else {
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) //下载完成移除元素
        window.URL.revokeObjectURL(url) //释放掉blob对象
      }
    })
  })
}
