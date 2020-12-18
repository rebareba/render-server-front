import {message, Modal} from 'antd'
import {config, log, history} from '@src/common/utils'
import {ERROR_CODE} from '@src/common/constant'

import {creatRequest, RetData, Options} from '@src/common/request'

let mockData: any = {}
try {
  mockData = require('@/mock.json')
} catch (e) {
  log(e)
}

// 创建一个request
export const request = creatRequest({
  // 自定义的请求头
  headers: {},
  // 配置默认返回数据处理
  action: (data: RetData) => {
    if (data.success === false && data.code === ERROR_CODE.UN_LOGIN) {
      // TODO 这里可能统一跳转到 也可以是弹窗点击跳转
      Modal.confirm({
        title: '重新登录',
        content: '',
        onOk: () => {
          // location.reload()
          history.push(`${config.pathPrefix}/login?redirect=${window.location.pathname}${window.location.search}`)
        },
      })
    }
  },
  // 是否错误显示message
  showError: true,
  message,
  // 是否以抛出异常的方式 默认false {success: boolean判断}
  throwError: false,
  // mock 数据请求的等待时间
  delay: config.delay,
  // 日志打印
  log,
})

export interface APIS {
  [index: string]: Options
}

/**
 * 创建请求接口
 * @param ioContent {any { url: string method?: string mock?: any apiPrefix?: string}}
  }
 * @param name mock数据的对应文件去除-mock.json后的
 */
export const createIo = (ioContent: APIS, name = '') => {
  const content: {[index: string]: any} = {}
  Object.keys(ioContent).forEach((key) => {
    /**
     * @returns {message, content, code,success: boolean}
     */
    content[key] = async (options: Options = {}) => {
      // mock 数据的注入
      if (config.mock && config.mock[`${name}.${key}`] && mockData[name] && mockData[name][key]) {
        // 这个mock数据要深拷贝下 _.cloneDeep(value)
        ioContent[key].mock = JSON.parse(JSON.stringify(mockData[name][key][config.mock[`${name}.${key}`]]))
      }
      // 这里判断简单请求封装 rejectToData=true 表示复杂封装
      if (!options.rejectToData) {
        options = {
          data: options,
        }
      }
      const option = {...ioContent[key], ...options}

      option.url = ((option.apiPrefix ? option.apiPrefix : config.apiPrefix) || '') + option.url

      return request(option)
    }
  })
  return content
}
