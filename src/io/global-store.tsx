import {observable, action, computed, runInAction} from 'mobx'
import io from './global-io'
import history from '../common/history'
import {config, errorTip, successTip, log, AppConfig} from '../common/utils'
import md5 from 'md5'

export class GlobalStore {
  @observable userInfo: any = null
  @observable appConfigList: AppConfig[] = []
  @observable filterWord = ''
  @observable about = ''
  @observable plugin = ''

  @computed
  get configList() {
    if (this.filterWord) {
      return this.appConfigList.filter((item) => {
        return JSON.stringify(item).indexOf(this.filterWord) >= 0
      })
    }
    return this.appConfigList
  }
  @action
  setFilterWord(filterWord: string) {
    this.filterWord = filterWord
  }
  // 获取当前的登录信息
  @action.bound
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
  @action.bound
  async login(account: string, password: string) {
    const {success, content} = await io.login({
      name: account,
      password: md5(password),
    })
    if (success) {
      runInAction(() => {
        this.userInfo = content
        history.push(`${config.pathPrefix}/home`)
      })
    }
  }
  // 登出操作
  @action.bound
  async logout() {
    await io.logout()
    history.push(`${config.pathPrefix}/login`)
    runInAction(() => {
      this.userInfo = null
    })
  }
  // 获取配置列表
  @action.bound
  async getList(refresh = false) {
    if (this.appConfigList.length > 0 && !refresh) return
    const {success, content} = await io.list()
    if (!success) return
    runInAction(() => {
      this.appConfigList = content
    })
  }
  // 获取配置列表
  @action.bound
  async markdown(type = 'about') {
    if ((type === 'about' && this.about) || (type === 'plugin' && this.plugin)) return
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
  // 编辑配置
  @action.bound
  async edit(key: string, config: any) {
    log('edit key', key)
    const {success, message} = await io.edit({key, config})
    if (success) {
      successTip('编辑成功')
      setTimeout(() => this.getList(true), 500)
    } else {
      errorTip('编辑失败', message)
    }
    return success
  }
  // 添加配置
  @action.bound
  async add(config: any) {
    const {success, message} = await io.add(config)
    if (success) {
      successTip('新建成功')
      setTimeout(() => this.getList(true), 500)
    } else {
      errorTip('新建失败', message)
    }
    return success
  }
  @action.bound
  async delete(key: string) {
    log('delete key', key)
    const {success, message} = await io.delete({key})
    if (success) {
      successTip('删除成功')
    } else {
      errorTip('删除', message)
    }
    setTimeout(() => this.getList(true), 500)
  }
}
export default GlobalStore
