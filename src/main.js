import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'
// 顶部进度条
import "nprogress/nprogress.css"

// 注册全局elementUI
Vue.use(ElementUI)

Vue.config.productionTip = false



// 通过 render 方法把 App 跟组件渲染到 #app 入口节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
