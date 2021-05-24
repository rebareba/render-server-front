import {action, makeAutoObservable, runInAction} from 'mobx'
import {createIo} from '@common/create-io'
import {message} from 'antd'
import _ from 'lodash'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
// import remove from 'lodash/remove'

import {history, config, storage} from '@utils'
// 用户登录相关接口配置
const apis = {
  list: {
    method: 'GET',
    url: 'list',
  },
  // 1. 获取应用及所有api列表
  getAppApiList: {
    method: 'GET',
    url: 'app/:appKey',
  },
  // 2. 更新应用配置 包含hosts apiPrefix categoies
  updateApp: {
    method: 'PUT',
    url: 'app/:appKey',
  },
  // 3. 新增接口
  addApi: {
    method: 'POST',
    url: 'app/:appKey',
  },

  // 4. 获取单个API信息
  getApiDetail: {
    url: 'app/:appKey/api/:apiId',
  },
  // 5. 更新接口
  updateApi: {
    method: 'PUT',
    url: 'app/:appKey/api/:apiId',
  },

  // 6. 删除API
  deleteApi: {
    method: 'DELETE',
    url: 'app/:appKey/api/:apiId',
  },

  // 7. 获取接口的测试用例
  getTestCaseList: {
    url: 'app/:appKey/api/:apiId/case',
  },
  // 8. 获取接口的测试用例
  saveTestCase: {
    method: 'POST',
    url: 'app/:appKey/api/:apiId/case',
  },
  // 9. 获取接口的测试用例
  deleteCase: {
    method: 'DELETE',
    url: 'app/:appKey/api/:apiId/case/:caseId',
  },
  // 10. 测试接口
  testApi: {
    method: 'POST',
    url: 'test',
  },
}
const io = createIo(apis, 'api')

class ApiTestStore {
  appConfigList = []

  // 应用相关
  appInfo = {name: '', hosts: [], categories: [], apiPrefiies: [], ctime: '', mtime: ''}

  apiId = 'index'

  appKey = ''

  editApi = false

  // 应用分类编辑
  appCateVisible = false

  appHostVisible = false

  apiPrefixVisible = false

  // 侧边栏
  apiList = []

  list = []

  treeData = []

  // 接口相关
  apiDetail = {}

  newApiData = {
    name: '',
    path: '',
    method: 'GET',
    cateCode: '',
    apiPrefix: '',
    description: '',
    params: [],
  }

  // 测试相关
  apiPrefix

  host

  defaultBody = ''

  body = ''

  method = 'GET'

  param = []

  query = []

  // 是否直接测试，还是通过Render-Server转发
  direct = false

  header = [{name: '', value: ''}]

  result = {headers: {}, body: '', status: '-'}

  // 测试用例相关
  caseList = []

  caseListLoading = false

  selectedCaseId = ''

  showCase = true

  modalVisible = {
    addCase: false,
    editCase: false,
  }

  // 其他
  updateKey = ''

  isLoading = false

  globalConfig = [{name: 'X-Requested-With', paramLocation: 'Header', checked: true, value: 'XMLHttpRequest'}, {}]

  constructor() {
    const globalConf = storage.get('globalConfig')
    if (globalConf) {
      try {
        const data = JSON.parse(globalConf)
        if (data instanceof Array && data.length > 0) {
          data.push({name: '', paramLocation: 'Header', checked: true, value: ''})
          this.globalConfig = data
        }
      } catch (err) {}
    }
    makeAutoObservable(this)
  }

  // 处理数据变化的页面响应
  update() {
    this.updateKey = Math.random()
  }

  // 获取配置列表
  getList = async (refresh = false) => {
    if (this.appConfigList.length > 0 && !refresh) return
    const {success, content} = await io.list()
    if (!success) return
    runInAction(() => {
      this.appConfigList = content
    })
  }

  /**
   * 获取当前服务下所有API列表信息
   */
  getAppApiList = async (appKey) => {
    this.isLoading = true
    const {
      success,
      content: {name, hosts, categories, apiPrefiies, apis, ctime, mtime},
    } = await io.getAppApiList({':appKey': appKey})
    this.isLoading = false
    if (!success) return
    runInAction(() => {
      this.apiList = apis
      this.appInfo = {name, hosts, apiPrefiies, categories, ctime, mtime}
      this.listToTree()
    })
  }

