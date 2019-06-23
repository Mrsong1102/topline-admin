<template>
  <div class="login-wrap">
    <div class="login-form-worp">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 支持栅格布局,一共是24列 -->
            <el-col :span="14">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-button @click="handleSendCode">发送验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组建加class，会做用到他的根元素 -->
            <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt' // gt.js会向全局 window 暴露一个函数 initGeetest

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '18303610801',
        code: ''
      },
      captchaObj: null // 通过 initGeetest 得到极验验证码对象
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },

    handleSendCode () {
      const { mobile } = this.form

      // 如果已经初始化了，就直接 verify
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏按钮式
          },
          captchaObj => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj
              .onReady(function () {
                // 只有 ready 了才能显示验证码
                captchaObj.verify() // 显示验证码
              })
              .onSuccess(function () {
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()

                // 调用获取短信验证码 （极验 API2）接口，发送短信
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    // 专门用来传递 query 查询字符串参数
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  console.log(res.data)
                })
              })
          }
        )
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form-worp {
    background-color: #fff;
    padding: 50px;
  }
  .btn-login {
    width: 100%;
  }
  .login-head {
    display: flex;
    justify-content: center;
    img {
      width: 150px;
      height: 35px;
      margin-bottom: 15px;
      margin-top: -15px;
    }
  }
}
</style>
