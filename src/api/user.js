/**
 * 用户请求模块
 */

import request from '@/utils/request'

export const login = (data) => {
	return request({
		 method: 'POST',
		    url: '/mp/v1_0/authorizations',
		// data 用来设置 POST 请求体
		// data = data 的ES6简写模式
		data
	})
}

// 请求用户信息
export const getUserProfile = () => {
	// const user =JSON.parse(window.localStorage.getItem('user')) 
	return request({
		method: 'GET',
		url: '/mp/v1_0/user/profile'
		// 后端要求把需要授权的用户身份放到请求头中
		// axios 可以通过 headers 选项设置请求头
		// headers: {
		// 	// 属性名 属性值  看接口
		// 	Authorization: `Bearer ${user.token}`  //es6 反引号拼接
		//}
	})
}

// 编辑用户资料
export const uploadUserInfo = (data) => {
	return request({
		method: 'PATCH',
		url: '/mp/v1_0/user/profile',
		data
	})
}

// 编辑用户 头像
export const uploadUserImg = data => {
	return request({
		method: 'PATCH',
		url:'/mp/v1_0/user/photo',
		data
	})
}