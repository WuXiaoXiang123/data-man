<template>
  <div class="avue-sidebar">
    <el-scrollbar style="height: 100%;width: 100%">
      <el-menu :default-active="path" mode="vertical" style="height: 100vh;background: #4589e8;">
        <el-menu-item index="/taskManage" class="menu-item">
          <div solt="title" @click="goto('/taskManage')">数据任务</div>
        </el-menu-item>
        <el-menu-item index="/dataModel" class="menu-item">
          <div solt="title" @click="goto('/dataModel')">数据模型</div>
        </el-menu-item>
        <el-menu-item index="/dataSource" class="menu-item">
          <div solt="title" @click="goto('/dataSource')">数据源</div>
        </el-menu-item>
        <el-menu-item index="/rule" class="menu-item">
          <div solt="title" @click="goto('/rule')">规则</div>
        </el-menu-item>
        <el-menu-item index="/sensitive" class="menu-item">
          <div solt="title" @click="goto('/sensitive')">敏感词库</div>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  data() {
    return {}
  },
  created() {
  },
  computed: {
    path() {
      return this.$route.path
    },
  },
  methods: {
    goto(path) {
      this.$router.push(path)
    },
  },
}
</script>
<style lang="scss">
.avue-sidebar {
  width: 100%;
}

.menu-item {
  position: relative;
  height: 50px;
  color: #fff;
}

.menu-item.is-active {
  background-color: #ecf5ff
}

.menu-item ::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: #1890ff;
}

.el-menu-item:hover {
  background: #ecf5ff;
  & div{
    color: #409EFF;
  }
}
</style>
