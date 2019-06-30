<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form>
          <el-form-item label="媒体名称">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input v-model="userInfo.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号ID">
            <el-input disabled :value="userInfo.id && userInfo.id.toString()"></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input disabled :value="userInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdate">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="4"></el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AccountSetting',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.loadUserInfo()
  },

  methods: {
    loadUserInfo () {
      this.$http({
        methos: 'GET',
        url: '/user/profile'
      }).then(data => {
        this.userInfo = data
      })
    },

    handleUpdate () {
      const {name, intro, email } = this.userInfo
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name,
          intro,
          email
        }
      }).then(() => {
        this.message({
          type: 'success',
          message: '更新用户信息成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新用户信息失败！')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
