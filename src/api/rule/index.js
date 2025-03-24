import request from '@/router/axios'

export const getRuleList = (params) => {
  return request({
    url: '/rule',
    method: 'get',
    params,
  })
}
