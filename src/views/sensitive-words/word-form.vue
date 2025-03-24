<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="敏感词" prop="targetWord">
        <el-input v-model="ruleForm.targetWord" placeholder="请填写敏感词"></el-input>
      </el-form-item>
      <el-form-item label="替换词" prop="replaceWord">
        <el-input v-model="ruleForm.replaceWord" placeholder="若不填写替换词，默认替换为*"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'word-form',
  props: {
    wordData: {
      type: Object,
    },
    formType: {
      type: String,
    },
  },
  data() {
    return {
      ruleForm: {
        targetWord: '',
        replaceWord: '',
      },
      rules: {
        targetWord: [
          {
            required: true,
            message: '敏感词必填',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 20,
            message: '敏感词不能超过20个字',
          },
        ],
        replaceWord: [
          {
            type: 'string',
            max: 20,
            message: '替换词不能超过20个字',
          },
        ],
      },
    }
  },
  mounted() {
    if(this.formType === 'edit'){
      this.ruleForm = { ...this.wordData }
    }
  },
  methods: {},
}
</script>
<style scoped>

</style>
