<template>
	<div>
		<div class="text item add-images">
			<el-radio-group v-model="collect" @change="localGetImages(1)">
				<el-radio-button :label="false">全部</el-radio-button>
				<el-radio-button :label="true">收藏</el-radio-button>
			</el-radio-group>
			<el-button 
				type="success" 
				@click="dialogTableVisible = true"
				v-if="isAddImage"
				>添加素材</el-button>
		</div>
		<!-- 上传图片 弹出框 -->
		<el-dialog title="上传素材" :visible.sync="dialogTableVisible" :append-to-body="true">
			<el-upload class="upload-demo" drag action="http://localhost:8081/mp/v1_0/user/images" multiple name="image"
				:headers="uploadHeaders" :on-success="onSuccessLoad">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-dialog>
		<!-- /上传图片 弹出框 -->
		<!-- 素材列表 -->
		<el-row :gutter="10">
			<el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(image,index) in images" :key="index" class="images">
				<el-image 
					style="height: 150px;width: 150px;" 
					class="el-image"
					:src="image.url"
					fit="fill"
					@click.native="selected = index">
				</el-image>
				<div 
					class="selected"
					v-if="isShowSelected && selected === index"
				></div>
				<div class="collect-tab" v-if="isCollectTab">
					<el-button :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle size='mini'
						:loading="image.loading" @click="onCollect(image)"></el-button>
					<el-button icon="el-icon-delete" circle size='mini' :loading="image.loading"
						@click="onDelete(image)"></el-button>
				</div>
			</el-col>
		</el-row>
		<!-- /素材列表 -->
		<!-- 列表分页 -->
		<!-- total 用来设定总数据的条数 默认是按照 10 条每页计算总页码
		 page-size 每页显示条目个数 默认是 10 条
		 -->
		<el-pagination layout="prev, pager, next" :total="totalCount" :page-size="pageSize" :disabled="loading"
			:current-page.sync="page" @current-change="onCurrentChange">
		</el-pagination>
		<!-- /列表分页 -->
	</div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/images'
export default {
	name: 'ImageIndex',
	components: {},
	props: {
		isAddImage: {
			type: Boolean,
			default: true
		},
		isCollectTab: {
			type: Boolean,
			default: true
		},
		isShowSelected: {
			type: Boolean,
			default: false
		}
	},
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
			selected: null  // 素材库 默认图片没有选中的
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
		margin: 10px;
		.collect-tab {
			font-size: 20px;
			  display: flex;
			  justify-content: space-evenly;
			  align-items: center;
			  height: 40px;
			  background-color: rgba(204, 204, 204, .5);
			  position: absolute;
			  bottom: 4px;
			  left: 5px;
			  right: 14px;
		}
		.selected {
			background: url(./selected.png) no-repeat;
			background-size: cover;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}	
	
</style>
