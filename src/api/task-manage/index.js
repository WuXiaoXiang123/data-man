import request from '@/router/axios'

export const getTaskList = (params) => {
  return request({
    url: '/jrd-data/task/getTaskList',
    method: 'get',
    params,
  })
}


export const addTask = (data) => {
  return request({
    url: '/jrd-data/task/createTask',
    method: 'post',
    data,
  })
}

export const updateTask = (data) => {
  const { id, ...rest } = data
  return request({
    url: `/task/${id}`,
    method: 'put',
    data: rest,
  })
}

export const getTaskDetail = (current, size, params) => {
  return request({
    url: '/camel-system/region/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  })
}

export const removeTask = (id) => {
  return request({
    url: `/task/${id}`,
    method: 'delete',
  })
}

export const taskStart = (data) => {
  return request({
    url: `/jrd-data/task/startTask`,
    method: 'post',
    data,
  })
}

export const taskTerminate = (id) => {
  return request({
    url: `/task/${id}/action/terminate`,
    method: 'post',
  })
}

export const exportData = (id) => {
  return request({
    url: `/task/${id}/exportData`,
    method: 'post',
    responseType: 'blob',
  })
}

export const getComparisonData = (params) => {
  return request({
    url: `/jrd-data/view/compareViews`,
    method: 'get',
    params,
  })
}
