<template>
  <div>
<!--    <div>-->
<!--      <el-form size="small" :inline="true" :model="searchForm">-->
<!--        <el-form-item label="规则名称">-->
<!--          <el-input v-model="searchForm.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button size="small" type="primary" native-type="submit" @click="handleSearch">查询</el-button>-->
<!--          <el-button size="small" native-type="reset" @click="handleReset">重置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </div>-->
    <el-table
      :data="ruleList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 10px"
      :height="300"
      row-key="id"
      size="mini"
      v-loading="tableLoading"
    >
      <el-table-column prop="name" label="规则名称"></el-table-column>
      <el-table-column prop="title" label="规则Title"></el-table-column>
      <el-table-column prop="description" label="规则说明"></el-table-column>
      <el-table-column prop="parameterUsage" :formatter="usageFormat" label="参数使用说明">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRuleList } from '@/api/rule'

export default {
  name: 'rule-list',
  data() {
    return {
      ruleList: [
        {
          id: 1,
          resourceName: '22',
          resourceCode: '223',
        },
      ],
      searchForm: {
        name: '',
      },
      tableLoading: false,
    }
  },
  mounted() {
    this.queryRuleList()
  },
  methods: {
    queryRuleList(params) {
      this.tableLoading = true
      getRuleList(params).then(res => {
        if (res.data.code === 0) {
          this.ruleList = res.data.data
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleSearch() {
      this.queryRuleList({ ...this.searchForm })
    },
    handleReset() {
      this.searchForm = {
        name: '',
      }
      this.queryRuleList()
    },
    usageFormat(row) {
      return row.parameterUsage && row.parameterUsage.length ? row.parameterUsage.join('；') : '无参数'
    },
  },
}
</script>
