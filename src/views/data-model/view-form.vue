<template>
  <div>
    <el-form :model="viewForm" :rules="viewRules" ref="viewFormRef" label-width="120px">
      <el-form-item label="视图名称" prop="viewName">
        <el-input v-model="viewForm.viewName" placeholder="请填写视图名称"></el-input>
      </el-form-item>
      <el-form-item v-if="formType == 'add'" label="视图字段" prop="fieldList">
        <el-checkbox-group v-model="viewForm.fieldList">
          <el-checkbox v-for="item in fieldList" :key="item.fieldName" :label="item.fieldName">
            {{ item.fieldName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getModelFieldList } from '@/api/data-model'
export default {
  name: 'view-form',
  props: {
    viewData: {
      type: Object,
    },
    formType: {
      type: String,
    },
    modelId: {
      type: String,
    },
  },
  data() {
    return {
      viewForm: {
        viewName: '',
        fieldList: [],
      },
      viewRules: {
        viewName: [
          {
            required: true,
            message: '视图名称必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 20,
            message: '名称不能超过20个字',
          },
        ],
      },
      fieldList:[],
    }
  },
  mounted() {
    if (this.formType === 'edit') {
      this.viewForm = { ...this.viewData }
    } else {
      this.queryFieldList({ modelId: this.modelId })
    }
  },
  methods: {
    queryFieldList(params) {
      getModelFieldList(params).then((res) => {
        this.fieldList = [...res.data.data]
      })
    },
  },
}
</script>
<style scoped></style>
