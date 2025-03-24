/**
 * 通用工具类
 */
export default class func {
  /**
   * 不为空
   * @param val
   * @returns {boolean}
   */
  static notEmpty(val) {
    return !this.isEmpty(val)
  }

  /**
   * 是否为定义
   * @param val
   * @returns {boolean}
   */
  static isUndefined(val) {
    return val === null || typeof val === 'undefined'
  }

  /**
   * 为空
   * @param val
   * @returns {boolean}
   */
  static isEmpty(val) {
    if (
      val === null ||
      typeof val === 'undefined' ||
      (typeof val === 'string' && val === '' && val !== 'undefined')
    ) {
      return true
    }
    return false
  }

  /**
   * 强转int型
   * @param val
   * @param defaultValue
   * @returns {number}
   */
  static toInt(val, defaultValue) {
    if (this.isEmpty(val)) {
      return defaultValue === undefined ? -1 : defaultValue
    }
    const num = parseInt(val, 0)
    return Number.isNaN(num) ? (defaultValue === undefined ? -1 : defaultValue) : num
  }

  /**
   * Json强转为Form类型
   * @param obj
   * @returns {FormData}
   */
  static toFormData(obj) {
    const data = new FormData()
    Object.keys(obj).forEach(key => {
      data.append(key, Array.isArray(obj[key]) ? obj[key].join(',') : obj[key])
    })
    return data
  }

  /**
   * date类转为字符串格式
   * @param date
   * @param format
   * @returns {null}
   */
  static format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return date ? date.format(format) : null
  }

  /**
   * 根据逗号联合
   * @param arr
   * @returns {string}
   */
  static join(arr) {
    return arr ? arr.join(',') : ''
  }

  /**
   * 根据逗号分隔
   * @param str
   * @returns {string}
   */
  static split(str) {
    return str ? String(str).split(',') : ''
  }

  /**
   * 根据时间返回问候语
   * @returns {string}
   */
  static salutation() {
    const nowHour = new Date().getHours()
    return nowHour < 9 ? '早上好' : nowHour < 12 ? '上午好' : nowHour < 14 ? '中午好' : nowHour < 19 ? '下午好' : '晚上好'
  }

  static randomTip() {
    const tips = [
      '修身、齐家、治国、平天下。',
      '祸兮，福之所倚；福兮，祸之所伏。',
      '兼听则明，偏信则暗。',
      '见兔而顾犬，未为晚也；亡羊而补牢，未为迟也。',
      '穷则独善其身，达则兼善天下。',
      '镜破不改光，兰死不改香。',
      '君子成人之美，不成人之恶。',
      '君子坦荡荡，小人长戚戚。',
      '老当益壮，宁知白首之心；穷且益坚，不坠青云之志。',
      '老骥伏枥，志在千里。烈士暮年，壮心不已。',
      '路漫漫其修远今，吾将上下而求索。',
      '莫愁前路无知己，天下谁人不识君。',
      '皮之不存，毛将焉附？',
      '青，取之于蓝而青于蓝。',
      '其身正，不令而行；其身不正，虽令不从。',
      '仁者见之谓之仁，智者见之谓之智。',
      '穷则变，变则通，通则久。',
      '青山遮不住，毕竟东流去。',
    ]
    const randomNum = Math.round(Math.random() * 17)
    return tips[randomNum]
  }


}

