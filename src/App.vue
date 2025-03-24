<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'app',
  data() {
    return {}
  },
}
</script>
<style lang='scss'>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}


ul {
  list-style: none;
  padding-left: 0px !important;
}
</style>
