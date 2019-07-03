<template>
  <el-row class="app-header">
    <el-col :span="14">北京赫特马勒科技股份有限公司</el-col>
    <el-col :span="10">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30" :src="$store.state.user.photo">{{ $store.state.user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="account" style="color:#606266">账户设置
              </router-link>
              </el-dropdown-item>

            <!--
              给组件注册原生事件：@原生事件类型.native="处理函数"
              .native 修饰符：https://cn.vuejs.org/v2/guide/components-custom-events.html#%E5%B0%86%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BB%84%E4%BB%B6
              该事件会被注册给组建的根组件
             -->

            <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
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
      // userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  },

  methods: {
    handleLogout () {
      this.$confirm('确认退出么,是否继续?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储中的 用户信息 user_info
        window.localStorage.removeItem('user_info')

        this.$message({
          type: 'success',
          message: '退出成功!'
        })

        // 跳转到登录页面
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
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
