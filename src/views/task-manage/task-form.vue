<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请填写任务名"></el-input>
      </el-form-item>
      <el-form-item label="数据源" prop="datasourceId">
        <el-select v-model="ruleForm.datasourceId" placeholder="请选择数据源" style="width: 100%"
                   @change="handleDatasource" filterable>
          <el-option v-for="(item) in datasourceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据表" prop="srcTableName" @change="handleTable">
        <el-select v-model="ruleForm.srcTableName" placeholder="请选择数据表" style="width: 100%" filterable>
          <el-option v-for="(item) in dataSetList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-table @selection-change="handleSelectRow" ref="dataSetRef" :data="dataItemList" border tooltip-effect="dark"
                style="width: 100%" :max-height="600"
                row-key="id" size="small">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="columnName" label="字段名称" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ruleId" label="规则" min-width="400">
          <template slot-scope="scope">
            <el-select :value="scope.row.ruleId" @change="(e)=>{ handleSelectRule(scope,e) }" style="width: 100%" clearable>
              <el-option v-for="(item) in ruleList" :key="item.id" :value="item.name"
                         :label="`${item.title}(${item.name})(${item.parameterUsage && item.parameterUsage.length? item.parameterUsage.join('；'):'无参数' })`"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="paras" label="参数" min-width="300">
          <template slot-scope="scope">
            <el-select v-if="scope.row.ruleId === 'dx_sensitive'" v-model="scope.row.paras" style="width:100%">
              <el-option v-for="(item) in sensitiveList" :key="item.id" :value="item.id"
                         :label="item.baseName"></el-option>
            </el-select>
            <el-input v-else v-model="scope.row.paras" placeholder="填写多个参数时以逗号（英文逗号）分割"
                      :disabled="!scope.row.ruleId"
                      :maxlength="40"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getColumnList, getDataSetList } from '@/api/data-table'
import { getDataSourceList } from '@/api/data-source'
import { getRuleList } from '@/api/rule'
import { getSensitiveListNoPage } from '@/api/sensitive-words'

export default {
  name: 'task-form',
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      datasourceList: [], //数据源列表
      dataSetList: [], //数据表列表
      selectedRows: [], //选中的字段
      dataItemList: [], //字段列表
      ruleList: [], //规则列表
      sensitiveList: [], //敏感词库
      ruleForm: {
        taskName: '',
        srcTableName: '',
        datasourceId: '',
      },
      rules: {
        taskName: [
          {
            required: true,
            message: '任务名必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 60,
            message: '任务不能超过60个字',
          },
        ],
        srcTableName: [
          {
            required: true,
            message: '数据表必选',
            trigger: 'blur',
          },
        ],
        datasourceId: [
          {
            required: true,
            message: '数据源必选',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {
    this.queryRuleList()
    this.querySensitiveList()
    this.init()
  },
  methods: {
    init() {
      getDataSourceList().then(res => {
        if (res.data.code === 0) {
          this.datasourceList = [...res.data.data]
        }
      })
      if (this.rowData.id) {
        let selectedRows = this.rowData.design.map(v => v.columnName)
        this.selectedRows = selectedRows
        this.ruleForm = {
          taskName: this.rowData.taskName,
          srcTableName: this.rowData.srcTableName,
          datasourceId: this.rowData.datasourceId,
        }
        this.queryDataSetList({ did: this.rowData.datasourceId })
        getColumnList(this.rowData.datasourceId, this.rowData.srcTableName).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            let arr = []
            for (let i in data) {
              let index = this.rowData.design.findIndex(v => v.columnName === i)
              if (index !== -1) {
                let row = this.rowData.design[index]
                arr.push({
                  columnName: i,
                  ruleId: row.ruleId,
                  paras: row.paras && row.paras.length ? row.paras.join(',') : '',
                })
              } else {
                arr.push({ columnName: i, ruleId: '', paras: '' })
              }
            }
            this.dataItemList = [...arr]
            this.$nextTick(() => {
              arr.map(v => {
                if (selectedRows.includes(v.columnName)) {
                  this.$refs.dataSetRef.toggleRowSelection(v, true)
                }
              })
            })
          }
        })
      }
    },
    queryRuleList() {
      getRuleList().then(res => {
        if (res.data.code === 0) {
          this.ruleList = res.data.data
        }
      })
    },
    querySensitiveList(params) {
      getSensitiveListNoPage(params).then(res => {
        if (res.data.code === 0) {
          this.sensitiveList = [...res.data.data]
        }
      })
    },
    queryDataSetList(params) {
      getDataSetList(params).then(res => {
        if (res.data.code === 0) {
          this.dataSetList = [...res.data.data]
        }
      })
    },
    queryColumnList(id, name) {
      getColumnList(id, name).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          let arr = []
          for (let i in data) {
            arr.push({ columnName: i, ruleId: '' })
          }
          this.dataItemList = [...arr]
          this.selectedRows = arr.map(v => v.columnName)
          this.$nextTick(() => {
            this.dataItemList.map(v => {
              this.$refs.dataSetRef.toggleRowSelection(v, true)
            })
          })
        }
      })
    },
    handleSelectRule(scope, e) {
      this.dataItemList[scope.$index].ruleId = e
    },
    handleSelectRow(rows) {
      this.selectedRows = rows.map(v => v.columnName)
    },
    handleDatasource(e) {
      this.queryDataSetList({ did: e })
      this.ruleForm.srcTableName = ''
      this.dataItemList = []
      this.selectedRows = []
    },
    handleTable(e) {
      this.queryColumnList(this.ruleForm.datasourceId, e)
    },
  },
}
</script>
<style scoped>

</style>
