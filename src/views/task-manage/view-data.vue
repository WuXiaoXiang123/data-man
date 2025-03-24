<template>
  <div class="avue-contain">
    <div style="display: flex;margin-bottom: 10px;justify-content: space-between">
      <div class="raw-data-table">
        <div style="text-align: center;margin-bottom: 10px">原始数据</div>
        <el-table :data="rawDataList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px;"
                  :max-height="800"
                  row-key="id" size="small" v-loading="tableLoading"
                  :header-cell-style="{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}"
        >
          <el-table-column width="100" :label="item.columnName" show-overflow-tooltip
                           v-for="(item) in rowData.design "
                           :key="item.columnName">
            <template v-slot="scope">
              <div style="margin-right: 10px">{{ scope.row[item.columnName] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="deal-data-table">
        <div style="text-align: center;margin-bottom: 10px">过滤后数据</div>
        <el-table :data="dealDataList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px"
                  :max-height="800"
                  row-key="id" size="small" v-loading="tableLoading"
                  :cell-style="rowStyle"
        >
          <el-table-column width="100" :label="item.columnName" show-overflow-tooltip
                           v-for="(item) in rowData.design"
                           :key="item.columnName">
            <template v-slot="scope">
              <div>{{ scope.row[item.columnName] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="text-align: center">
      <el-pagination background layout="total,prev,pager,next,jumper" :page-count="size" :total="total"
                     :current-page="current" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getViewData } from '@/api/task-manage'
import { highLightTable } from './util'

export default {
  name: 'view-data',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {
          design: [],
        }
      },
    },
  },
  data() {
    return {
      rawDataList: [],
      dealDataList: [],
      total: 0,
      current: 1,
      size: 10,
      tableLoading: false,
    }
  },
  mounted() {
    this.dealDataList = highLightTable(this.rawDataList, this.dealDataList)

    this.queryViewData({ current: this.current, size: this.size, id: this.rowData.id })
  },
  methods: {
    queryViewData(params) {
      const { current } = params
      this.tableLoading = true
      getViewData(params).then(res => {
        if (res.data.code === 0) {
          this.current = current
          this.total = res.data.data.originData.total
          console.log(res.data.data)
          // 拿到数据后执行highLightTable方法：第一个参数原始数据 第二个参数过滤后的数据 返回过滤后的数据
          // 然后把两个值赋值就行
          this.rawDataList = res.data.data.originData.records
          this.dealDataList = highLightTable(res.data.data.originData.records, res.data.data.resultData.records)
        }

      }).finally(() => {
        this.tableLoading = false
      })
    },
    rowStyle({ row, column }) {
      let cellStyle = ''
      let labelList = []
      Object.keys(row).forEach((item) => {
        if (row[`${item}`] === true) {
          let arr = item.split('__')
          labelList.push(arr[0])
        }
      })
      if (labelList.includes(column.label)) {
        cellStyle = 'background: rgba(51,255,51,0.1);color:#000'
      }
      return cellStyle
    },
    handleCurrentChange(val) {
      this.current = val
      this.queryViewData({ current: this.current, size: this.size, id: this.rowData.id })
    },
  },
}
</script>
<style scoped>
.raw-data-table, .deal-data-table {
  flex-shrink: 0;
  width: 48%;
}
</style>
