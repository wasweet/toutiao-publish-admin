<template>
	<div class="image-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>素材管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="text item add-images">
				<el-radio-group v-model="collect" @change="localGetImages(1)">
					<el-radio-button :label="false">全部</el-radio-button>
					<el-radio-button :label="true">收藏</el-radio-button>
				</el-radio-group>
				<el-button type="success" @click="dialogTableVisible = true">添加素材</el-button>
			</div>
			<!-- 上传图片 弹出框 -->
			<el-dialog title="上传素材" 
									:visible.sync="dialogTableVisible"
									:append-to-body="true"
									>
			  <el-upload
			    class="upload-demo"
			    drag
			    action="http://localhost:8081/mp/v1_0/user/images"
			    multiple
					name="image"
					:headers="uploadHeaders"
					:on-success="onSuccessLoad"
					>
			    <i class="el-icon-upload"></i>
			    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			  </el-upload>
			</el-dialog>
			<!-- /上传图片 弹出框 -->
			<!-- 素材列表 -->
			<el-row :gutter="10" >
				<el-col :xs="12" :sm="6" :md="6" :lg="4"
								v-for="(image,index) in images" 
								:key="index"
								class="images"
								>
					<el-image style="height: 150px;width: 150px;"
						:src="image.url" fit="cover">
					</el-image>
					<div class="collect-tab">
						<el-button :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" 
											 circle
											 size='mini'
											 :loading="image.loading"
											 @click="onCollect(image)"
											 ></el-button>
						<el-button icon="el-icon-delete" 
											 circle
											 size='mini'
											 :loading="image.loading"
											 @click="onDelete(image)"
											 ></el-button>
					</div>
				</el-col>
			</el-row>
			<!-- /素材列表 -->
			<!-- 列表分页 -->
			<!-- total 用来设定总数据的条数 默认是按照 10 条每页计算总页码
			 page-size 每页显示条目个数 默认是 10 条
			 -->
			<el-pagination layout="prev, pager, next" 
											:total="totalCount"
											:page-size="pageSize"
											:disabled="loading"
											:current-page.sync="page"
											@current-change="onCurrentChange"> 
			</el-pagination>
			<!-- /列表分页 -->
		</el-card>
	</div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/images'
export default {
	name: 'ImageIndex',
	components: {},
	props: {},
	data() {
		const user = JSON.parse(window.localStorage.getItem('user'))
		return {
			collect: false,  //默认 全部
			images: [],  //存储 图片 素材
			dialogTableVisible: false,
			uploadHeaders: {
				Authorization : `Bearer ${user.token}`
			},
			totalCount: 0, // 总数据条数
			pageSize: 10, // 每页显示的条目数
			page: 1 ,// 当前页码
			loading: true,  // 表格加载数据中 loading
		}
	},
	computed: {},
	watch: {},
	created() {
		// 获取图片素材
		this.localGetImages(1)
	},
	mounted() {},
	methods: {
		async localGetImages (page) {
			// 重置高亮页码，防止出现 页码 错误
			this.page = page
			// 开启加载 loading
			this.loading = true
			const res = await getImages ({
				collect: this.collect,
				page,
				per_page: this.pageSize
			}) 
			// <在 image 对象中添加 loading 数据 来控制每个收藏按钮的 loading 状态>
			const results = res.data.results
			results.forEach(image => {
				image.loading = false
			})
			//</在 image 对象中添加 loading 数据 来控制每个收藏按钮的 loading 状态>
			this.images = res.data.results
			// 获取总条数
			this.totalCount = res.data.total_count
			// 关闭加载 loading
			this.loading = false
		},
		onSuccessLoad () {
			// 上传成功 关闭弹出层
			this.$message({
				type:'success',
				message: '上传成功'
			})
			this.dialogTableVisible = false
			// 刷新页面
			this.localGetImages(1, false)
		},
		// 点击页码跳转到 当前页
		onCurrentChange (page) {
			this.localGetImages(page)
		},
		// 收藏或取消收藏
		async onCollect (image) {
			// loading 开启
			image.loading = true
			const res = await collectImage(image.id, !image.is_collected)
			// console.log(res)
			image.is_collected = !image.is_collected
			if (image.is_collected === true) {
				this.$message({
					type: 'success',
					message: '收藏成功'
				})
			} else {
				this.$message({
					message: '已取消收藏'
				})
			}
			// loading 结束
			image.loading = false
		},
		async onDelete (image) {
			// 开启 loading
			image.loading = true
			const res = await deleteImage(image.id)
			// 重新加载数据列表
			this.localGetImages(this.page)
			// 关闭 loading
			image.loading = false
		}
	}
}
</script>

<style scoped lang="less">
.add-images {
	display: flex;
	justify-content: space-between;
}
.images {
	margin-top: 10px;
	position: relative;
	.collect-tab {
		position: absolute;
		height: 30px;
		background-color: rgba(255,255,255,.5);
		top: 0;
		left: 5px;
		right: 14px;
		bottom: 0;
		margin-top: 120px;
		
		font-size: 20px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
}	

</style>
