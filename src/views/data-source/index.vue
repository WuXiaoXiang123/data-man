<template>
  <div class="avue-contain">
    <el-table :data="dataSourceList" border tooltip-effect="dark" style="width: 100%" :height="800" row-key="id"
      size="small" v-loading="tableLoading">
      <el-table-column prop="name" label="数据源名称" width="230" show-overflow-tooltip></el-table-column>
      <el-table-column prop="driver" label="驱动" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column prop="url" label="数据库链接" show-overflow-tooltip width="560"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button size="small" @click="gotoTable(scope.row)">数据表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="40%" :title="dataSrcFormType === 'add' ? '新增数据源' : '编辑数据源'" :visible.sync="dataSrcFormVis">
      <data-source-form ref="dataSrcForm" v-if="dataSrcFormVis" :formType="dataSrcFormType"
        :dataSrcData="rowData"></data-source-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="dataSrcFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="dataSourceFormSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer title="数据源详情" :size="1000" direction="rtl" :visible.sync="dataSrcDetailVis" :destroy-on-close="true">
      <data-source-detail :rowData="rowData"></data-source-detail>
    </el-drawer>
  </div>
</template>

<script>
import { addDataSource, getDataSourceList, removeDataSource, updateDataSource } from '@/api/data-source'
import DataSourceForm from './data-source-form.vue'
import DataSourceDetail from './data-source-detail.vue'

export default {
  name: 'data-source',
  components: { DataSourceForm, DataSourceDetail },
  data() {
    return {
      tableLoading: false,
      dataSourceList: [],
      dataSrcFormVis: false,
      dataSrcFormType: 'add',
      rowData: {},
      searchForm: {
        name: '',
      },
      dataSrcDetailVis: false,
    }
  },
  mounted() {
    this.queryDataSrcList()
  },
  methods: {
    queryDataSrcList(params) {
      this.tableLoading = true
      getDataSourceList(params).then(res => {
        this.dataSourceList = [...res.data.data]
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    editDataSource(rowData) {
      this.rowData = { ...rowData }
      this.dataSrcFormType = 'edit'
      this.dataSrcFormVis = true
    },
    delDataSource(row) {
      removeDataSource(row.id).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
          this.queryDataSrcList(this.searchForm)
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
      this.dataSrcDetailVis = true
    },
    dataSourceFormSubmit() {
      this.$refs.dataSrcForm.$refs.formRef.validate((isValid) => {
        if (isValid) {
          if (this.dataSrcFormType === 'add') {
            addDataSource(this.$refs.dataSrcForm.ruleForm).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.dataSrcFormVis = false
                this.queryDataSrcList(this.searchForm)
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
            Object.assign(this.rowData, this.$refs.dataSrcForm.ruleForm)
            updateDataSource(this.rowData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.dataSrcFormVis = false
                this.queryDataSrcList(this.searchForm)
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
      this.queryDataSrcList(this.searchForm)
    },
    handleReset() {
      this.searchForm = {
        name: '',
      }
      this.queryDataSrcList()
    },
    gotoTable(row) {
      this.$router.push('/dataSource/' + row.id)
    },
  },
}
</script>
<style scoped></style>
