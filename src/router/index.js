import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
  // {
  //   // 路由的名字,和组件名没关系，就是path的别名
  //   // 好处就是，假如你的path 是 /x/x/x/x，跳转的方式
  //   // $router.push('/x/x/x/x')
  //   // $router.push({ name: 'xxx' })
  //   name: 'home',
  //   path: '/',
  //   component: () => import('@/views/home')// @表示src 目录，无论当前文件在哪里，@都是src
  // },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有的 children 路由都显示到父路由的 router-view 中
        {
          name: 'home',
          path: '', // 他就是 layout 的默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish', // 他就是 layout 的默认子路由
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