  /** 将数据转换成左侧树需要的结构 */
  listToTree() {
    // const newData = _.cloneDeep(this.apiList)
    const obj = {}
    this.appInfo.categories.forEach((item) => {
      obj[item.cateCode] = {
        title: item.name,
        key: item.cateCode,
        type: 'folder',
        children: [],
      }
    })
    const list = []
    this.apiList.forEach((item) => {
      list.push({title: item.name, key: item.apiId, type: 'api', path: item.path, description: item.description})

      if (obj[item.cateCode]) {
        obj[item.cateCode].children.push({
          title: item.name,
          key: item.apiId,
          type: 'api',
        })
      } else {
        obj[item.cateCode] = {
          title: '未知分类',
          key: item.cateCode,
          type: 'folder',
          children: [],
        }
        obj[item.cateCode].children.push({
          title: item.name,
          key: item.apiId,
          type: 'api',
        })
      }
    })
    this.list.replace(list)
    this.treeData.replace(_.values(obj))
  }

  addServiceCategory = async (value) => {
    if (this.appInfo.categories.some((item) => item.cateCode === value.cateCode)) {
      return message.warn('该分类Code已经存在')
    }
    const updateData = {
      category: {
        name: value.name,
        cateCode: value.cateCode,
      },
      ':appKey': this.appKey,
    }
    const {success, content} = await io.updateApp(updateData)
    if (!success) return

    runInAction(() => {
      message.success('新增分类成功')
      this.appInfo = content
    })
  }

  // 编辑类目
  editServiceCategory = async (params, cateCode) => {
    this.appInfo.categories.forEach((item) => {
      if (item.cateCode === cateCode) {
        item.name = params.name
      }
      delete item.type
    })
    const {success, content} = await io.updateApp({
      ':appKey': this.appKey,
      categories: this.appInfo.categories,
    })
    if (!success) return
    runInAction(() => {
      message.success('接口分类修改成功')
      this.appInfo = content
    })
  }

  // 删除
  deleteServiceCategory = async (cateCode) => {
    _.remove(this.appInfo.categories, (item) => item.cateCode === cateCode)
    const {success, content} = await io.updateApp({
      ':appKey': this.appKey,
      categories: this.appInfo.categories,
    })
    if (!success) return
    runInAction(() => {
      message.success('删除类目成功')
      this.appInfo = content
    })
  }

  addServiceHost = async (value) => {
    if (this.appInfo.hosts.some((item) => item.host === value.host)) {
      return message.warn('该主机Host已经存在')
    }
    const updateData = {
      host: {
        name: value.name,
        host: value.host,
      },
      ':appKey': this.appKey,
    }
    const {success, content} = await io.updateApp(updateData)
    if (!success) return

    runInAction(() => {
      message.success('新增主机配置成功')
      this.appInfo = content
    })
  }

  // 编辑类目
  editServiceHost = async (value, index) => {
    if (this.appInfo.hosts.some((item, idx) => item.host === value.host && index !== idx)) {
      return message.warn('该主机Host已经存在')
    }
    const item = this.appInfo.hosts.find((item, idx) => idx === index)

    item.host = value.host
    item.name = value.name
    delete item.type
    const {success, content} = await io.updateApp({
      ':appKey': this.appKey,
      hosts: this.appInfo.hosts,
    })
    if (!success) return
    runInAction(() => {
      message.success('修改主机配置成功')
      this.appInfo = content
    })
  }

  // 删除应用配置的主机
  deleteServiceHost = async (host) => {
    _.remove(this.appInfo.hosts, (item) => item.host === host)
    const {success, content} = await io.updateApp({
      ':appKey': this.appKey,
      hosts: this.appInfo.hosts,
    })
    if (!success) return
    runInAction(() => {
      message.success('删除主机配置成功')
      this.appInfo = content
    })
  }

  editServiceApiPrefix = async (newApiPrefiies) => {
    const {success, content} = await io.updateApp({
      ':appKey': this.appKey,
      apiPrefiies: newApiPrefiies,
    })
    if (!success) return
    runInAction(() => {
      message.success('操作成功')
      this.appInfo = content
    })
  }

