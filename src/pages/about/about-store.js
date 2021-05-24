/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-24 17:52:49
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

const io = createIo(apis, 'about')

class AboutStore {
  about = ''

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
const aboutStore = new AboutStore()

// autorun(() => {
//   console.log('autorun', loginStore.mobile)
// })
export default aboutStore
