import request from '@/router/axios'
export const addModelView = (data) => {
  return request({
    url: '/jrd-data/view/createView',
    method: 'post',
    data,
  })
}

export const updateModelView = (data) => {
  return request({
    url: '/jrd-data/view/editView',
    method: 'post',
    data,
  })
}

export const getViewDetail = (params) => {
  return request({
    url: '/jrd-data/view/getViewDetail',
    method: 'get',
    params,
  })
}

export const getViewTableList = (params) => {
  return request({
    url: '/jrd-data/view/getDataByViewId',
    method: 'get',
    params,
  })
}
