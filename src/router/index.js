import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 路由的名字,和组件名没关系，就是path的别名
      // 好处就是，假如你的path 是 /x/x/x/x，跳转的方式
      // $router.push('/x/x/x/x')
      // $router.push({ name: 'xxx' })
      name: 'home',
      path: '/',
      component: () => import('@/views/home')// @表示src 目录，无论当前文件在哪里，@都是src
    },
    {
      name: 'layout',
      path: '/layout',
      component: () => import('@/views/layout')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
