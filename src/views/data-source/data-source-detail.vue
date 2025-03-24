<template>
  <div style="padding: 10px">
    <div class="detail-info">
      <el-descriptions size="small" border>
        <el-descriptions-item>
          <template slot="label">数据源名称</template>
          {{ rowData.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">驱动</template>
          {{ rowData.driver }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">用户名</template>
          {{ rowData.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">密码</template>
          {{ rowData.password }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">数据源链接</template>
          {{ rowData.url }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
<script>


export default {
  name: 'data-source-detail',
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      dataSetList: [],
      dataList: [],
    }
  },
}
</script>
<style scoped>
.detail-info {
  padding: 10px 0;
}
</style>
