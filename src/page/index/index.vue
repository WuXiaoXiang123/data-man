<template>
  <div class="avue-contail">
    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-main">
        <!-- 主体视图层 -->
        <div style="overflow-y: auto; overflow-x: hidden" id="avue-view">
          <router-view class="avue-view"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from './sidebar/'

export default {
  components: {
    sidebar,
  },
  name: 'index',
  provide() {
    return {
      index: this,
    }
  },
  data() {
    return {}
  },
}
</script>
<style>
.avue-layout {
  display: flex;
  min-height: 100%;
}

.avue-left {
  flex-shrink: 0;
  min-height: 100%;
  width: 230px;
}

.avue-main {
  width: calc(100% - 230px);
  padding: 10px;
}
</style>
