import request from '@/router/axios'

export const getSensitiveWordsList = (params) => {
  return request({
    url: '/sensitive/page',
    method: 'get',
    params,
  })
}
export const getSensitiveListNoPage = (params) => {
  return request({
    url: '/sensitive/list',
    method: 'get',
    params,
  })
}

export const addSensitiveWords = (data) => {
  return request({
    url: '/sensitive/save',
    method: 'post',
    data,
  })
}

export const updateSensitiveWords = (data) => {
  return request({
    url: `/sensitive/update`,
    method: 'post',
    data,
  })
}

export const removeSensitiveWords = (params) => {
  return request({
    url: `/sensitive/delete`,
    method: 'post',
    params,
  })
}

export const getSensitiveWordsDetail = (params) => {
  return request({
    url: `/sensitive/detail`,
    method: 'get',
    params,
  })
}



export const copySensitiveWords = (params) => {
  return request({
    url: `/sensitive/copy`,
    method: 'post',
    params,
  })
}

export const addWord = (data) => {
  return request({
    url: `/sensitive/word/save`,
    method: 'post',
    data,
  })
}

export const updateWord = (data) => {
  return request({
    url: `/sensitive/word/update`,
    method: 'post',
    data,
  })
}

export const removeWord = (params) => {
  return request({
    url: `/sensitive/word/delete`,
    method: 'post',
    params,
  })
}
