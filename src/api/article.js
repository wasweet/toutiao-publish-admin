/**
 * 内容管理 模块
 */

import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getArticles = (params) => {
	return request({
		method: 'GET',
		url: '/mp/v1_0/articles',
		// Body 参数使用 data 设置
		// Query 参数使用 params 设置
		// Headers 参数使用 headers 设置
		params
	})
}


/**
 * 获取文章频道
 */
export const getArticlesChannels = () => {
	return request({
		method: 'GET',
		url: '/mp/v1_0/channels'
	})
}

/**
 * 删除文章
 */
export const delArticles = (articleId) => {
	return request({
		method: 'DELETE',
		url: `/mp/v1_0/articles/${articleId}`
	})
}

/**
 * 添加文章
 */
export const addArticles = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

/**
 * 获取指定文章
 */
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 编辑 文章
 */
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}