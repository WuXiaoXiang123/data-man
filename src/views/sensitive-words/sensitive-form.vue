<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="库名称" prop="baseName">
        <el-input v-model="ruleForm.baseName" placeholder="请填写库名称"></el-input>
      </el-form-item>
      <el-form-item label="库描述" prop="desc">
        <el-input v-model="ruleForm.desc" placeholder="请填写库描述"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'sensitive-form',
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
      ruleForm: {
        baseName: '',
        desc: '',
      },
      rules: {
        baseName: [
          {
            required: true,
            message: '库名称必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 20,
            message: '名称不能超过20个字',
          },
        ],
        desc: [
          {
            type: 'string',
            max: 255,
            message: '库描述不能超过255个字',
          },
        ],
      },
    }
  },
  mounted() {
    if(this.formType === 'edit'){
      this.ruleForm = { ...this.sensitiveData }
    }
  },
  methods: {},
}
</script>
<style scoped>

</style>
