import Vue from 'vue'
import VueRouter from 'vue-router'
// 顶部进度条
import NProgress from 'nprogress'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
	  path: '/login',
		name: 'login',
	  component: () => import('@/views/login')
  },
	{
		path: '/',
		component: () => import('@/views/layout'),
		children: [ 
			{
				path: '', // path 为空，会作为默认子路由
				name: 'home',
				component: () => import('@/views/home')
			},
			{
				path: '/article',
				name: 'article',
				component: () => import('@/views/article')
			},
			{
				path: '/publish',
				name: 'publish',
				component: () => import('@/views/publish')
			}
		]
	}
]

const router = new VueRouter({
  routes
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
	// 开启顶部进度条
	NProgress.start()
	
  const user = JSON.parse(window.localStorage.getItem('user'))
	
	// 校验非登录页面的登录状态
	if (to.path !== '/login') {
		if (user) {
			// 已通过，允许登陆
			next()
		} else {
			// 没有登陆，返回登陆界面
			next('/login')
		}
	} else {
		// 登录页面，正常允许通过
		  next()
	}
})
router.afterEach((to, from) => {
  // 结束顶部的导航进度条
  NProgress.done();
});

export default router
