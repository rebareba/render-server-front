import axios from 'axios'
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

// 配置接口参数
export interface Options {
  url?: string
  baseURL?: string
  // 默认GET
  method?: Method
  // 标识是否注入到data参数
  rejectToData?: boolean
  // 是否直接弹出message 默认是
  showError?: boolean
  // 指定 回调操作 默认登录处理
  action?(data: any): any
  headers?: {
    [index: string]: string
  }
  timeout?: number
  // 指定路由参数
  params?: {
    [index: string]: string
  }
  // 指定url参数
  query?: any
  // 指定body 参数
  body?: any
  // 混合处理 Get到url, delete post 到body, 也替换路由参数 在createIo封装
  data?: any
  mock?: any
  log?: any
  message?: any
  throwError?: boolean
  delay?: number
  apiPrefix?: string
}

export interface ResErr extends Error {
  content?: any
  status?: number
  code?: string
}
export interface RetData {
  success: boolean
  message?: string
  content?: any
  code?: string
  status?: number
}

// ajax 请求的统一封装
// TODO 1. 对jsonp请求的封装 2. 重复请求
export function creatRequest(option: Options) {
  return async (optionData: Options) => {
    const options = {
      url: '',
      method: 'GET',
      showError: option.showError !== false,
      timeout: option.timeout || 60 * 1000,
      action: option.action,
      headers: {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...option.headers},
      ...optionData,
    }
    // 简单请求处理
    if (options.data) {
      if (typeof options.data === 'object') {
        Object.keys(options.data).forEach((key) => {
          if (key[0] === ':' && options.data) {
            options.url = options.url.replace(key, encodeURIComponent(options.data[key]))
            delete options.data[key]
          }
        })
      }
      if ((options.method || 'GET').toLowerCase() === 'get' || (options.method || 'GET').toLowerCase() === 'head') {
        options.query = Object.assign(options.data, options.query)
      } else {
        options.body = Object.assign(options.data, options.body)
      }
    }
    // 路由参数处理
    if (typeof options.params === 'object') {
      Object.keys(options.params).forEach((key) => {
        if (key[0] === ':' && options.params) {
          options.url = options.url.replace(key, encodeURIComponent(options.params[key]))
        }
      })
    }
    // query 参数处理
    if (options.query) {
      const paramsArray: string[] = []
      Object.keys(options.query).forEach((key) => {
        if (options.query[key] !== undefined) {
          paramsArray.push(`${key}=${encodeURIComponent(options.query[key])}`)
        }
      })
      if (options.url.search(/\?/) === -1) {
        options.url += `?${paramsArray.join('&')}`
      } else {
        options.url += `&${paramsArray.join('&')}`
      }
    }
    if (option.log) {
      option.log(options.mock ? 'Mock request  options' : 'Request  options', options.method, options.url)
      option.log(options)
    }
    if (options.headers['Content-Type'] === 'application/json' && options.body && typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
    let retData: RetData = {success: false}
    // mock 处理
    if (options.mock) {
      retData = await new Promise((resolve) =>
        setTimeout(() => {
          // TODO mock数据被改变的问题
          resolve(options.mock)
        }, option.delay || 500),
      )
    } else {
      try {
        const opts = {
          url: options.url,
          baseURL: options.baseURL,
          params: options.params,
          method: options.method,
          headers: options.headers,
          data: options.body,
          timeout: options.timeout,
        }
        const {data} = await axios(opts)
        retData = data
      } catch (err) {
        retData.success = false
        retData.message = err.message
        if (err.response) {
          retData.status = err.response.status
          retData.content = err.response.data
          retData.message = `浏览器请求非正常返回: 状态码 ${retData.status}`
        }
      }
    }

    // 自动处理错误消息
    if (options.showError && retData.success === false && retData.message && option.message) {
      option.message.error(retData.message)
    }
    // 处理Action
    if (options.action) {
      options.action(retData)
    }
    if (option.throwError && !retData.success) {
      const err: ResErr = new Error(retData.message)
      err.code = retData.code
      err.content = retData.content
      err.status = retData.status
      throw err
    }
    return retData
  }
}
