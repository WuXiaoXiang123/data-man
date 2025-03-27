<template>
  <div>
    <div>
      <el-descriptions size="small" border>
        <el-descriptions-item labelClassName="label" label="数据模型名称">
          {{ dataModel.name }}
        </el-descriptions-item>
        <el-descriptions-item labelClassName="label" label="数据表">
          {{ dataModel.mainTableName }}
        </el-descriptions-item>
        <el-descriptions-item labelClassName="label" label="关联表">
          {{ dataModel.joinTableName }}
        </el-descriptions-item>
        <el-descriptions-item labelClassName="label" label="关联关系">
          <div v-for="(item, index) in dataModel.relation" :key="index">
            <span>{{ item.mainFieldName }} - {{ item.joinFieldName }}</span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin: 10px 0;">
      <el-button size="small" @click="viewFormVis = true">新增视图</el-button>
      <el-tooltip :content="dataModel.sql" placement="top">
        <el-button size="small">SQL</el-button>
      </el-tooltip>
      <el-button size="small" @click="dataComparison">数据对比</el-button>
      <el-button size="small" @click="createExportTask">创建导出任务</el-button>
    </div>
    <div>
      <el-tabs v-model="activeView">
        <el-tab-pane :disabled="viewDetailLoading" v-for="item in dataModel.viewList" :name="String(item.id)"
          :key="item.id">
          <span style="margin: 0 10px;" slot="label"> {{ item.viewName }} <i v-if="activeView == item.id"
              @click="editView(item)" class="el-icon-edit"></i></span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <view-table :viewId="String(activeView)" :viewDetail="viewDetail" @refresh="refreshView"></view-table>
    </div>
    <el-dialog width="40%" :title="formType == 'add' ? '新建视图' : '编辑视图'" :visible.sync="viewFormVis">
      <view-form v-if="viewFormVis" ref="viewFormRef" :modelId="String(dataModel.id)" :viewData="rowData"
        :formType="formType"></view-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="viewFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="viewFormSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="新建导出任务" :visible.sync="exportFormVis">
      <task-form v-if="exportFormVis" ref="exportFormRef"></task-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="exportFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="exportFormSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="90%" title="数据对比" :visible.sync="dataComparisonFormVis">
      <data-comparison v-if="dataComparisonFormVis" :sourceData="sourceView" :viewList="dataModel.viewList"></data-comparison>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="dataComparisonFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="exportFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDataModelDetail } from '@/api/data-model'
import { addModelView, updateModelView, getViewDetail } from '@/api/model-view'
import { addTask } from '@/api/task-manage'
import viewForm from './view-form.vue'
import viewTable from './view-table.vue'
import taskForm from './task-form.vue'
import dataComparison from './data-comparison.vue'
export default {
  name: 'data-model-detail',
  components: { viewForm, viewTable, taskForm, dataComparison },
  data() {
    return {
      dataModel: {

      },
      activeView: '',
      viewFormVis: false,
      rowData: {},
      formType: 'add',
      viewDetail: {},
      viewDetailLoading: false,
      exportFormVis: false,
      dataComparisonFormVis: false,
      sourceView: {},
    }
  },
  mounted() {
    this.queryDataModelDetail({ id: this.$route.params.mid })
  },
  methods: {
    queryDataModelDetail(params) {
      getDataModelDetail(params).then(res => {
        if (res.data.code === 0) {
          this.dataModel = res.data.data
          this.activeView = String(this.dataModel.viewList[0].id)
        }
      })
    },
    viewFormSubmit() {
      this.$refs.viewFormRef.$refs.viewFormRef.validate(valid => {
        if (valid) {
          const form = this.$refs.viewFormRef.viewForm
          if (this.formType == 'add') {
            const arr = []
            form.fieldList.forEach(element => {
              arr.push({ fieldName: element, ruleList: [] })
            })
            form.fieldList = arr
            form.modelId = this.dataModel.id
            addModelView(form).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.viewFormVis = false
            }).finally(() => {
              this.queryDataModelDetail({ id: this.$route.params.mid })
            })
          } else {
            this.viewDetail.viewName = form.viewName
            updateModelView(this.viewDetail).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.viewFormVis = false
            }).finally(() => {
              this.queryDataModelDetail({ id: this.$route.params.mid })
            })
          }

        }
      })
    },
    editView(row) {
      this.formType = 'edit'
      this.rowData = row
      this.viewFormVis = true
    },
    refreshView() {
      this.queryDataModelDetail({ id: this.$route.params.mid })
    },
    dataComparison(){
      this.sourceView = this.dataModel.viewList.filter(item => item.id == this.activeView)[0]
      this.dataComparisonFormVis = true
    },
    createExportTask(){
      this.exportFormVis = true
    },
    exportFormSubmit(){
      this.$refs.exportFormRef.$refs.taskFormRef.validate(valid => {
        if (valid) {
          const form = this.$refs.exportFormRef.taskForm
          form.viewId = this.activeView
          addTask(form).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.exportFormVis = false
            } else {
              this.$message({
                type: 'error',
                message: '操作失败',
              })
            }
          })
        }
      })
    },
  },
  watch: {
    activeView(val) {
      if (val != '0') {
        this.viewDetailLoading = true
        getViewDetail({ id: val }).then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data,'viewDetail')
            this.viewDetail = res.data.data
          }
        }).finally(() => {
          this.viewDetailLoading = false
        })
      }
    },
  },
}
</script>
<style>
.label {
  width: 100px;
  text-align: center;
}
</style>
