<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button @click="goBack()" size="small" icon="el-icon-back">返回</el-button>
    </div>
    <div>
      <el-form size="small" :inline="true" :model="searchForm">
        <el-form-item label="数据表名称">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" native-type="submit" @click="handleSearch">查询</el-button>
          <el-button size="small" native-type="reset" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="dataSetList" border tooltip-effect="dark" style="width: 100%" :height="800"
                row-key="id" size="small" v-loading="tableLoading">
        <el-table-column prop="name" label="数据表名称" width="230" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remarks" label="数据表备注" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="tableType" label="数据表类型" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- <el-button size="small" @click="addTask(scope.row)">新建任务</el-button> -->
            <!-- <el-button size="small" @click="viewData(scope.row)">查看表数据</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="50%" :visible.sync="dataTaskFormVis" title="新增任务">
      <data-table-task v-if="dataTaskFormVis" ref="taskFormRef" :rowData="rowData"></data-table-task>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="dataTaskFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="dataTaskFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDataSetList } from '@/api/data-table'
import { addTask } from '@/api/task-manage'
import DataTableTask from './task-form.vue'

export default {
  name: 'data-table',
  components: { DataTableTask },
  data() {
    return {
      tableLoading: false,
      dataSetList: [],
      dataTaskFormVis: false,
      rowData: {},
      searchForm: {
        name: '',
      },
      dataSrcDetailVis: false,
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    queryDataSetList(params) {
      this.tableLoading = true
      getDataSetList(params).then(res => {
        this.dataSetList = [...res.data.data]
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    addTask(row) {
      this.rowData = { ...row }
      this.dataTaskFormVis = true
    },
    viewData(row) {

    },
    handleSearch() {
      this.queryDataSetList({ ...this.$route.params, ...this.searchForm })
    },
    handleReset() {
      this.searchForm = {
        name: '',
      }
      this.queryDataSetList(this.$route.params)
    },
    dataTaskFormSubmit() {
      this.$refs.taskFormRef.$refs.formRef.validate((isValid) => {
        if (isValid) {
          let arr = []
          let datasetList = this.$refs.taskFormRef.dataItemList
          let selectedRows = this.$refs.taskFormRef.selectedRows
          datasetList.forEach((item) => {
            if (selectedRows.includes(item.columnName)) {
              arr.push({
                columnName: item.columnName,
                ruleId: item.ruleId,
                paras: item.paras ? item.paras.split(',') : [],
              })
            }
          })
          addTask({
            taskName: this.$refs.taskFormRef.ruleForm.taskName,
            design: arr,
            srcTableName: this.rowData.name,
            datasourceId: this.$route.params.did,
          }).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.dataTaskFormVis = false
            } else {
              this.$message({
                type: 'error',
                message: '操作失败',
              })
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败',
            })
          })
        }
      })
    },
  },
  mounted() {

  },
  watch: {
    '$route.params.did': {
      handler(val) {
        if (val) {
          this.queryDataSetList(this.$route.params)
        }
      },
      immediate: true,
    },
  },
}
</script>
<style scoped>

</style>
