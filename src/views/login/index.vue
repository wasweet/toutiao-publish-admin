<template>
	<div class="login-container">
		<div class="login-form-wrap">
			<div class="login-head">
				<div class="logo">后台管理系统</div>
			</div>
			<el-form class="login-form" ref="user" :model="user" :rules="formRules">
				<el-form-item prop="mobile" class="login-form-mobile">
					<i class="el-icon-user-solid icon-user"></i>
					<el-input v-model="user.mobile" 
										placeholder="请输入手机号"
										class="field"
										>
										</el-input>
				</el-form-item>
				<el-form-item prop="code" class="login-form-mobile">
					<i class="el-icon-mobile-phone icon-user"></i>
					<el-input v-model="user.code" 
										placeholder="请输入验证码"
										class="field"
										></el-input>
				</el-form-item>
				<el-form-item prop="agree">
					<el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button class="login-btn" 
										type="primary" 
										:loading="onloading" 
										@click="onLogin">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>


<script>
import { login } from '@/api/user'
	export default {
		name: 'LoginIndex',
		components: {},
		props: {},
		data() {
			return {
				user: {
					mobile: '13911111111', // 手机号
					code: '246810', // 验证码
					agree: false // 是否同意协议
				},
				onloading: false, // 登陆中加载

				formRules: { // 表单验证规则属性
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							pattern: /^1[3|5|7|8|9]\d{9}$/,
							message: '请输入正确的号码格式',
							trigger: 'blur'
						}
					],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: 'blur'
						},
						{
							pattern: /^\d{6}$/,
							message: '验证码错误',
							trigger: 'blur'
						}
					],
					agree: [{
						validator: (rule, value, callback) => {
							if (value) {
								callback()
							} else {
								callback(new Error('请同意用户协议'))
							}
						},
						trigger: 'change'
					}]
				}
			}
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {
		},
		methods: {
			onLogin() {
				// 获取表单数据（根据接口要求绑定数据）
				// const user = this.user

				// 表单验证
				//validate 方法是异步的
				 this.$refs['user'].validate(valid => {
					// 如果表单验证失败，停止提交
					if (!valid) {
						return 
					}
					// 验证通过，请求登陆
					this.login()
				})
				
			},
			async login () {
			      // 开启登陆中 loading...
			      this.loginLoading = true
			      // 对于代码中的请求操作
			      // 1.接口请求可能需要重用
			      // 2.实际工作中，接口非常容易变动，改起来麻烦
			      // 建议的做法是把所有的请求都封装成函数然后统一组织到模块
			      // 这样做的好处是：管理维护更方便，也好重用
			     const res = await login(this.user)
					 
					 // console.log(res)
					 try {
						 // 登录成功
						 this.$message({
						   message: '登录成功',
						   type: 'success'
						 })
						 			
						 // 关闭 loading
						 this.loginLoading = false
						 
						 // 将登录用户信息对象转成json字符串并写入本地存储
						 window.localStorage.setItem('user', JSON.stringify(res.data.data))
						 // 登录成功，跳转到首页
						 // this.$router.push('/')
						 this.$router.push({
						   name: 'home'
						 })
					 }	catch (err) {
						 // console.log('登录失败', err)
						 this.$message.error('登录失败，手机号或验证码错误')
						 			
						 // 关闭 loading
						 this.loginLoading = false
					 }		
					 
			    }
		}
	}
</script>

<style scoped lang="less">

	.login-container {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: url('./login_bg.jpeg') no-repeat;
		background-size: cover;
		
		.login-form-mobile {
			position: relative;
			.icon-user {
				position: absolute;
				top: -9px;
				bottom: 0;
				left: 0;
				margin-bottom: 5px;
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #999;
			}
		}
		.login-form-wrap {
			padding: 30px 50px 30px;
			background-color: #fff;
			min-width: 300px;

			.login-head {
				.logo {
					display: flex;
					justify-content: center;
					margin-bottom: 20px;
					font-size: 30px;
				}
			}

			.login-btn {
				width: 100%;
			}
		}
		.field {
			overflow: hidden;
		}
		.field::before {
		        content: '';
		        position: absolute;
		        left: 0;
		        height: 2px;
		        bottom: 0;
		        width: 100%;
		        background: linear-gradient(to right, white, #1abc9c, #f1c40f, #e74c3c, white);
		        transform: translateX(-100%);
		        transition: 2s;
		    }
		.field:hover::before {
		        transform: translateX(100%);
		    }
	}
</style>
