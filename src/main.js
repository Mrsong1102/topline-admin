import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from './store'

// 优先查找文件，如果文件找不到则查找目录
// 找到目录优先加载目录中的index.js

import router from './router/index'

import './styles/index.less'

import 'nprogress/nprogress.css'

// 配置 axios 的基础路由
// 也就是说配置了这个东西，你就不用每次都写长长的 http://xxxx
// 路径中的 / 多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 使用JSONbig处理返回数据中超出JavaScript安全整数范围的数字
// JSONbig自己会分析数据中的那个数字超出范围了
// 由于后端的数据id超出了JavaScript的安全整数范围，会导致整数无法精确表示
// 可以试用 json-bigint 来处理，他会帮你把超出范围的数字处理好
axios.defaults.transformResponse = [function (data) {
  // data 是未经处理的后端相应数据：JSON格式字符串
  // return JSONbig.parse(data)
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data)转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接返回原样
    return data
  }
}]

/**
 * axios 请求拦截器
 * 所有使用 axios 发起的请求都要先经过这里
 * config 是本次请求相关的配置对象
 * 我们可以通过修改 config 配置来统一定义请求相关的参数
 * return config 就是允许通过的方式
 */

axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))

  // 如果登录了，才给那些需要 token 的接口同意添加 token 令牌
  // 登录相关接口不需要添加 token 令牌
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

/**
 * axios 响应拦截器
 * 统一处理响应的数据格式
 */

axios.interceptors.response.use(response => { // >= 200 && < 400 的状态码进入这里
  // console.log('response => ', response)
  // 将响应数据处理成统一的数据格式方便使用

  // 如果返回的数据格式是对象
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >=400 的状态码进入这里
  const status = error.response.status
  if (status === 401) {
    // 务必删除本地存储中的用户信息数据
    window.localStorage.removeItem('user_info')
    // 跳转到登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

// 几乎每个组件都要使用 axios 去发请求，频繁的 import 就变得非常麻烦
// 我们可以将一些频繁使用的成员放到 Vue.prototype 中，然后就可以在组建中直接 this.xxx 使用了
// ？因为所用的组件都是 Vue 的实例
// 所以往 Vue.prototype 中添加的成员可以直接通过组件实例 this 进行访问

// 往Vue原型对象中添加成员，尽量使用 $ 名字 起名字 ，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
