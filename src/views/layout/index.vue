<template>
  <el-container class="layout-container">
    <el-aside width="auto" 
							class="aside"
							>
  		<AppAside 
			:is-collapse="isCollapse"
			/>
  	</el-aside>
  	<el-container >
  	  <el-header class="header">
				<div class="header-container">
					<div class="header-title">
						<i :class="{
							'el-icon-s-fold': isCollapse,
							 'el-icon-s-unfold': !isCollapse
						}"
						@click="isCollapse = !isCollapse"></i>
						<span>WASWEAT后台管理系统</span>
					</div>
					<el-dropdown>
						<div class="avatar-wrap">
							<img class="avatar" :src="userInfo.photo" alt="">
							<span>{{ userInfo.name }}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-plus">设置</el-dropdown-item>
							<el-dropdown-item icon="el-icon-plus" @click.native="onLogout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
  		</el-header>
  	    <el-main class="main">
  				<!-- 子路由出口 -->
  				<router-view />
  			</el-main>
  	  </el-container>
  	</el-container>
</template>

<script>
import AppAside from './components/aside'
// import Header from './components/header'
import { getUserProfile } from '@/api/user'
	
export default {
  name: 'LayoutIndex',
  components: {
		AppAside,
		// Header
	},
  props: {},
  data () {
    return {
			userInfo: [], // 用户登陆信息
			isCollapse: false  //侧边栏默认不隐藏
			
		}
  },
  computed: {},
  watch: {},
  created () {
		// 组件初始化好，请求用户详细信息资料
		this.localUserProfile()
	},
  mounted () {},
  methods: {
		localUserProfile () {
			getUserProfile().then(res => {
				this.userInfo = res.data.data
				// console.log(this.userInfo)
			})
		},
		onLogout () {
		  this.$confirm('确认退出吗？', '退出提示', {
		    confirmButtonText: '确定',
		    cancelButtonText: '取消',
		    type: 'warning'
		  }).then(() => {
		    // 把用户的登录状态清除
		    window.localStorage.removeItem('user')
		
		    // 跳转到登录页面
		    this.$router.push('/login')
		  }).catch(() => {
		    this.$message({
		      type: 'info',
		      message: '已取消退出'
		    })
		  })
		}

	}
}
</script>

<style scoped lang="less">
	.layout-container {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.header-container {
	  width: 100%;
	  height: 100%;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border-bottom: 1px solid #ccc;
		.header-title {
			i {
				font-size: 20px;
			}
		}
	  .avatar-wrap {
	    display: flex;
	    align-items: center;
	    .avatar {
	      width: 30px;
	      height: 30px;
	      border-radius: 50%;
	      margin-right: 10px;
	    }
	  }
	}
	.aside {
		 background-color: #d3dce6;
	}
	
	.header {
	  background-color: #b3c0d1;
	}
	
	.main {
	  background-color: #e9eef3;
	}
</style>