<template>
	<div>
		<el-card class="box-card">
		<el-row>
			<el-col :span="12">
				<el-form :model="user" :rules="rules" ref="ruleForm" label-width="80px">
					<el-form-item label="编号">
						<el-input v-model="user.id" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="手机">
						<el-input v-model="user.mobile" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="媒体名称" prop="name">
						<el-input v-model="user.name"></el-input>
					</el-form-item>
					<el-form-item label="媒体介绍" prop="intro">
						<el-input type="textarea" v-model="user.intro"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="user.email"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit" :loading="userInfoLoading">修改</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="10" :offset="2">
				<label for="file" class="upload-img">
					<el-avatar shape="square" :size="150" fit="fit" :src="user.photo"></el-avatar>
					<p>点击上传图片</p>
				</label>
				<input type="file"
							 id="file"
							 ref="file"
							 hidden
							 @change="onFileChange"
							 >
			</el-col>
		</el-row>
		</el-card>
		<el-dialog
		  title="修改头像"
		  :visible.sync="dialogVisible"
			append-to-body
		  :before-close="handleClose"
			@opened="onOpened"
			@closed="onClosed"
			>
			<div class="preview-image">
				<img class="image" :src="previewImage" ref="preview-image">
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="onUploadImg" :loading="uploadLoading">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getUserProfile,
		uploadUserInfo,
		uploadUserImg
	} from '@/api/user'
	import 'cropperjs/dist/cropper.css';
	import Cropper from 'cropperjs';
	import globalBus from '@/utils/global-bus'
	export default {
		name: 'SettingsIndex',
		components: {},
		props: {},
		data() {
			return {
				user: {
					email: '', // 邮箱
					intro: '', // 简介
					mobile: '', // 手机号
					name: '', // 昵称
					photo: '' // 头像
				},
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
						{ min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
					],
					intro: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '邮箱不能为空', trigger: 'blur' },
						{ pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ ,message: '邮箱格式错误,请参照116@asd.com', trigger: 'blur'}
					]
				},
				dialogVisible: false, // 弹出层
				previewImage: '', // 预览图片
				cropper: '' ,// 裁切器  
				uploadLoading: false, //修改图片时 loading
				userInfoLoading: false //修改用户信息时 loading
			}
		},
		created() {
			this.loadGetUser()
		},
		mounted() {},
		methods: {
			async loadGetUser() {
				const res = await getUserProfile()
				// console.log(res)
				this.user = res.data.data
			},
			onSubmit() {
				this.userInfoLoading = true
				this.$refs['ruleForm'].validate(valid => {
					if (!valid) {
						return 
					}
					uploadUserInfo({
						name: this.user.name,
						intro: this.user.intro,
						email: this.user.email
					}).then(res => {
						// console.log(res)
						this.$message({
							type: 'success',
							message: '修改成功'
						})
					})
				})
				this.userInfoLoading = false
				// 发送通知 更新用户资料
				globalBus.$emit('uploadUserInfo',this.user)
			},
			onFileChange () {
				// 处理图片预览
				const file = this.$refs.file
				// console.log(file.files[0])
				
				const blodData = window.URL.createObjectURL(file.files[0])
				// console.log(blodData)
				this.previewImage = blodData
				
				this.dialogVisible = true
				// 解决多次选择同一个文件不触发change事件问题
				this.$refs.file.value = ''
			},
			// 弹出层关闭
			handleClose (done) {
			  this.$confirm('确认关闭？')
			    .then(_ => {
			      done();
			    })
			    .catch(_ => {});
			},
			// Dialog 打开动画结束时的回调  img必须是可见状态 
			onOpened () {
				const image = this.$refs['preview-image']
				this.cropper = new Cropper(image, {
				  aspectRatio: 1,
					viewMode: 1,
					movable: true,
				  // crop (event) {
				  //   console.log(event.detail.x)
				  //   console.log(event.detail.y)
				  //   console.log(event.detail.width)
				  //   console.log(event.detail.height)
				  //   console.log(event.detail.rotate)
				  //   console.log(event.detail.scaleX)
				  //   console.log(event.detail.scaleY)
				  // }
				})
			},
			// cropper 预览图片后不更新，强制更新
			onClosed () {
				// 关闭对话框 销毁裁切器
				this.cropper.destroy()
			},
			// 更换 图片
			onUploadImg () {
				// loading  开启
				this.uploadLoading = true
				this.cropper.getCroppedCanvas().toBlob(file => {
					// console.log(file)
					const fd = new FormData()
					fd.append('photo', file)
					uploadUserImg (fd).then(res => {
						// console.log(res)
						// 关闭对话框
						this.dialogVisible = false
						// 更新图片展示
						// this.user.photo = res.data.data.photo
						this.user.photo = window.URL.createObjectURL(file)
						// loading 结束
						this.uploadLoading = false
						// 发送通知 更新用户资料
						globalBus.$emit('uploadUserInfo',this.user)
						
						this.$message({
							type: 'success',
							message: '更换成功'
						})
					})
				})
			}
			
		}
	}
</script>

<style scoped lang="less">
	.preview-image {
		.image {
			 display: block;
			 max-width: 100%;
			 height: 300px;
		}
	}
	.upload-img {
		position: relative;
		.btn-uploadimg {
			position: absolute;
			top:36px;
			left:55px;
			// margin-top: 10px;
		}
	}
</style>
