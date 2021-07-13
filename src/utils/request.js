/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

// 创建一个 axios 实例
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
	baseURL: 'http://localhost:8081/',
	
	// 参数 data 是后端原始数据
	transformResponse: [function (data) {
	    // console.log(data)
	
	    // 后端返回的数据可能不是 JSON 格式字符串
	    // 如果不是的话，那么 JSONbig.parse 调用就会报错
	    // 所以使用 try-catch 来捕获异常，处理异常的发生
	    try {
	      // 如果转换成功，则直接把结果返回
	      return JSONbig.parse(data)
	    } catch (err) {
	      console.log('转换失败,数据原封不动的直接返回', err)
	      // 如果转换失败了，则进入这里
	      // 在这里把数据原封不动的直接返回给请求使用
	      return data
	    }
	  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
	// 任何请求都会经过这里
	// 统一设置 token
	const user = JSON.parse(window.localStorage.getItem('user')) 
	
	// 如果有 用户信息 则设置token
	if (user) {
		config.headers.Authorization = `Bearer ${user.token}`
	}
	
	// rerurn 真正发出去
    return config;
  }, function (error) {  		// 请求失败 经过这里
    return Promise.reject(error);
  });
// 响应拦截器
request.interceptors.response.use(function (response) {
	return response
},function (error) {
	if (error.response && error.response.status === 401) {
		// 跳转到登陆页面
		// 清除本地存储中的用户登陆状态
		window.localStorage.removeItem('user')
		router.push('/login')
	}
})

// 导出请求方法
export default request

