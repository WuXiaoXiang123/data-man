import request from '@/router/axios'

export const getDataSourceList = (params) => {
  return request({
    url: '/datasource',
    method: 'get',
    params: {
      onlyDefault:true,
      ...params,
    },
  })
}


export const addDataSource = (data) => {
  return request({
    url: '/datasource',
    method: 'post',
    data,
  })
}

export const updateDataSource = (data) => {
  const { id, ...rest } = data
  return request({
    url: `/datasource/${id}`,
    method: 'put',
    data: rest,
  })
}

export const removeDataSource = (id) => {
  return request({
    url: `/datasource/${id}`,
    method: 'delete',
  })
}

