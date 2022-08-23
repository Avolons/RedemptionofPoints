import { GET, ParamOption, PATCH, POST, PUT ,DELETE } from '../api/axios'

// 学校列表
export function getLists(params?: any, options?: ParamOption) {
    return GET('/pdRelTopicEvent', [params, options])
}
// 编辑学校
export function addObj(params?: any, options?: ParamOption) {
    return POST('/pdRelTopicEvent', [params, options])
}
// edit
export function editObj(params?: any, options?: ParamOption) {
    return PUT(`/pdRelTopicEvent/${params.id}`, [params, options])
}
// 新增学校
export function deleteObj(params?: any, options?: ParamOption) {
    return DELETE(`/pdRelTopicEvent/${params.id}`, [params, options])
}




