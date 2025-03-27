<template>
  <div>
    <el-form :model="ruleForm" ref="ruleFormRef" label-width="120px">
      <div v-for="(item, index) in ruleForm.ruleList" :key="index" style="display: flex;align-items: center;">
        <el-form-item label="规则" :prop="item.ruleId">
          <el-select v-model="item.ruleId" style="width: 300px" clearable>
            <el-option v-for="(item) in allRules" :key="item.id" :value="item.name"
              :label="`${item.title}(${item.name})(${item.parameterUsage && item.parameterUsage.length ? item.parameterUsage.join('；') : '无参数'})`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数" :prop="item.params">
          <el-select v-if="item.ruleId === 'dx_sensitive'" v-model="item.params" style="width:300px">
            <el-option v-for="(item) in sensitiveList" :key="item.id" :value="item.id"
              :label="item.baseName"></el-option>
          </el-select>
          <el-input style="width:300px" v-else v-model="item.params" placeholder="填写多个参数时以逗号（英文逗号）分割"
            :disabled="!item.ruleId" :maxlength="80"></el-input>
        </el-form-item>
        <el-button style="margin-left: 10px;margin-bottom: 20px;" size="small" icon="el-icon-minus" @click="delRule(index)"></el-button>
      </div>
      <el-button v-if="ruleForm.ruleList.length < 3" @click="addRule">添加规则</el-button>
    </el-form>
  </div>
</template>
<script>
import { getRuleList } from '@/api/rule'
import { getSensitiveListNoPage } from '@/api/sensitive-words'
export default {
  name: 'rule-form',
  props: {
    columnRuleList: {
      type: Array,
    },
  },
  data() {
    return {
      ruleForm: {
        ruleList: [
          {
            ruleId: '',
            params: '',
          },
        ],
      },
      fieldList: [],
      allRules: [],
      sensitiveList: [],
    }
  },
  mounted() {
    this.ruleForm.ruleList = this.columnRuleList || []
    this.queryAllRules()
    this.querySensitiveList()
  },
  methods: {
    queryAllRules(params) {
      getRuleList(params).then((res) => {
        this.allRules = [...res.data.data]
      })
    },
    querySensitiveList() {
      getSensitiveListNoPage().then((res) => {
        this.sensitiveList = [...res.data.data]
      })
    },
    addRule() {
      this.ruleForm.ruleList.push({
        ruleId: '',
        params: '',
      })
    },
    delRule(index) {
      this.ruleForm.ruleList.splice(index, 1)
    },
  },
}
</script>
<style scoped></style>
