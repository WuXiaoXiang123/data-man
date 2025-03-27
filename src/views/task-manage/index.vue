<template>
  <div class="avue-contain">
    <div>
      <el-form size="small" :inline="true" :model="searchForm">
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.taskName"></el-input>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchForm.state">
            <el-option :value="0" label="未开始"></el-option>
            <el-option :value="1" label="进行中"></el-option>
            <el-option :value="2" label="已完成"></el-option>
            <el-option :value="3" label="已终止"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" native-type="submit" @click="handleSearch">查询</el-button>
          <el-button size="small" native-type="reset" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="taskList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px" :max-height="800"
      row-key="id" size="small" v-loading="tableLoading">
      <el-table-column prop="name" show-overflow-tooltip label="任务名称" width="200"></el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" :formatter="timeFormat"
        width="160"></el-table-column>
      <el-table-column prop="taskStatus" show-overflow-tooltip label="任务状态" :formatter="stateFormat"
        width="120"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-popconfirm v-if="scope.row.state === 0 || scope.row.state === 4" title="确认删除？"
            @confirm="delTask(scope.row)" style="margin-right: 10px">
            <el-button size="small" slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button size="small" v-if="scope.row.state === 0 || scope.row.state === 4"
            @click="startTask(scope.row)">启动</el-button>
          <el-button size="small" v-if="scope.row.state === 1" @click="terminateTask(scope.row)">终止</el-button>
          <!-- <el-button size="small" v-if="scope.row.state === 2" @click="viewData(scope.row)">数据对比</el-button> -->
          <el-button size="small" v-if="scope.row.state === 2" @click="exportData(scope.row)">导出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center">
      <el-pagination background layout="total,prev,pager,next,jumper" :page-count="size" :total="total"
        :current-page="current" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog width="50%" title="编辑任务" :visible.sync="taskFormVis">
      <taskForm v-if="taskFormVis" ref="taskForm" :rowData="rowData"></taskForm>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="taskFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="taskFormSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="70%" title="数据对比" :visible.sync="viewDataFormVis">
      <viewData v-if="viewDataFormVis" :rowData="rowData"></viewData>
    </el-dialog>

  </div>
</template>

<script>
import { exportData, getTaskList, removeTask, taskStart, taskTerminate, updateTask } from '@/api/task-manage'
import taskForm from './task-form.vue'
import viewData from './view-data.vue'
import dayjs from 'dayjs'


const FileSaver = require('file-saver')

export default {
  name: 'task-manage',
  components: { taskForm, viewData },
  data() {
    return {
      taskList: [],
      total: 0,
      current: 1,
      size: 10,
      taskFormVis: false,
      viewDataFormVis: false,
      formType: 'add',
      viewDataList: [],
      searchForm: {},
      tableLoading: false,
      rowData: {},
    }
  },
  created() {
    //实时检测刷新token
  },
  mounted() {
    this.queryTaskList({ current: 1, size: this.size })
  },
  computed: {},
  methods: {
    //查询任务列表
    queryTaskList(params) {
      const { current } = params
      this.tableLoading = true
      getTaskList(params).then(res => {
        if (res.data.code === 0) {
          const { total, records } = res.data.data
          this.current = current
          this.total = total
          this.taskList = [...records]
        }
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    //修改任务提交
    taskFormSubmit() {
      this.$refs.taskForm.$refs.formRef.validate((isValid) => {
        if (isValid) {
          let ruleForm = this.$refs.taskForm.ruleForm
          let arr = []
          let datasetList = this.$refs.taskForm.dataItemList
          let selectedRows = this.$refs.taskForm.selectedRows
          datasetList.forEach((item) => {
            if (selectedRows.includes(item.columnName)) {
              arr.push({
                columnName: item.columnName,
                ruleId: item.ruleId,
                paras: item.paras ? item.paras.split(',') : [],
              })
            }
          })
          this.rowData.design = [...arr]
          Object.assign(this.rowData, ruleForm)
          updateTask(this.rowData).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.taskFormVis = false
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
          }).finally(() => {
            this.queryTaskList({ current: this.current, size: this.size, ...this.searchForm })
          })
        }
      })
    },
    addTask() {

    },
    //打开编辑弹窗
    editTask(row) {
      this.taskFormVis = true
      this.rowData = { ...row }
    },
    //删除任务
    delTask(row) {
      removeTask(row.id).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          })
        }
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: '操作失败',
        })
      }).finally(() => {
        this.queryTaskList({ current: this.current, size: this.size, ...this.searchForm })
      })
    },
    //开始任务
    startTask(row) {
      taskStart({ taskId: row.id }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          })
        }
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: '操作失败',
        })
      }).finally(() => {
        this.queryTaskList({ current: this.current, size: this.size, ...this.searchForm })
      })
    },
    //终止任务
    terminateTask(row) {
      taskTerminate(row.id).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          })
        }
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: '操作失败',
        })
      }).finally(() => {
        this.queryTaskList({ current: this.current, size: this.size, ...this.searchForm })
      })
    },
    //数据对比
    viewData(row) {
      this.viewDataFormVis = true
      this.rowData = { ...row }
    },
    handleSearch() {
      this.queryTaskList({ ...this.searchForm, current: this.current, size: this.size })
    },
    handleReset() {
      this.current = 1
      this.searchForm = {
        taskName: '',
        state: '',
      }
      this.queryTaskList({ current: 1, size: this.size })
    },
    timeFormat(row) {
      return dayjs(row.createTime).format('YYYY-MM-DD')
    },
    stateFormat(row) {
      return ['未开始', '进行中', '已完成', '已终止', '已失败'][row.state]
    },
    //导出
    exportData(row) {
      let msg = this.$message({ type: 'info', message: '下载中...', duration: 0 })
      exportData(row.id).then((res) => {
        let blob = new Blob([res.data]) //Blob对象 不可变，原始数据的类文件对象，可以按照二进制的格式读取
        FileSaver.saveAs(blob, `${dayjs().format('YYYY/MM/DD')}_${row.taskName}.xlsx`)
        msg.close()
        this.$message('下载成功')
      }).catch((err) => {
        msg.close()
        this.$message({ type: 'error', message: '下载失败' })
      })
    },
    handleCurrentChange(val) {
      this.queryTaskList({ current: val, size: this.size, ...this.searchForm })
    },
  },
}
</script>
