<template>
	<div class="article-container">
		<el-card class="top-card">
			<div slot="header" class="clearfix">
				<!-- 面包屑路径导航 -->
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>内容管理</el-breadcrumb-item>
				</el-breadcrumb>
				<!-- /面包屑路径导航 -->
			</div>
			<div class="text item">
				<!-- 数据筛选表单 -->
				<el-form ref="form" :model="form" label-width="80px" size="mini">
					<el-form-item label="状态">
						<el-radio-group v-model="status">
							<el-radio :label="null">全部</el-radio>
							<el-radio :label="0">草稿</el-radio>
							<el-radio :label="1">待审核</el-radio>
							<el-radio :label="2">审核通过</el-radio>
							<el-radio :label="3">审核失败</el-radio>
							<el-radio :label="4">已删除</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="频道">
						<el-select v-model="channelsId" placeholder="请选择频道">
							<el-option label="全部" :value="null"></el-option>
							<el-option :label="item.name" :value="item.id" v-for="(item,index) in channels"
								:key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="日期">
						<el-date-picker v-model="rangeDate" type="daterange" range-separator="至"
							start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
							value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="localArticles(1)" :disabled="loading">查询</el-button>
					</el-form-item>
				</el-form>
				<!-- /数据筛选表单 -->
			</div>
		</el-card>

		<el-card class="main-card">
			<div slot="header" class="clearfix">
				<span>根据筛选条件共查询到 {{totalCount}} 条结果：</span>
			</div>
			<!-- 数据列表 -->
			<el-table :data="articlesInfo" style="width: 100%" size="mini" class="list-table" v-loading="loading">
				<el-table-column prop="date" label="封面" width="180">
					<template slot-scope="scope">
						<el-image style="width: 80px; height: 80px" :src="scope.row.cover.images[0]" fit="cover" lazy>
							<div slot="placeholder" class="image-slot">
								加载中<span class="dot">...</span>
							</div>
						</el-image>
						<!-- <img v-if="scope.row.cover.images[0]" 
								 :src="scope.row.cover.images[0]"
									class="article-cover"
								 alt="">
						<img v-else src="./no-cover.webp" alt=""> -->
					</template>
				</el-table-column>
				<el-table-column prop="title" label="标题" width="180">
				</el-table-column>
				<el-table-column label="状态" width="180">
					<template slot-scope="scope">
						<el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}
						</el-tag>
						<!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
						<el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
						<el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
						<el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
						<el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
					</template>
				</el-table-column>
				</el-table-column>
				<el-table-column prop="pubdate" label="发布时间">
				</el-table-column>
				<el-table-column prop="address" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" circle icon="el-icon-edit" type="primary"
												@click="$router.push('/publish?id=' + scope.row.id)"></el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" circle
												@click="onDelArticles(scope.row.id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- /数据列表 -->

			<!-- 列表分页 -->
			<!-- total 用来设定总数据的条数 默认是按照 10 条每页计算总页码
			 page-size 每页显示条目个数 默认是 10 条
			 -->
			<el-pagination layout="prev, pager, next" 
											:total="totalCount" 
											:page-size="pageSize"
											:disabled="loading"
											:current-page="page"
											@current-change="onCurrentChange">
			</el-pagination>
			<!-- /列表分页 -->
		</el-card>
	</div>
</template>

<script>
	import {
		getArticles,
		getArticlesChannels,
		delArticles
	} from '@/api/article'
	export default {
		name: 'ArticleIndex',
		components: {},
		props: {},
		data() {
			return {
				form: {
					name: '',
					region: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				articlesInfo: [], //内容管理 文章数据
				articleStatus: [{ //文章状态 封装
						status: 0,
						text: '草稿',
						type: 'info'
					}, // 0
					{
						status: 1,
						text: '待审核',
						type: ''
					}, // 1
					{
						status: 2,
						text: '审核通过',
						type: 'success'
					}, // 2
					{
						status: 3,
						text: '审核失败',
						type: 'warning'
					}, // 3
					{
						status: 4,
						text: '已删除',
						type: 'danger'
					} // 4
				],
				totalCount: 0, // 总数据条数
				pageSize: 10, // 每页显示的条目数
				status: null, // 筛选 状态选择
				channels: [], // 频道
				channelsId: null, // 筛选 频道
				rangeDate: [], // 筛选 范围日期
				loading: true, //表格加载数据中 loading
				page: 1 //当前页码
			}
		},
		computed: {},
		watch: {},
		created() {
			// 获取文章列表 默认第一页
			this.localArticles(1),
			// 获取频道信息
			this.locaArticlesChannels()
		},
		mounted() {},
		methods: {
			// 获取文章列表
			async localArticles(page = 1) {
				// 开启加载 loading
				this.loading = true
				const res = await getArticles({
					page,
					per_page: this.pageSize,
					status: this.status,
					channel_id: this.channelsId,
					begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
					end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束日期
				})
				const {
					results,
					total_count: totalCount
				} = res.data.data //对象解构  驼峰命名法
				// console.log(res)
				// this.articlesInfo = res.data.data.results
				this.articlesInfo = results
				this.totalCount = totalCount

				// 关闭加载 loading
				this.loading = false
			},
			// 分页
			onCurrentChange(page) {
				this.localArticles(page)
			},
			// 获取频道信息
			async locaArticlesChannels() {
				const res = await getArticlesChannels()
				// console.log(res)
				this.channels = res.data.data.channels
			},
			// 删除文章
			onDelArticles (articleId) {
				// console.log(articleId)
				this.$confirm('是否删除此文章?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 删除操作
					delArticles(articleId.toString()).then(res => {
						// console.log(articleId)
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
						this.localArticles(this.page)
					})
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.top-card {
		margin-bottom: 20px;
	}

	.list-table {
		margin-bottom: 20px;
	}

	.article-cover {
		width: 60px;
	}
</style>
