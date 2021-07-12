/**
 * 粉丝模块
 */

import request from '@/utils/request'


/**
 * 获取粉丝列表
 */
export const queryFollowers = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params
  })
}


/**
 * 关注取关粉丝
 */ 
// export const follow = fanId => {
//   return request({
//     method: 'POST',
//     url: '/mp/v1_0/follow',
//     params: {
//       fanId
//     }
//   })
// }