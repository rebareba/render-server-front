/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-25 09:29:32
 * @Description:
 */

import {createIo} from '@common/create-io'
import {runInAction, makeAutoObservable} from 'mobx'

const apis = {
  markdown: {
    method: 'GET',
    url: 'markdown',
  },
}

const io = createIo(apis, 'plugin')

class PluginStore {
  // 获取的全量的应用配置列表
  plugin = ''

  constructor() {
    makeAutoObservable(this)
  }

  // 获取配置列表
  async markdown(type = 'plugin') {
    const {success, content} = await io.markdown({type})
    if (!success) return
    runInAction(() => {
      if (type === 'about') {
        this.about = content
      } else {
        this.plugin = content
      }
    })
  }
}
const pluginStore = new PluginStore()

// autorun(() => {
//   console.log('autorun', loginStore.mobile)
// })
export default pluginStore