  /** 获取单个API信息 */
  getApiDetail = async () => {
    const {success, content} = await io.getApiDetail({':appKey': this.appKey, ':apiId': this.apiId})
    if (!success) return
    runInAction(() => {
      // TODO 集成浏览器的本地存储
      this.apiDetail = content
      this.query = content.params
        .filter((item) => item.paramLocation === 'Query')
        .map((item) => {
          item.checked = true
          item.disabled = true
          return item
        })
      this.param = content.params
        .filter((item) => item.paramLocation === 'RouterParam')
        .map((item) => {
          item.checked = true
          item.disabled = item.isRequired
          return item
        })
      this.header = content.params
        .filter((item) => item.paramLocation === 'Header')
        .map((item) => {
          item.checked = true
          item.disabled = true
          return item
        })
      this.apiPrefix = content.apiPrefix || ''
      this.query.push({name: '', value: '', checked: true})
      this.header.push({name: '', value: '', checked: true})
      this.body = content.body
      this.defaultBody = content.body
      this.method = content.method
      this.isLoading = false
      this.testUseStorage()
      this.update()
    })
  }

  // 获取测试用例列表
  getTestCaseList = async () => {
    this.caseListLoading = true
    const {content: caseList, success} = await io.getTestCaseList({':appKey': this.appKey, ':apiId': this.apiId})
    if (!success) return
    runInAction(() => {
      this.caseList = caseList || []
      this.caseListLoading = false
    })
  }

  // 保存测试用例
  saveTestCase = async (name) => {
    const caseData = {
      ':appKey': this.appKey,
      ':apiId': this.apiId,
      name,
      params: {
        apiPrefix: this.apiPrefix,
        header: this.header,
        param: this.param,
        query: this.query,
        body: this.body,
      },
    }
    const {success, content} = await io.saveTestCase(caseData)
    if (!success) return
    message.success('新建成功')
    this.modalVisible.addCase = false
    runInAction(() => {
      this.caseList = content
    })
  }

  // 删除测试用例
  deleteCase = async (caseId) => {
    this.caseListLoading = true
    const {success, content} = await io.deleteCase({':appKey': this.appKey, ':apiId': this.apiId, ':caseId': caseId})
    this.caseListLoading = false
    if (!success) return
    runInAction(() => {
      this.caseList = content
    })
  }

  // 切换测试用例
  useCase = async (caseId) => {
    const caseData = this.caseList.find((item) => item.caseId === caseId)
    if (!caseData) return message.warn('用例数据没有找到')
    this.header = _.cloneDeep(caseData.params.header)
    this.defaultBody = caseData.params.body
    this.body = caseData.params.body
    this.apiPrefix = caseData.params.apiPrefix
    this.query = _.cloneDeep(caseData.params.query)
    caseData.params.param.forEach((item) => {
      const p = this.param.find((e) => e.name === item.name)
      if (p) p.value = item.value
    })
    this.update()
  }

  /** 测试接口信息 */
  testApi = async () => {
    const formatData = this.formatParams()
    if (!formatData) return
    this.isLoading = true
    const {query, body, headers, path} = formatData
    const reqData = {
      path,
      host: this.host,
      direct: !!this.host,
      method: this.method,
      headers,
      query,
      body,
    }
    const {success, content} = await io.testApi(reqData)
    this.isLoading = false
    if (!success) return
    if (content.headers['content-type'] && /^application\/json/.test(content.headers['content-type'].toLowerCase())) {
      try {
        content.body = JSON.stringify(JSON.parse(content.body), null, '\t')
      } catch (e) {}
    }
    this.result = content
    this.update()
  }

