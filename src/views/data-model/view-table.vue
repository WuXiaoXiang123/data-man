<template>
  <div style="width: 100%">
    <div style="width: 100%">
      <el-table :data="viewTableData" max-height="750" border style="width: 100%" v-loading="viewTableLoading">
        <el-table-column
          :min-width="viewDetail?.fieldList.length > 10 ? '200px' : `${100 / viewDetail?.fieldList.length}%`"
          v-for="item in viewDetail.fieldList" :key="item.fieldName" :prop="item.fieldName" :label="item.fieldName"
          show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <div style="display: flex;justify-content: space-between;align-items: center;">
              <div>{{ scope.column.label }}</div>
              <i style="cursor: pointer;" @click="handleHeaderClick(scope)" class="el-icon-setting"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px;text-align: center;">
      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page="current" :page-sizes="[10, 20]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog width="60%" :title="`编辑${column.label}规则`" :visible.sync="ruleFormVis">
      <rule-form v-if="ruleFormVis" :columnRuleList="columnRuleList" ref="ruleFormRef"></rule-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="ruleFormVis = false; column = {}">取消</el-button>
        <el-button size="small" type="primary" @click="ruleFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getViewTableList, updateModelView } from '@/api/model-view'
import ruleForm from './rule-form'
export default {
  components: {
    ruleForm,
  },
  props: {
    viewDetail: {
      type: Object,
    },
    viewId: {
      type: String,
    },
  },
  name: 'view-table',
  data() {
    return {
      viewTableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      viewTableLoading: false,
      ruleFormVis: false,
      columnRuleList: [],
      column: {},
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getViewTableList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getViewTableList()
    },
    getViewTableList() {
      this.viewTableLoading = true
      getViewTableList({ viewId: this.viewId, page: this.current, pageSize: this.pageSize }).then(res => {
        if (res.data.code === 0) {
          const { total, records } = res.data.data
          this.total = total
          this.viewTableData = [...records]
        }
      }).finally(() => {
        this.viewTableLoading = false
      })
    },
    handleHeaderClick(scope) {
      this.column = scope.column
      const label = scope.column.label
      this.columnRuleList = this.viewDetail.fieldList.filter(item => item.fieldName === label)[0].ruleList
      this.ruleFormVis = true
    },
    ruleFormSubmit() {
      this.$refs.ruleFormRef.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          const ruleList = this.$refs.ruleFormRef.ruleForm
          const form = this.viewDetail
          form.fieldList.forEach(item => {
            if (item.fieldName === this.column.label) {
              item.ruleList = ruleList.ruleList
            }
          })
          console.log(form, 'form')
          updateModelView(form).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.column = {}
              this.ruleFormVis = false
            } else {
              this.$message({
                type: 'error',
                message: '操作失败',
              })
            }
          }).finally(() => {
            this.$emit('refreshView')
            this.getViewTableList()
          })
          // this.ruleFormVis = false
        }
      })
    },
  },
  mounted() {
    console.log(this.viewId, 'props.viewId')
    console.log(this.viewDetail, 'props.viewDetail')
  },
  watch: {
    viewId: {
      handler(val) {
        console.log(val, 'watch viewId')
        this.current = 1
        this.pageSize = 10
        this.getViewTableList()
      },
    },
  },
}
</script>
<style></style>
