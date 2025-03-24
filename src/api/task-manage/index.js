import request from '@/router/axios'

export const getTaskList = (params) => {
  return request({
    url: '/task/page',
    method: 'get',
    params,
  })
}


export const addTask = (data) => {
  return request({
    url: '/task',
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

export const taskStart = (id) => {
  return request({
    url: `/task/${id}/action/start`,
    method: 'post',
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

export const getViewData = (params) => {
  const { id, ...rest } = params
  return request({
    url: `/task/${id}/action/compareData`,
    method: 'get',
    params: rest,
  })
}
