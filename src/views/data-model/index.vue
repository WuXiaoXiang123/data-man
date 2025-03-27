<template>
  <div class="avue-contain">
    <div>
      <el-form size="small" :inline="true" :model="searchForm">
        <el-form-item label="模型名">
          <el-input v-model="searchForm.modelName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" native-type="submit" @click="handleSearch">查询</el-button>
          <el-button size="small" native-type="reset" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 16px;">
      <el-button type="primary" @click="modelFormVis = true">新建数据模型</el-button>
    </div>
    <el-table :data="modelList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 10px" :max-height="800"
      row-key="id" size="small" v-loading="tableLoading">
      <el-table-column prop="name" label="模型名" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="goToDetail(scope.row)"
            :style="{ marginRight: '10px' }">详情
          </el-button>
          <el-popconfirm title="确认删除？" @confirm="delModel(scope.row)" style="margin-right: 10px">
            <el-button size="small" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center">
      <el-pagination background layout="total,prev,pager,next,jumper" :page-count="size" :total="total"
        :current-page="current" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog width="40%" title="新建数据模型" :visible.sync="modelFormVis">
      <modelForm v-if="modelFormVis" ref="dataModelForm"></modelForm>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="modelFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="modelFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataModelList, removeDataModel, addDataModel } from '@/api/data-model'
import dayjs from 'dayjs'
import modelForm from './model-form.vue'


export default {
  name: 'data-model',
  components: { modelForm },
  data() {
    return {
      modelList: [],
      total: 0,
      current: 1,
      size: 10,
      modelFormVis: false,
      viewDataFormVis: false,
      formType: 'add',
      viewDataList: [],
      searchForm: {
        modelName: '',
      },
      tableLoading: false,
      rowData: {},
    }
  },
  created() {
    //实时检测刷新token
  },
  mounted() {
    this.queryModelList({ current: 1, size: this.size })
  },
  computed: {},
  methods: {
    //查询任务列表
    queryModelList(params) {
      const { current } = params
      this.tableLoading = true
      getDataModelList(params).then(res => {
        if (res.data.code === 0) {
          const { total, records } = res.data.data
          this.current = current
          this.total = total
          this.modelList = [...records]
        }
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    //新建数据模型提交
    modelFormSubmit() {
      this.$refs.dataModelForm.$refs.formRef.validate((isValid) => {
        if (isValid) {
          const form = this.$refs.dataModelForm.ruleForm
          addDataModel(form).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.dataModelFormVis = false
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
            this.queryModelList({ current: this.current, size: this.size, ...this.searchForm })
          })
        }
      })
    },
    // 查看详情
    goToDetail(row) {
      this.$router.push(`/dataModel/${row.id}`)
    },
    //删除任务
    delModel(row) {
      removeDataModel(row.id).then(res => {
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
        this.queryModelList({ current: this.current, size: this.size, ...this.searchForm })
      })
    },
    handleSearch() {
      this.queryModelList({ ...this.searchForm, current: this.current, size: this.size })
    },
    handleReset() {
      this.current = 1
      this.searchForm = {
        dataModelName: '',
      }
      this.queryModelList({ current: 1, size: this.size })
    },
    timeFormat(row) {
      return dayjs(row.createTime).format('YYYY-MM-DD')
    },
    handleCurrentChange(val) {
      this.queryModelList({ current: val, size: this.size, ...this.searchForm })
    },
  },
}
</script>
