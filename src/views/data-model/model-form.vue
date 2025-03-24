<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="数据模型名称" prop="modelName">
        <el-input v-model="ruleForm.modelName" placeholder="请填写数据模型名称"></el-input>
      </el-form-item>
      <el-form-item label="数据表" prop="mainTableName">
        <el-select v-model="ruleForm.mainTableName" style="width: 100%" clearable filterable
          @change="(e) => queryColumnList(e, 'mainColumnList')">
          <el-option v-for="item in dataTableList" :key="item.name" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联表" prop="joinTableName">
        <el-select v-model="ruleForm.joinTableName" style="width: 100%" clearable filterable
          @change="e => queryColumnList(e, 'joinColumnList')">
          <el-option v-for="item in dataTableList" :key="item.name" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联关系" prop="relation" v-if="ruleForm.joinTableName">
        <div v-for="(item, index) in ruleForm.relation" :key="index" style="display: flex">
          <el-select v-model="item.mainFieldName" style="width: 200px" clearable filterable
            :placeholder="ruleForm.mainTableName">
            <el-option v-for="column in mainColumnList" :key="column.name" :value="column.name"
              :label="column.name"></el-option>
          </el-select>
          <div style="margin: 0 10px;" > - </div>
          <el-select v-model="item.joinFieldName" style="width: 200px" clearable filterable
            :placeholder="ruleForm.joinTableName">
            <el-option v-for="column in joinColumnList" :key="column.name" :value="column.name"
              :label="column.name"></el-option>
          </el-select>
        </div>
        <el-button v-if="ruleForm.relation.length < 1" @click="addRelation">添加关联关系</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDataSetList, getColumnList } from '@/api/data-table'
export default {
  name: 'model-form',
  props: {
    sensitiveData: {
      type: Object,
    },
    formType: {
      type: String,
    },
  },
  data() {
    return {
      dataTableList: [],
      mainColumnList: [],
      joinColumnList: [],
      ruleForm: {
        mainTableName: '',
        joinTableName: '',
        modelName: '',
        relation: [],
      },
      rules: {
        mainTableName: [
          {
            required: true,
            message: '数据表必选',
            trigger: 'change',
          },
        ],
        modelName: [
          {
            required: true,
            message: '数据模型名称必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 50,
            message: '库描述不能超过50个字',
          },
        ],
      },
    }
  },
  mounted() {
    if (this.formType === 'edit') {
      this.ruleForm = { ...this.sensitiveData }
    }
    this.queryDataTableList({ did: 1 })
  },
  methods: {
    queryDataTableList(params) {
      getDataSetList(params).then((res) => {
        this.dataTableList = [...res.data.data]
      })
    },
    addRelation() {
      this.ruleForm.relation.push({
        mainFieldName: '',
        joinFieldName: '',
      })
    },
    queryColumnList(e, name) {
      getColumnList(1, e).then((res) => {
        console.log('res', res)
        const obj = res.data.data
        for (let i in obj) {
          this[name].push({ name: i })
        }
      })
    },
  },
}
</script>
<style scoped></style>
