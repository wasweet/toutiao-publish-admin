<template>
	 <div>
	    <el-card class="box-card">
	      <div slot="header" class="clearfix">
	        <span>评论详情列表</span>
	      </div>
			<el-button 
				style="float: right; padding: 3px 0" 
				type="text"
				@click="$router.push('/comment')"
			>返回</el-button>
	      <el-table :data="comments" style="width: 100%">
	        <el-table-column prop="content" label="评论内容" width="180">
	        </el-table-column>
	        <el-table-column prop="name" label="点赞" width="180">
	          <template slot-scope="scope">
	            {{ scope.row.is_liking === true ? '已赞' : '没有赞' }}
	          </template>
	        </el-table-column>
	        <el-table-column prop="like_count" label="点赞数量" width="180">
	        </el-table-column>
	        <el-table-column prop="pubdate" label="评论日期" width="180">
	          <template slot-scope="scope">
	            <!--
	              不传参：{{ scope.row.pubdate | dateFormat }}
	              传参：{{ scope.row.pubdate | dateFormat(参数) }}
	             -->
	            {{ scope.row.pubdate }}
	          </template>
	        </el-table-column>
	        <el-table-column label="是否推荐" width="180">
	          <template slot-scope="scope">
	            <el-switch
	              v-model="scope.row.is_top"
	              active-color="#13ce66"
	              inactive-color="#ff4949"
	              @change="onTop(scope.row)"
	            >
	            </el-switch>
	          </template>
	        </el-table-column>
	        <el-table-column prop="reply_count" label="回复数量" width="180">
	        </el-table-column>
	      </el-table>
				<!-- 列表分页 -->
				<!-- total 用来设定总数据的条数 默认是按照 10 条每页计算总页码
				 page-size 每页显示条目个数 默认是 10 条
				 -->
				<el-pagination layout="prev, pager, next" 
												:total="totalCount" 
												:page-size="limit"
												:disabled="loading"
												:current-page.sync="page"
												@current-change="onCurrentChange">
				</el-pagination>
				<!-- /列表分页 -->
	    </el-card>
	  </div>
</template>

<script>
	import { getComments, topComment } from '@/api/comment'
  export default {
    name: "CommentDetail",
    components: {},
    props: {},
    data() {
      return {
				comments: [],
				comment: {
					type: 'a',
					source: ''
				},
				loading: true, //表格加载数据中 loading
				totalCount: 0, // 总数据条数
				limit: 10, // 每页显示的条目数
				page: 1 //当前页码
			}
    },
    computed: {},
    watch: {},
    created() {
			this.loadGetComments(1)
		},
    methods: {
			async loadGetComments (page) {
				this.page = page
				// 开启加载 loading
				this.loading = true
				const articleId = this.$route.query.id
				const res = await getComments(page,this.limit,this.comment.type,articleId,true)
				console.log(res)
				this.comments = res.data.data.results
				this.totalCount = res.data.data.total_count
				
				// 开启加载 loading
				this.loading = false
			},
			// 分页
			onCurrentChange(page) {
				this.loadGetComments(page)
			},
			onTop(comment) {
				console.log(comment.id,comment.is_top)
				topComment(comment.id,comment.is_top).then(res => {
					console.log(res)
				})
			}
		}
  };
</script>

<style scoped></style>