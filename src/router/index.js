import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
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
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有的 children 路由都显示到父路由的 router-view 中
        {
          name: 'home',
          path: '', // 他就是 layout 的默认子路由
          component: () => import('@/views/home')
        },
        { // 发布文章
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        { // 编辑文章
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'article-comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        { // 账户设置
          name: 'account-setting',
          path: '/account',
          component: () => import('@/views/account')
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

/**
 * to 去哪
 * form 来自哪里
 * next 允许通过的方法
 * 渲染路由之前先经过下边代码
*/
router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')

  // 如果是非 /login 页面，判断其登录状态
  if (to.path !== '/login') {
    // 如果没有登录，让其跳转到登录页
    if (!userInfo) {
      return next({ name: 'login' })
    } else {
      // 如果登录了，则允许通过
      next()
    }
  } else {
    // 如果登录了，就不允许访问登录页面了
    if (userInfo) {
      next(false)
    } else {
      // 没有登录,才允许访问登录页
      next()
    }
  }
})

/**
 * 路由导航完成的时候进入这里
 */
router.afterEach((to, from) => {
  nprogress.done()
})

export default router
