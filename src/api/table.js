// 引入axios（axios进行二次封装）
import request from '@/utils/request'
// 对外暴露获取列表的接口函数
export function getList(params) {
    return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
    })
}