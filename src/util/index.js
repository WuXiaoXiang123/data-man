/**
 *
 * @param rawData 原始数据
 * @param dealData 处理后的数据
 * @returns {*} 加上了column是否变化的处理后的数据
 */
export const highLightTable = (rawData, dealData) => {
  dealData.map((v, i) => {
    for (let item in v) {
      if (v[item] !== rawData[i][item]) {
        //如果不一样说明数据有变化 加个新字段区分
        v[`${item}__change`] = true
      } else {
        v[`${item}__change`] = false
      }
    }
  })
  return dealData
}
