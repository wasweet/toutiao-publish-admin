<template>
	<div class="cover-container">
		<div class="preview" @click="centerDialogVisible=true">
			<img :src="value" class="avatar" ref="cover-img" width="150" >
			<!-- <i v-if="isShow" class="el-icon-plus avatar-uploader-icon"></i> -->
		</div>
		<el-dialog title="请选择文章封面图片" :visible.sync="centerDialogVisible" append-to-body center>
			<el-tabs v-model="activeName" >
			    <el-tab-pane label="素材库" name="first">
						<image-list 
						:is-add-image="false"
						:is-collect-tab="false"
						:is-show-selected="true"
						ref="image-list"
						/>
					</el-tab-pane>
			    <el-tab-pane label="本地上传" name="second">
						<div class="preview-image-wrap">
						  <input type="file" ref="file" @change="onFileChange"/>
						  <img class="preview-image"  ref="preview-image">
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
import imageList from '@/views/image/components/image-list' 
	export default {
		name: 'UploadCoverIndex',
		components: {
			imageList
		},
		props: ['value'],
		data() {
			return {
				centerDialogVisible: false,
				activeName: 'second',
				previewImage: '',  //预览图
			}
		},
		created() {
			
		},
		mounted() {

		},
		methods: {
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
				} else if (this.activeName === 'first') {
					// 如果tab 是素材库 才能执行上传文件操作
					// 父组件直接访问自组件中的数据
					const imageList = this.$refs['image-list']
					// console.log(imageList.selected)
					const selected = imageList.selected
					if (selected === null) {
						this.$message('请选择文件')
						return 
					}
					// 关闭对话框
					this.centerDialogVisible = false
					// 修改父组件  绑定数据
					this.$emit('input',imageList.images[selected].url)
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

</style>
