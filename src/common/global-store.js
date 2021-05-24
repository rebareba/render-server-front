import {runInAction, makeAutoObservable} from 'mobx'
// import {createIo, rejectToData} from './create-io'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import md5 from 'md5'

import {history, config} from '@utils'

import {createIo} from './create-io'
// 用户登录相关接口配置
const apis = {
  login: {
    method: 'POST',
    url: 'login',
    // mock: Mock.login
  },
  logout: {
    method: 'POST',
    url: 'logout',
  },
  loginInfo: {
    method: 'get',
    url: 'login_info',
    // mock: Mock.loginInfo
  },
  list: {
    method: 'GET',
    url: 'list',
  },
  markdown: {
    method: 'GET',
    url: 'markdown',
  },
  edit: {
    method: 'PUT',
    url: 'edit',
  },
  add: {
    method: 'POST',
    url: 'add',
  },
  delete: {
    method: 'DELETE',
    url: 'delete',
  },
}
const io = createIo(apis, 'global')

export class GlobalStore {
  // 登陆
  account = ''

  password = ''

  loading = false

  // 用户信息
  userInfo

  appConfigList = []

  filterWord = ''

  about = ''

  plugin = ''

  constructor() {
    makeAutoObservable(this)
  }

  get configList() {
    if (this.filterWord) {
      return this.appConfigList.filter((item) => {
        return JSON.stringify(item).indexOf(this.filterWord) >= 0
      })
    }
    return this.appConfigList
  }

  setFilterWord(filterWord) {
    this.filterWord = filterWord
  }

  async loginInfo() {
    if (this.userInfo) return
    const {success, content} = await io.loginInfo()
    if (success) {
      runInAction(() => {
        this.userInfo = content
      })
    } else {
      history.push(`${config.pathPrefix}/login`)
    }
  }

  // 登录操作
  async login(account, password) {
    const {success, content, message} = await io.login({
      name: account,
      password: md5(password),
    })
    if (success) {
      runInAction(() => {
        this.userInfo = content
      })
      const querys = new URLSearchParams(history.location.search)
      const redirect = querys.get('redirect')
      if (redirect) {
        history.push(redirect)
      } else {
        history.push(`${config.pathPrefix}/home`)
      }
    }
    return {success, message}
  }

  async logout() {
    await io.logout()
    runInAction(() => {
      this.userInfo = null
    })
    history.push(`${config.pathPrefix}/login`)
  }

  setValue(key, value) {
    switch (key) {
      case 'loading':
        this.loading = value
        break
      case 'account':
        this.account = value
        break
      case 'password':
        this.password = value
        break
      default:
    }
  }

  // 这样写不会生效不会自动监听
  set(key, value) {
    if (isString(key)) {
      this.setValue(key, value)
    } else if (isPlainObject(key)) {
      Object.entries(key).forEach(([k, v]) => this.setValue(k, v))
    }
  }
}
export default GlobalStore
