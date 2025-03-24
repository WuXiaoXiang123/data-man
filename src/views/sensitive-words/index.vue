<template>
  <div class="avue-contain">
    <div>
      <el-form size="small" :inline="true" :model="searchForm">
        <el-form-item label="库名称">
          <el-input v-model="searchForm.baseName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" native-type="submit" @click="handleSearch">查询</el-button>
          <el-button size="small" native-type="reset" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding-bottom: 10px">
      <el-button type="primary" size="small" @click="sensitiveFormType='add';sensitiveFormVis=true">新建敏感词库
      </el-button>
    </div>
    <el-table :data="sensitiveWordsList" border tooltip-effect="dark" style="width: 100%" :height="760"
              row-key="id" size="small" v-loading="tableLoading">
      <el-table-column prop="baseName" label="库名称" width="230" show-overflow-tooltip></el-table-column>
      <el-table-column prop="desc" label="库描述" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="editSensitive(scope.row)" style="margin-right: 10px">编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="delSensitive(scope.row)" style="margin-right: 10px">
            <el-button size="small" slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-popconfirm title="确认复制？" @confirm="copySensitive(scope.row)" style="margin-left: 10px">
            <el-button size="small" slot="reference">复制库</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:10px 0;text-align: center">
      <el-pagination background layout="total,prev,pager,next,jumper" :page-count="size" :total="listTotal"
                     :current-page="current" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog width="40%" :title="sensitiveFormType === 'add'?'新增敏感词库':'编辑敏感词库'"
               :visible.sync="sensitiveFormVis">
      <sensitive-form ref="sensitiveForm" v-if="sensitiveFormVis" :formType="sensitiveFormType"
                      :sensitiveData="rowData"></sensitive-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="sensitiveFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="sensitiveFormSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer title="敏感词库详情" :size="1000" direction="rtl" :visible.sync="sensitiveDetailVis"
               :destroy-on-close="true" :append-to-body="true">
      <sensitive-detail :sensitiveId="rowData.id"></sensitive-detail>
    </el-drawer>
  </div>
</template>

<script>
import {
  addSensitiveWords,
  copySensitiveWords,
  getSensitiveWordsList,
  removeSensitiveWords,
  updateSensitiveWords,
} from '@/api/sensitive-words'
import SensitiveForm from './sensitive-form.vue'
import SensitiveDetail from './sensitive-detail.vue'

export default {
  name: 'sensitive-words',
  components: { SensitiveForm, SensitiveDetail },
  data() {
    return {
      tableLoading: false,
      current: 1,
      size: 20,
      listTotal: 0,
      sensitiveWordsList: [],
      sensitiveFormVis: false,
      sensitiveFormType: 'add',
      rowData: {},
      searchForm: {
        baseName: '',
      },
      sensitiveDetailVis: false,
    }
  },
  mounted() {
    this.querySensitiveList({ current: this.current, size: this.size })
  },
  methods: {
    querySensitiveList(params) {
      const { current } = params
      this.tableLoading = true
      getSensitiveWordsList(params).then(res => {
        const { total, records } = res.data.data
        this.current = current
        this.total = total
        this.sensitiveWordsList = [...records]
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    editSensitive(rowData) {
      this.rowData = { ...rowData }
      this.sensitiveFormType = 'edit'
      this.sensitiveFormVis = true
    },
    delSensitive(row) {
      removeSensitiveWords({ id: row.id }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
          this.querySensitiveList({ ...this.searchForm, current: this.current, size: this.size })
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
    },
    copySensitive(row) {
      copySensitiveWords({ id: row.id }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
          this.querySensitiveList({ ...this.searchForm, current: this.current, size: this.size })
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
    },
    viewDetail(row) {
      this.rowData = { ...row }
      this.sensitiveDetailVis = true
    },
    sensitiveFormSubmit() {
      this.$refs.sensitiveForm.$refs.formRef.validate((isValid) => {
        if (isValid) {
          if (this.sensitiveFormType === 'add') {
            addSensitiveWords(this.$refs.sensitiveForm.ruleForm).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.sensitiveFormVis = false
                this.querySensitiveList({ ...this.searchForm, current: this.current, size: this.size })
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
          } else {
            Object.assign(this.rowData, this.$refs.sensitiveForm.ruleForm)
            updateSensitiveWords(this.rowData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.sensitiveFormVis = false
                this.querySensitiveList({ ...this.searchForm, current: this.current, size: this.size })
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
        }
      })
    },
    handleSearch() {
      this.current = 1
      this.querySensitiveList({ ...this.searchForm, current: 1, size: 20 })
    },
    handleReset() {
      this.searchForm = {
        baseName: '',
      }
      this.current = 1
      this.size = 20
      this.querySensitiveList({ current: 1, size: 20 })
    },
    handleCurrentChange(val) {
      this.querySensitiveList({ current: val, size: this.size, ...this.searchForm })
    },
  },
}
</script>
<style scoped>

</style>
