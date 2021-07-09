<template>
	<div class="publish-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<!-- 面包屑路径导航 -->
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>{{ $route.query.id? '修改文章' : '发布文章'}}</el-breadcrumb-item>
				</el-breadcrumb>
				<!-- /面包屑路径导航 -->
			</div>
			<div class="text item">
				<!-- 表单 -->
				<el-form :model="article" ref="article" label-width="100px" class="article-from">
					<el-form-item label="标题" prop="title">
						<el-input v-model="article.title"></el-input>
					</el-form-item>
					<el-form-item label="内容">
						<el-input type="textarea" v-model="article.content"></el-input>
					</el-form-item>

					<el-form-item label="封面" prop="type">
						<el-radio-group v-model="article.cover.type">
							<el-radio :label="0">无图</el-radio>
							<el-radio :label="1">单图</el-radio>
							<el-radio :label="3">三图</el-radio>
							<el-radio :label="-1">自动</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="频道">
						<el-select v-model="article.channel_id" placeholder="请选择频道">
							<el-option :label="channel.name" :value="channel.id" v-for="(channel,index) in channels"
								:key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onPublish(false)">{{$route.query.id? '修改' : '发布'}}</el-button>
						<el-button @click="onPublish(true)">存为草稿</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {
		getArticlesChannels,
		addArticles, //发布
		getArticle, //获取指定文章
		updateArticle //编辑文章
	} from '@/api/article'

	export default {
		name: 'PublishIndex',
		components: {},
		props: {},
		data() {
			return {
				article: {
					title: '', //文章标题
					content: '', //文章内容
					cover: { //封面
						type: 0, //类型
						images: [] // 封面图片的地址
					},
					// channel_id: null //频道 id
				},
				channels: [] //频道列表
			}
		},
		computed: {},
		watch: {},
		created() {
			// 加载频道
			this.localGetChannel()

			// 如果 有id参数 则展示文章信息 （编辑）
			if (this.$route.query.id) {
				this.localArticle()
			}
		},
		mounted() {},
		methods: {
			// 获取频道 id
			async localGetChannel() {
				const res = await getArticlesChannels()
				// console.log(res)
				this.channels = res.data.data.channels
			},
			onPublish(draft = false) {
				// 修改
				const articleId = this.$route.query.id
				if (articleId) {
					updateArticle(articleId, this.article, draft).then(res => {
						console.log(res)
						this.$message({
							message: `${draft ? '存入草稿' : '修改'}成功`,
							type: 'success'
						})
						// 跳转到内容管理页面
						this.$router.push('/article')
					})
				} else {
					// 发布
					addArticles(this.article, draft).then(res => {
						// 处理响应结果
						// console.log(res)
						this.$message({
							message: `${draft ? '保存' : '发布'}成功`,
							type: 'success'
						})
						// 跳转到内容管理页面
						this.$router.push('/article')
					})
				}
			},
			// 展示文章信息
			async localArticle() {
				const res = await getArticle(this.$route.query.id)
				// console.log(res)
				this.article = res.data.data
			}
		}
	}
</script>

<style scoped lang="less"></style>
