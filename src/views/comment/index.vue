<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<!-- 面包屑路径导航 -->
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>评论管理</el-breadcrumb-item>
				</el-breadcrumb>
				<!-- /面包屑路径导航 -->
			</div>
			<el-table :data="articles" style="width: 100%">
				<el-table-column prop="title" label="标题" >
				</el-table-column>
				<el-table-column prop="total_comment_count" label="总评论数" >
				</el-table-column>
				<el-table-column prop="fans_comment_count" label="粉丝评论数"> </el-table-column>
				<el-table-column label="状态"> 
				<template slot-scope="scope">
					{{scope.row.comment_status ? '开启': '关闭'}}
				</template>
				</el-table-column>
				<el-table-column prop="address" label="操作"> 
					<template slot-scope="scope">
						<!-- 开关组件绑定的数据是一个布尔值，它会根据布尔值的真假来决定开关状态 -->
						<el-switch
							v-model="scope.row.comment_status"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:disabled= 'scope.row.loading'
							@change="onChangeStatus(scope.row)"
						>
						</el-switch>
					</template>
				</el-table-column>
			</el-table>
			<!-- size-change 每页条数   current-change  当前页-->
			<el-pagination
						class="comment-pagination"
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page.sync="page"
			      :page-sizes="[5, 10, 20, 50]"
			      :page-size="pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="totalCount">
			    </el-pagination>
		</el-card>
	</div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
	export default {
		name: "CommentIndex",
		components: {},
		props: {},
		data() {
			return {
				articles: [],  //文章列表
				pageSize: 5 , // 默认每页十条数据
				page: 1  ,// 默认第一页
				totalCount: 0 // 总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.loadGetAtricles(1)
		},
		methods: {
			handleSizeChange(pageSize) {
				this.pageSize = pageSize
				this.loadGetAtricles(1)
			},
			handleCurrentChange(page) {
			  this.loadGetAtricles(page)
			},
			async loadGetAtricles (page = 1) {
				this.page = page
				const res = await getArticles({
					response_type: 'comment',
					page,
					per_page: this.pageSize
				})
				// <在 article 对象中添加 loading 数据 来控制每个操作按钮的 loading 状态>
				const {results} = res.data.data
				results.forEach(article => {
					article.loading = false
				})
				// <在 /article 对象中添加 loading 数据 来控制每个操作按钮的 loading 状态>
				 // console.log(res)
				this.articles = res.data.data.results
				this.totalCount = res.data.data.total_count
			},
			//修改 评论状态
			async onChangeStatus (article) {
				// loading 开启
				article.loading = true
				// console.log(article)
				const res = await updateCommentStatus(article.id.toString(), article.comment_status)
				// 关闭 loading
				article.loading = false
				this.$message({
					type: 'success',
					message: article.comment_status ? '已开启评论' : '已关闭评论'
				})
			}
			
		}
	};
</script>

<style scoped lang="less">
.comment-pagination {
	margin-top: 30px;
}
</style>
