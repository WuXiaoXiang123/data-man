import request from '@/router/axios'

export const getDataModelList = (params) => {
  return request({
    url: '/jrd-data/model/getModelList',
    method: 'get',
    params,
  })
}


export const addDataModel = (data) => {
  return request({
    url: '/jrd-data/model/createModel',
    method: 'post',
    data,
  })
}

export const updateDataModel = (data) => {
  const { id, ...rest } = data
  return request({
    url: `/dataModel/${id}`,
    method: 'put',
    data: rest,
  })
}

export const getDataModelDetail = (params) => {
  return request({
    url: '/jrd-data/model/getModelDetail',
    method: 'get',
    params,
  })
}

export const removeDataModel = (id) => {
  return request({
    url: `/dataModel/${id}`,
    method: 'delete',
  })
}

export const getModelFieldList = (params) => {
  return request({
    url: '/jrd-data/model/getModelField',
    method: 'get',
    params,
  })
}

export const dataModelStart = (id) => {
  return request({
    url: `/dataModel/${id}/action/start`,
    method: 'post',
  })
}

export const dataModelTerminate = (id) => {
  return request({
    url: `/dataModel/${id}/action/terminate`,
    method: 'post',
  })
}

export const exportData = (id) => {
  return request({
    url: `/dataModel/${id}/exportData`,
    method: 'post',
    responseType: 'blob',
  })
}

export const getViewData = (params) => {
  const { id, ...rest } = params
  return request({
    url: `/dataModel/${id}/action/compareData`,
    method: 'get',
    params: rest,
  })
}


