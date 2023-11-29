import { GET, ParamOption, PATCH, POST, PUT ,DELETE } from '../api/axios'


// 查询用户积分
export function getIntegral(params?: any, options?: ParamOption) {
    return GET('/user/manage/userInfo', [params, options])
}
// 新增用户积分
export function addIntegral(params?: any, options?: ParamOption) {
    return POST('/user/manage/saveScore', [params, options])
}

// 删除用户积分
export function deleteIntegral(params?: any, options?: ParamOption) {
    return PUT(`/user/manage/account`, [params, options])
}
// 查存积分变动日志
export function getIntegralLog(params?: any, options?: ParamOption) {
    return GET('/user/manage/order/page', [params, options])
}
// 查询商品列表
export function getGoodsList(params?: any, options?: ParamOption) {
    return GET('/user/manage/type/list?key=667788', [params, options])
}



