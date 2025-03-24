<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="数据源名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请填写数据源名称"></el-input>
      </el-form-item>
      <el-form-item label="驱动" prop="driver">
        <el-input v-model="ruleForm.driver" placeholder="请填写驱动"></el-input>
      </el-form-item>
      <el-form-item label="数据库链接" prop="url">
        <el-input v-model="ruleForm.url" placeholder="请填写数据库链接"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请填写用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请填写密码" show-password></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'data-source-form',
  props: {
    dataSrcData: {
      type: Object,
    },
    formType: {
      type: String,
    },
  },
  data() {
    return {
      ruleForm: {
        name: '',
        driver: '',
        url: '',
        username: '',
        password: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '数据源名称必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 60,
            message: '名称不能超过60个字',
          },
        ],
        driver: [
          {
            required: true,
            message: '驱动必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 255,
            message: '驱动不能超过255个字',
          },
        ],
        url: [
          {
            required: true,
            message: '数据库链接必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 255,
            message: '数据库链接不能超过255个字',
          },
        ],
        username: [
          {
            required: true,
            message: '用户名必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 100,
            message: '用户名不能超过100个字',
          },
        ],
        password: [
          {
            required: true,
            message: '密码必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 100,
            message: '密码不能超过100个字',
          },
        ],
      },
    }
  },
  mounted() {
    if(this.formType === 'edit'){
      this.ruleForm = { ...this.dataSrcData }
    }
  },
  methods: {},
}
</script>
<style scoped>

</style>
