<template>
  <div>
    <el-form :model="taskForm" :rules="rules" ref="taskFormRef" label-width="120px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="taskForm.name" placeholder="请填写任务名称"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'task-form',
  data() {
    return {
      taskForm: {
        name: '',
      },
      rules: {
        name: [
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
}
</script>
<style scoped></style>
