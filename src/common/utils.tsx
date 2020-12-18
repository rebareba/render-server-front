import {message, Modal, Tag} from 'antd'
import React, {Component, ComponentClass} from 'react'
import {RouteComponentProps} from 'react-router'
import moment from 'moment'
import h from './history'
import conf from '@/config/conf.json'
import GlobalStore from '@src/io/global-store'
export * from './constant'

export const history = h

export interface FrameProps extends RouteComponentProps<any> {
  globalStore: GlobalStore
}
export interface AppConfig {
  config: {
    [propName: string]: any
  }
  key: string
  permission: number
}

interface asyncComponentState {
  component: ComponentClass
}
interface GetComponent {
  (): Promise<ComponentClass<any, any> | null>
}
// 和`webpack chunk`配合使用的异步加载模块
export function asyncComponent(getComponent: GetComponent): ComponentClass {
  class AsyncComponent extends Component<any, asyncComponentState> {
    static SC: ComponentClass
    constructor(props: any) {
      super(props)
      this.state = {component: AsyncComponent.SC}
      if (!this.state.component) {
        getComponent().then((component: ComponentClass | null) => {
          if (component) {
            AsyncComponent.SC = component
            this.setState({component})
          }
        })
      }
    }

    render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : null
    }
  }
  return AsyncComponent
}

// 统一成功提示
export function successTip(content: string): void {
  message.success(content)
}
// 统一失败提示
export function errorTip(title: string, content: string): void {
  const l = arguments.length
  if (l === 0) {
    title = '系统异常'
  } else if (l === 1) {
    content = title
    title = ''
  }
  Modal.error({
    title,
    content,
  })
}
// 统一信息提示
export function infoTip(content: string): void {
  message.info(content)
}

// 统一警告提示
export function warningTip(content: string): void {
  message.warning(content)
}

// 时间戳转化时间显示
export function getFormatTime(time: string, format = 'YYYY-MM-DD'): string {
  return time ? moment(time).format(format) : ''
}

export const config = Object.assign(conf, window.conf)

// 获取日志配置
export function log(...arg: any[]): void {
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log(...arg)
  }
}

export function getUserConfig(key: string) {
  const userConfig = window.userConfig || {}
  return userConfig[key]
}
// 获取http method对应的颜色tag标签
export function getHttpMethodTag(method) {
  let color = ''
  switch (method) {
    case 'GET':
      color = 'blue'
      break
    case 'POST':
      color = 'green'
      break
    case 'PUT':
      color = 'orange'
      break
    case 'DELETE':
      color = 'red'
      break
    default:
      break
  }
  return <Tag color={color}>{method}</Tag>
}
