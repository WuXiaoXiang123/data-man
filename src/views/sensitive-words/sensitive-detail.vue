<template>
  <div style="padding: 10px">
    <div style="padding-bottom: 10px">
      <el-button type="primary" size="small" @click="wordFormType='add';wordFormVis=true">新建敏感词</el-button>
    </div>
    <el-table :data="wordList" border tooltip-effect="dark" style="width: 100%" :height="740"
              row-key="id" size="small" v-loading="tableLoading">
      <el-table-column prop="targetWord" label="敏感词" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="replaceWord" label="替换词" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="editWord(scope.row)" style="margin-right: 10px">编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="delWord(scope.row)" style="margin-right: 10px">
            <el-button size="small" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="40%" :title="wordFormType === 'add'?'新增敏感词':'编辑敏感词'" :visible.sync="wordFormVis"
               :append-to-body="true">
      <word-form ref="wordForm" v-if="wordFormVis" :formType="wordFormType"
                 :wordData="rowData"></word-form>
      <div slot="footer" style="display: flex;justify-content: center">
        <el-button size="small" @click="wordFormVis = false">取消</el-button>
        <el-button size="small" type="primary" @click="wordFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { addWord, getSensitiveWordsDetail, removeWord, updateWord } from '@/api/sensitive-words'
import WordForm from './word-form.vue'

export default {
  name: 'sensitive-detail',
  components: { WordForm },
  props: {
    sensitiveId: {
      type: String,
    },
  },
  data() {
    return {
      tableLoading: false,
      wordList: [],
      wordFormType: 'add',
      wordFormVis: false,
      rowData: {},
    }
  },
  mounted() {
    this.queryWordList({ id: this.sensitiveId })
  },
  methods: {
    queryWordList(params) {
      this.tableLoading = true
      getSensitiveWordsDetail(params).then(res => {
        let data = res.data.data
        this.wordList = [...data.wordList]
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    editWord(rowData) {
      this.rowData = { ...rowData }
      this.wordFormType = 'edit'
      this.wordFormVis = true
    },
    delWord(row) {
      removeWord({ id: row.id }).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          })
          this.queryWordList({ id: this.sensitiveId })
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
    wordFormSubmit() {
      this.$refs.wordForm.$refs.formRef.validate((isValid) => {
        if (isValid) {
          if (this.wordFormType === 'add') {
            addWord({ ...this.$refs.wordForm.ruleForm, baseId: this.sensitiveId }).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.wordFormVis = false
                this.queryWordList({ id: this.sensitiveId })
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
            Object.assign(this.rowData, this.$refs.wordForm.ruleForm)
            updateWord(this.rowData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                })
                this.wordFormVis = false
                this.queryWordList({ id: this.sensitiveId })
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
  },
}
</script>
<style scoped>
.detail-info {
  padding: 10px 0;
}
</style>
