/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-06-09 17:29:15
 * @Description: 配置的处理， 新建项目这些
 */
import {createIo} from '@common/create-io'
import {runInAction, makeAutoObservable, toJS} from 'mobx'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import {log, message} from '@utils'

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

const io = createIo(apis, 'home')

class HomeStore {
  // 获取的全量的应用配置列表
  appConfigList = []

  // 关键词过滤
  filterWord = ''

  // 复制或者拷贝的时候使用
  appConfig = {
    config: {},
    key: '',
    permission: 0,
  }

  // 只读model
  readVisible = false

  // 编辑和新建
  editVisible = false

  modalData = {
    title: '',
    value: '',
    loading: false,
    type: 'read', // read add edit
    visible: false,
    key: '',
  }

  // 新建配置存储的值

  // model的标题

  // 是添加还是编辑
  isAdd = false

  constructor() {
    makeAutoObservable(this)
  }

  // 这里是筛选LIST的内
  get configList() {
    if (this.filterWord) {
      return this.appConfigList.filter((item) => {
        return JSON.stringify(item).indexOf(this.filterWord) >= 0
      })
    }
    return this.appConfigList
  }

  changeModalData = async (data) => {
    this.modalData = Object.assign(toJS(this.modalData), data)
    // this.modalData = Object.assign(this.modalData, data)
  }

  // 编辑和添加处理
  handleSaveData = async () => {
    if (this.modalData.type === 'read') {
      return (this.modalData.visible = false)
    }
    try {
      const appConfig = JSON.parse(this.modalData.value)
      if (!appConfig.name || !appConfig.key || !appConfig.description) {
        return message.warn('配置填写不规范, 必须添加 key 、name、 description 等')
      }
      this.modalData.loading = true
      let retData
      if (this.modalData.type === 'add') {
        retData = await io.add(appConfig)
      } else {
        retData = await io.edit({config: appConfig, key: this.modalData.key})
      }
      this.modalData.loading = false
      if (!retData.success) return
      if (this.modalData.type === 'add') {
        message.success('新建成功')
      } else {
        message.success('编辑成功')
      }
      this.changeModalData({visible: false})
      this.getList(true)
    } catch (e) {
      message.error(`配置填写不规范： ${e.message}`)
    }
  }

  // changeModalValue = async (value) => {
  //   this.modalData.value = value
  // }

  // 获取配置列表
  getList = async (refresh = false) => {
    if (this.appConfigList.length > 0 && !refresh) return
    const {success, content} = await io.list()
    if (!success) return
    runInAction(() => {
      this.appConfigList = content
    })
  }

  // 获取配置列表
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
  async edit(key, config) {
    log('edit key', key)
    const {success} = await io.edit({key, config})
    if (success) {
      message.success('编辑成功')
      this.value = ''
      setTimeout(() => this.getList(true), 500)
    }
    return success
  }
  // 添加配置

  async add(config) {
    const {success} = await io.add(config)
    if (success) {
      this.value = ''
      setTimeout(() => this.getList(true), 500)
    }
    return success
  }

  delete = async (key) => {
    log('delete key', key)
    const {success, message: msg} = await io.delete({key})
    if (success) {
      message.success('删除成功')
    } else {
      message.warning(msg)
    }
    setTimeout(() => this.getList(true), 500)
  }

  setValue(key, value) {
    switch (key) {
      case 'loading':
        this.loading = value
        break
      case 'readVisible':
        this.readVisible = value
        break
      case 'appConfig':
        this.appConfig = value
        break
      case 'editVisible':
        this.editVisible = value
        break
      case 'value':
        this.value = value
        break
      case 'title':
        this.title = value
        break
      case 'isAdd':
        this.isAdd = value
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

const homeStore = new HomeStore()

// autorun(() => {
//   console.log('autorun', loginStore.mobile)
// })
export default homeStore
