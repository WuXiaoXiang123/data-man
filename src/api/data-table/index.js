import request from '@/router/axios'

export const getDataSetList = (params) => {
  const { did, ...rest } = params
  return request({
    url: `/datasource/${did}/table`,
    method: 'get',
    params: rest,
  })
}

export const getColumnList = (id,name) => {
  return request({
    url: `/datasource/${id}/table/${name}/column`,
    method: 'get',
  })
}