  // 测试校验参数
  formatParams() {
    let path = this.apiPrefix + this.apiDetail.path
    const query = {}
    let body = this.body
    const headers = {}
    let hasError = false
    this.param.forEach((item) => {
      const value = item.value.trim()
      if (value === '') {
        message.error(`路由参数 ${item.name} 未设置`)
        return (hasError = true)
      }
      path = path.replace(item.name, encodeURIComponent(item.value))
    })
    this.query.forEach((item) => {
      item.name = item.name.trim()
      if (item.checked && item.name !== '') {
        item.value = item.value.trim()
        if (item.isRequired && item.value === '') {
          message.error(`Query 参数 ${item.name} 未设置`)
          return (hasError = true)
        }
        if (typeof query[item.name] === 'string') {
          query[item.name] = [query[item.name], item.value]
        } else if (typeof query[item.name] === 'undefined') {
          query[item.name] = item.value
        } else {
          query[item.name].push(item.value)
        }
      }
    })
    this.header.forEach((item) => {
      item.name = item.name.trim()
      item.value = item.value.trim()
      if (item.checked && item.name !== '') {
        if (item.isRequired && item.value === '') {
          message.error(`Header 参数 ${item.name} 未设置`)
          return (hasError = true)
        }
        if (item.value !== '') {
          headers[item.name] = item.value
        }
      }
    })
    if (['POST', 'PUT', 'DELETE'].indexOf(this.method.toUpperCase()) >= 0) {
      try {
        body = JSON.parse(body)
        if (!_.isObject(body)) {
          message.error('请求body不规范')
          hasError = true
        }
      } catch (e) {
        message.error('请求body不规范')
        hasError = true
      }
    }
    if (hasError) return false
    return {query, body, headers, path}
  }

  saveApi = async (apiData) => {
    this.isLoading = true
    apiData[':appKey'] = this.appKey
    let retData
    if (this.editApi) {
      apiData[':apiId'] = this.apiId
      retData = await io.updateApi(apiData)
    } else {
      retData = await io.addApi(apiData)
    }
    if (!retData.success) return
    this.editApi = false
    this.isLoading = false
    await this.getAppApiList()
    history.push(`${config.pathPrefix}/app/${this.appKey}/apis/${retData.content.apiId}`)
  }

  deleteApi = async () => {
    const {success} = await io.deleteApi({':appKey': this.appKey, ':apiId': this.apiId})
    if (success) {
      message.success('删除成功')
      await this.getAppApiList()
      history.push(`${config.pathPrefix}/app/${this.appKey}/apis/index`)
    }
  }

  /** 组件销毁时清理数据 */
  clean() {
    this.currentServiceCode = ''
    this.isLoading = false
    this.apiList = []
    this.list.replace([])
    this.treeData.replace([])
  }

  resetStorage() {
    const data = this.globalConfig.filter((item) => {
      return !!item.name
    })
    storage.set('globalConfig', JSON.stringify(data))
    this.testUseStorage()
  }

  // 使用全局缓存
  testUseStorage() {
    const data = this.globalConfig.filter((item) => {
      return !!item.name && item.checked
    })
    data.forEach((item) => {
      if (item.paramLocation === 'Query') {
        const i = this.query.find((i) => i.name === item.name)
        if (i) {
          i.value = item.value
        } else {
          this.query.push({
            name: item.name,
            value: item.value,
            checked: true,
          })
        }
      } else if (item.paramLocation === 'Header') {
        const i = this.header.find((i) => i.name === item.name)
        if (i) {
          i.value = item.value
        } else {
          this.header.unshift({
            name: item.name,
            value: item.value,
            checked: true,
          })
        }
      }
    })
  }

  setValue(key, value) {
    switch (key) {
      case 'appConfigList':
        this.appConfigList = value
        break
      case 'appInfo':
        this.appInfo = value
        break
      case 'apiId':
        this.apiId = value
        break
      case 'appKey':
        this.appKey = value
        break
      case 'editApi':
        this.editApi = value
        break
      case 'appCateVisible':
        this.appCateVisible = value
        break
      case 'appHostVisible':
        this.appHostVisible = value
        break
      case 'treeData':
        this.treeData = value
        break
      case 'apiDetail':
        this.apiDetail = value
        break
      case 'newApiData':
        this.newApiData = value
        break
      case 'apiPrefix':
        this.apiPrefix = value
        break
      case 'host':
        this.host = value
        break
      case 'defaultBody':
        this.defaultBody = value
        break
      case 'body':
        this.body = value
        break
      case 'method':
        this.method = value
        break
      case 'query':
        this.query = value
        break
      case 'param':
        this.param = value
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

export default ApiTestStore
