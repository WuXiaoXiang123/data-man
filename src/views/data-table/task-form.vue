<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="ruleForm.taskName" placeholder="请填写任务名"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-table @selection-change="handleSelectRow" ref="dataSetRef" :data="dataItemList" border tooltip-effect="dark"
                style="width: 100%" :max-height="600"
                row-key="columnName" size="small">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="columnName" label="字段名称" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ruleId" label="规则" min-width="400">
          <template slot-scope="scope">
            <el-select :value="scope.row.ruleId" @change="(e)=>{ handleSelectRule(scope,e) }" style="width: 100%"
                       clearable>
              <el-option v-for="(item) in ruleList" :key="item.name" :value="item.name"
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
import { getColumnList } from '@/api/data-table'
import { getRuleList } from '@/api/rule'
import { getSensitiveListNoPage } from '@/api/sensitive-words'

export default {
  name: 'data-table-task',
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      selectedRows: [],
      dataItemList: [],
      ruleList: [],
      sensitiveList: [],
      ruleForm: {
        taskName: '',
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
      },
    }
  },
  mounted() {
    this.queryRuleList()
    this.querySensitiveList()
    this.queryColumnList(this.$route.params.did, this.rowData.name)
  },
  methods: {
    queryRuleList() {
      getRuleList().then(res => {
        if (res.data.code === 0) {
          this.ruleList = [...res.data.data]
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
    queryColumnList(id, name) {
      getColumnList(id, name).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          let arr = []
          for (let i in data) {
            arr.push({ columnName: i, ruleId: '', paras: '' })
          }
          this.selectedRows = arr.map(v => v.columnName)
          this.dataItemList = [...arr]
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
  },
}
</script>
<style scoped>

</style>
