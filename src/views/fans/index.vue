<template>
	<div class="fans-container">
	    <el-card class="box-card">
	      <div slot="header" class="clearfix">
	        <el-breadcrumb separator="/">
	          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
	          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	      <el-tabs type="border-card" @tab-click="onFansTabClick">
	        <el-tab-pane label="粉丝列表">
	          <div style="margin-bottom: 20px;">
	            <el-row :gutter="20">
	              <el-col
	                :xs="12"
	                :sm="8"
	                :md="6"
	                :lg="4"
	                :xl="2"
	                v-for="(fan, index) in fans"
	                :key="index"
	              >
	                <div class="fans-list">
	                  <el-avatar class="fans-img" :src="fan.photo"></el-avatar>
	                  <p>{{ fan.name }}</p>
	                  <el-tag
	                    :type="fan.followed ? 'danger':'primary'"
	                    @click="onFollow(fan.id)"
	                  >{{ fan.followed ? '取消关注' : '+关注' }}
	                  </el-tag>
	                </div>
	              </el-col>
	            </el-row>
	          </div>
	          <el-pagination
	            background
	            layout="prev, pager, next"
	            :total="totalCount"
	            :disabled="loading"
	            :current-page.sync="page"
	            @current-change="onFansCurrentChange"
	          />
	        </el-tab-pane>
	        <el-tab-pane label="粉丝画像">
	          <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
	          <!-- <div ref="main" style="width: 600px;height:400px;"></div> -->
	        </el-tab-pane>
	      </el-tabs>
	    </el-card>
	  </div>
</template>

<script>
import { follow, queryFollowers } from '@/api/fans'
export default {
	name: 'fansIndex',
	components:{},
	props:{},
	data() {
		return {
			page: 1,
			perPage: 10,
			totalCount: 0,
			fans: [],
			loading: false
		}
	},
	created() {
		this.loadFollowers()
	},
	mounted() {
		
	},
	methods:{
		// 粉丝列表
		    loadFollowers (page = 1) {
		      this.page = page
		      this.loading = true
		      queryFollowers({
		        page,
		        per_page: this.perPage
		      }).then(res => {
		        const {
		          results,
		          total_count: totalCount
		        } = res.data.data
		        this.fans = results
		        this.totalCount = totalCount
		        this.loading = false
		      })
		    },

				// 切换当前页码
				    onFansCurrentChange (page) {
				      this.loadFollowers(page)
				    },
		// 关注
		    // onFollow (fansId) {
		    //   follow(fansId).then(res => {
		    //     this.$message({
		    //       type: 'success',
		    //       message: '操作成功'
		    //     })
		    //     this.loadFollowers(this.page)
		    //   })
		    // },
		  onFansTabClick () {
		       console.log('onFansTabClick')
		     },
	}
}
</script>

<style scoped lang="less">
.fans-list {
	border: 1px dotted #ccc;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	margin-bottom: 10px;
	.fans-img {
		border: 1px solid #ccc;
	}
}

</style>
