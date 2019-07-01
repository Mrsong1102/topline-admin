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
      <el-col :offset="2" :span="4">
        <!--
          el-upload 上传组件，他会自动将用户选择的图片去请求上传，我们需要做的就是配置一下
            action 请求地址
            由于他用的自己内部的请求，不是使用的axios 去发请求
              完整路径
              它的请求也不会经过 axios 拦截器，所以需要手动配置 token
              不支持自定义请求方法
         -->
        <!-- <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :headers="{ Authorization: token }"
          name="photo"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img class="avatar" v-if="userInfo.photo" :src="userInfo.photo">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUpdate">
          <img class="avatar" v-if="userInfo.photo" :src="userInfo.photo">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AccountSetting',
  data () {
    return {
      userInfo: {},
      token: `Bearer ${JSON.parse(window.localStorage.getItem('user_info')).token}`
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
      const { name, intro, email } = this.userInfo
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
    },

    handleAvatarSuccess () {},
    beforeAvatarUpload () {},
    handleUpload (UploadConfig) {
      // axios 上传文件
      // 1.构建一个 FormData 表单对象
      // 将文件对象添加到 FormData 中
      // 2.将 FormData 配置到请求体 data 选项中
      const formData = new FormData()
      formData.append('photo', UploadConfig.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: formData
        // data: {
        //   photo: 文件对象
        // }
      }).then(data => {
        this.userInfo.photo = data.photo
        this.$message({
          type: 'success',
          message: '上传头像成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('上传头像失败！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
