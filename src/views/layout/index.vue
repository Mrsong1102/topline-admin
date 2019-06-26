<template>
  <el-container>
    <el-aside width="200px"><AppAside/></el-aside>
    <el-container>
      <el-header><AppHeader/></el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
  <!-- <div>
    <AppAside/>
    <AppHeader/>
  </div> -->
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #d0dce7;
  }
  .el-header {
      background-color: #aec0d1;
  }
  .el-main {
      background-color: #e8eff4;
  }
</style>
