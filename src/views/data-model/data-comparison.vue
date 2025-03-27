<template>
  <div class="avue-contain">
    <div style="display: flex;margin-bottom: 10px;align-items: center;justify-content: center;">
      <div>{{ sourceData.name }}</div>
      <div style="margin: 0 20px;">——</div>
      <el-select v-model="targetViewId" @change="handleTargetViewChange" placeholder="请选择目标视图">
        <el-option v-for="item in viewList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div style="display: flex;margin-bottom: 10px;justify-content: space-between">
      <div class="raw-data-table">
        <div style="text-align: center;margin-bottom: 10px">原始数据</div>
        <el-table :data="sourceDataList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px;"
          :max-height="800" row-key="id" size="small" v-loading="tableLoading"
          :header-cell-style="{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
          <el-table-column width="100" :label="item.fieldName" show-overflow-tooltip v-for="(item) in sourceColumn"
            :key="item.fieldName">
            <template v-slot="scope">
              <div style="margin-right: 10px">{{ scope.row[item.columnName] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="deal-data-table">
        <div style="text-align: center;margin-bottom: 10px">过滤后数据</div>
        <el-table :data="targetDataList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px"
          :max-height="800" row-key="id" size="small" v-loading="tableLoading" :cell-style="rowStyle">
          <el-table-column width="100" :label="item.fieldName" show-overflow-tooltip v-for="(item) in targetColumn"
            :key="item.fieldName">
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
import { getComparisonData } from '@/api/task-manage'
import { highLightTable } from '@/util/index'

export default {
  name: 'data-comparison',
  props: {
    sourceData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    viewList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      sourceDataList: [],
      targetDataList: [],
      sourceColumn: [],
      targetColumn: [],
      total: 0,
      current: 1,
      size: 10,
      tableLoading: false,
      targetViewId: '',
    }
  },
  mounted() {
    // this.targetDataList = highLightTable(this.sourceDataList, this.targetDataList)

    // this.queryComparisonData({ current: this.current, size: this.size, sourceViewId: this.sourceData.id, targetViewId: this.targetViewId })
  },
  methods: {
    queryComparisonData(params) {

      this.tableLoading = true
      getComparisonData(params).then(res => {
        if (res.data.code === 0) {
          const { sourceData, targetData, total, sourceColumn, targetColumn } = res.data.data
          this.total = total
          this.sourceDataList = sourceData
          this.sourceColumn = sourceColumn
          this.targetColumn = targetColumn
          console.log(res.data.data)
          // 拿到数据后执行highLightTable方法：第一个参数原始数据 第二个参数过滤后的数据 返回过滤后的数据
          // 然后把两个值赋值就行
          this.targetDataList = highLightTable(sourceData, targetData)
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
      this.queryComparisonData({ current: this.current, size: this.size, sourceViewId: this.sourceData.id, targetViewId: this.targetViewId })
    },
    handleTargetViewChange(e) {
      this.targetViewId = e
      this.queryComparisonData({ current: this.current, size: this.size, sourceViewId: this.sourceData.id, targetViewId: this.targetViewId })
    },
  },
}
</script>
<style scoped>
.raw-data-table,
.deal-data-table {
  flex-shrink: 0;
  width: 48%;
}
</style>
