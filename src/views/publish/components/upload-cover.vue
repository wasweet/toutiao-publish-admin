<template>
	<div class="cover-container">
		<div class="preview" @click="centerDialogVisible=true">
			<img :src="value" class="avatar" ref="cover-img" width="150" >
			<!-- <i v-if="isShow" class="el-icon-plus avatar-uploader-icon"></i> -->
		</div>
		<el-dialog title="请选择文章封面图片" :visible.sync="centerDialogVisible" append-to-body center>
			<el-tabs v-model="activeName" >
			    <el-tab-pane label="素材库" name="first">
						<el-radio-group v-model="collect" @change="localGetImages(1)">
							<el-radio-button :label="false">全部</el-radio-button>
							<el-radio-button :label="true">收藏</el-radio-button>
						</el-radio-group>
						<!-- 素材列表 -->
						<el-row >
							<el-col 
								v-for="(image,index) in images" 
								:key="index"
								class="images"
							>
								<el-image 
									class="el-images"
									:src="image.url" 
									fit="cover"
								>
								</el-image>
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
					</el-tab-pane>
			    <el-tab-pane label="本地上传" name="second">
						<div class="preview-image-wrap">
						  <input type="file" ref="file" @change="onFileChange"/>
						  <img class="preview-image" width="100" ref="preview-image">
						</div>
					</el-tab-pane>
			  </el-tabs>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="onUploadImg">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getImages, uploadImage } from '@/api/images'
	export default {
		name: 'UploadCoverIndex',
		components: {},
		props: ['value'],
		data() {
			const user = JSON.parse(window.localStorage.getItem('user'))
			return {
				centerDialogVisible: false,
				activeName: 'second',
				collect: false,  //默认 全部
				images: [],  //存储 图片 素材
				uploadHeaders: {
					Authorization : `Bearer ${user.token}`
				},
				totalCount: 0, // 总数据条数
				pageSize: 8, // 每页显示的条目数
				page: 1 ,// 当前页码
				loading: true,  // 表格加载数据中 loading
				previewImage: '',  //预览图
				isShow: true //默认显示  当添加上封面是hidden
			}
		},
		created() {
			// 获取图片素材
			this.localGetImages(1)
		},
		mounted() {

		},
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
				this.images = res.data.results
				// 获取总条数
				this.totalCount = res.data.total_count
				this.loading = false
			},
			// 点击页码跳转到 当前页
			onCurrentChange (page) {
				this.localGetImages(page)
			},
			
			onFileChange () {
				// // 获取文件对象
				const file = this.$refs.file.files[0]
				 // console.log(file.files[0])
				// 处理图片预览
				const blodData = window.URL.createObjectURL(file)
				 // console.log(blodData)
				// this.previewImage = blodData
				this.$refs['preview-image'].src = blodData
			},
			
			// 显示到封面中
			onUploadImg () {
				// 如果tab 是本地上传 才能执行上传文件操作
				if (this.activeName === 'second') {
					const file = this.$refs.file.files[0]
					if (!file) {
						this.$message('请上传文件')
						return
					}
					// 执行 上传操作
					const fd = new FormData()
					fd.append('image', file)
					uploadImage(fd).then(res => {
						// console.log(res)
						this.$message({
							type: 'success',
							message: '成功'
						})
						// 对话框关闭
						this.centerDialogVisible = false
						// 封面展示
						// this.$refs['cover-img'].src = res.data.data.url
						
						// 将图片地址传到父组件中,让父组件 绑定数据
						this.$emit('input',res.data.data.url)
					})
				}
				
			}
			
		}
	}
</script>

<style scoped lang="less">
	.cover-container {
			width: 150px;
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	
	  .cover-container .el-upload:hover {
	    border-color: #409eff;
	  }
	
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 150px;
	    height: 150px;
	    line-height: 150px;
	    text-align: center;
	  }
	
	  // .avatar {
	  //   width: 150px;
	  //   height: 150px;
	  //   display: block;
	  // }
		.preview {
			width: 150px;
			margin: 0 auto;
		}
		.preview-image-wrap {
		  display: flex;
		  flex-direction: column;
		
		  .preview-image {
		    margin: 5px;
		  }
		}
		.images {
			display: flex;
			justify-content: space-between;
			width: 150px;
			height: 150px;
			.el-images {
				width: 150px;
				height: 150px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
</style>
