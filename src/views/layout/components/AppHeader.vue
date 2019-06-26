<template>
  <el-row class="app-header">
    <el-col :span="14">北京赫特马勒科技股份有限公司</el-col>
    <el-col :span="10">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30" src="http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi">18303610801<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>账户设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style lang="less" scoped>
  .app-header {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  img {
      border-radius: 50%
  }
</style>
