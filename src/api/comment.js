import request from '@/utils/request'

/**
 * 获取评论
 */ 
export const getComments = (page,perPage,type,source,allowComment = true) => {
	return request({
		method: 'GET',
		url: '/mp/v1_0/comments',
		params:{
			page,
			per_page:perPage,
			type,
			source
		},
		data: {
			allow_comment: allowComment
		}
	})
}

/**
 * 修改评论置顶
 */ 
export const topComment = (commentId,sticky) => {
	return request({
		method: 'PUT',
		url: `/mp/v1_0/comments/${commentId}/sticky`,
		sticky
	})
}