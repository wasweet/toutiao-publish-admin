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
				<el-form 
					:model="article" 
					ref="article-form" 
					label-width="100px" 
					class="article-from"
					:rules="formRules"
					>
					<el-form-item label="标题" prop="title">
						<el-input v-model="article.title"></el-input>
					</el-form-item>
					<el-form-item label="内容" prop="content">
						<!-- <el-input type="textarea" v-model="article.content"></el-input> -->
						 <el-tiptap
						      v-model="article.content"
						      :extensions="extensions"
									placeholder="请输入内容"
						    />
					</el-form-item>

					<el-form-item label="封面" prop="type">
						<el-radio-group v-model="article.cover.type">
							<el-radio :label="0">无图</el-radio>
							<el-radio :label="1">单图</el-radio>
							<el-radio :label="3">三图</el-radio>
							<el-radio :label="-1">自动</el-radio>
						</el-radio-group>
						<template v-if="article.cover.type > 0">
						<!-- v-modal=""    等于下面写法
										:vaule="" +  @input=""
						 -->
							<UploadCover v-for="(cover,index) in article.cover.type" 
													 :key="index"
													 v-model="article.cover.images[index]"
													 ></UploadCover>
							<!-- <UploadCover v-for="(cover,index) in article.cover.type"
													 :key="index"
													 :upload-cover="article.cover.images[index]"
													 @upload-img="onUpdateImg(index, $event)"
													 ></UploadCover> -->
						</template>
					</el-form-item>
					<el-form-item label="频道" prop="channel_id">
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
import { uploadImage } from '@/api/images'
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock
} from 'element-tiptap'
import UploadCover from './components/upload-cover.vue'
	export default {
		name: 'PublishIndex',
		components: {
			UploadCover
		},
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
					// channel_id: null
				},
				channels: [], //频道列表
				// 编辑器的 extensions
				// 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
				 extensions: [
				   new Doc(),
				   new Text(),
				   new Paragraph(),
				   new Heading({ level: 3 }),
				   new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
				   new Image({//图片
					 // 将本地图片 转为 在线地址    (有问题 未解决)
						 uploadRequest (file) {
							 // console.log(file)
							 const fd = new FormData()
							 fd.append('image', file)
							 return uploadImage(fd).then(res => {
								 // console.log(res)
								  return res.data.data.url
							 })
						 }
					 }), 
				   new Underline(), // 下划线
				   new Italic(), // 斜体
				   new Strike(), // 删除线
				   new HorizontalRule(), // 华丽的分割线
				   new ListItem(),
				   new BulletList(), // 无序列表
				   new OrderedList(), // 有序列表
				   new TodoItem(),
				   new TodoList(),
				   new Fullscreen(),
				   new Preview(),
				   new CodeBlock()
				 ],
				 formRules: {
					 title: [
					 	 { required: true, message: '请输入文章标题', trigger: "blur" },
						 { min: 3, max: 30, message: '长度必须子啊5到30个字符', trigger: 'blur' }
					 ],
					 content: [
						 {
							 validator (rule, value, callback) {
								 if (value === '<p></p>') {
									 callback(new Error('请输入文章内容'))
								 } else {
									 callback()
								 }
							 }
						 },
						 { required: true, message: '请输入文章内容', trigger: 'blur' }
					 ],
					 channel_id: [
					 	 { required: true, message: '请选择频道',trigger: 'blur' }
					 ]
				 }
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
				// 表单验证
				this.$refs['article-form'].validate((valid) => {
					if (!valid) {
						return
					}
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
				})
				
			},
			// 展示文章信息
			async localArticle() {
				const res = await getArticle(this.$route.query.id)
				// console.log(res)
				this.article = res.data.data
			},
			// 接收子组件传来的图片地址
			onUpdateImg (index, url) {
				// console.log(index,url)
				this.article.cover.images[index] = url
			}
		}
	}
</script>

<style scoped lang="less">
</style>
