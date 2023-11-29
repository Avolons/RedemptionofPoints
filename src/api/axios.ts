import axios, { AxiosResponse, AxiosRequestTransformer } from 'axios'
import { message } from 'ant-design-vue'
// axios.defaults.headers.post['Content-Type'] = 'application/json';
import Router from '@/router'
axios.defaults.timeout = 25000
axios.defaults.baseURL = "http://www.csgoods.cn:10031"


const Axios: AxiosRequestTransformer = axios

export interface ParamOption {
  load?: boolean; // 接口请求过程中 是否显示 load
  loadNoClose?: boolean; // load true的情况下    请求完成也不关闭load
  successMsg?: string | boolean; // 请求成功 提示信息  默认false不提示  string:'信息'   true：显示后端信息
  errorMsg?: boolean | string; // 错误信息   默认true 显示后端错误信息,  string:信息    false 不提示
  bolb?: boolean; // 后端传输二进制数据
  error?: (errorText: string, res: any) => void
  finally?: () => void
  baseURL?: string
  headers?: any
}

export interface ErrorResponse {
  code: number;
  description: string;
  message: string;
  traceId: string;
}

export function GET(url: string, params: any = []) {
  return fetch(url, 'get', params[0], params[1])
}

export function POST(url: string, params: any = []) {
  return fetch(url, 'post', params[0], params[1])
}

export function DELETE(url: string, params: any = []) {
  return fetch(url, 'delete', params[0], params[1])
}

export function PATCH(url: string, params: any = []) {
  return fetch(url, 'patch', params[0], params[1])
}

export function PUT(url: string, params: any = []) {
  return fetch(url, 'put', params[0], params[1])
}


function fetch(url: string, method: string, params: any, option: ParamOption = <ParamOption>{}) {
  let request: any = {
    method: method,
    url: url,
  }
  if (/get|delete/i.test(method)) {
    request.params = params
  } else {
    request.data = params
  }
  if (option.bolb) {
    request.responseType = 'blob'
    request.emulateJSON = true
  }

  if (option.baseURL) {
    request.baseURL = option.baseURL
  }

  const res = Axios(request).then((response: AxiosResponse) => {
    
      return response.data.data
  }).catch((e: any) => {
    let response: AxiosResponse<ErrorResponse> = e || {}
    const errorMsg: any = option.errorMsg || codeError(response.status, e.message) || response.data?.message || '未知错误'
    if (option.errorMsg !== false) {
      message.error(errorMsg)
    }
    console.log(response);

    if (response.data.code == 4005 || response.data.code == 4007) {
      Router.push({
        path: "login"
      })
    }
    option.error && option.error(errorMsg, e.response)
    option.finally && option.finally()
  
    return Promise.reject(errorMsg)
  })
  return res
}


function codeError(code: number, message: any): string | undefined {
  switch (code) {
    case 404:
      return '404找不到'
    case 401:
      return '登录已过期'
    case 500:
    case 502:
    case 504:
      return '服务器错误'
  }
  if (message === 'timeout of 25000ms exceeded') {
    return '服务器响应超时'
  }
}
