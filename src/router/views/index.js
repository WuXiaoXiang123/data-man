import Layout from '@/page/index/'

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/taskManage',
    children: [
      {
        path: 'dataModel',
        name: '数据模型',
        component: () => import(/* webpackChunkName: "views" */ '@/views/data-model/index.vue'),
      },
      {
        path: 'dataSource',
        name: '数据源',
        component: () => import(/* webpackChunkName: "views" */ '@/views/data-source/index.vue'),
      },
      {
        path: 'dataSource/:did',
        name: '数据表',
        component: () => import(/* webpackChunkName: "views" */ '@/views/data-table/index.vue'),
      },
      {
        path: 'taskManage',
        name: '数据任务',
        component: () => import(/* webpackChunkName: "views" */ '@/views/task-manage/index.vue'),
      },
      {
        path: 'rule',
        name: '规则',
        component: () => import(/* webpackChunkName: "views" */ '@/views/rule/index.vue'),
      },
      {
        path: 'sensitive',
        name: '敏感词',
        component: () => import(/* webpackChunkName: "views" */ '@/views/sensitive-words/index.vue'),
      },
    ],
  },
]
