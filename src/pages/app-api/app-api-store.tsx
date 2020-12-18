import {observable, action, runInAction, toJS} from 'mobx'
import {message} from 'antd'
import _, {join} from 'lodash'
import io from './io'
import {history, config} from '@src/common/utils'
import storage from '@src/common/storage'

class ApiTestStore {
  // 应用相关
  @observable appInfo = {name: '', hosts: [], categories: [], apiPrefiies: [], ctime: '', mtime: ''}
  @observable apiId = 'index'
  @observable appKey = ''
  @observable editApi = false
  // 应用分类编辑
  @observable appCateVisible = false
  @observable appHostVisible = false
  @observable apiPrefixVisible = false
  // 侧边栏
  @observable apiList = []
  @observable list = []
  @observable treeData = []
  // 接口相关
  @observable apiDetail = {}
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
  @observable apiPrefix
  @observable host
  @observable defaultBody = ''
  body: any = ''
  method = 'GET'
  param: any = []
  query: any = []
  // 是否直接测试，还是通过Render-Server转发
  direct = false
  header = [{name: '', value: ''}]
  result = {headers: {}, body: '', status: '-'}
  // 测试用例相关
  @observable caseList = []
  @observable caseListLoading = false
  @observable selectedCaseId = ''
  @observable showCase = true
  @observable modalVisible = {
    addCase: false,
    editCase: false,
  }
  // 其他
  @observable updateKey = ''
  @observable isLoading = false
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
  }
  // 处理数据变化的页面响应
  @action.bound update() {
    this.updateKey = Math.random()
  }
  /**
   * 获取当前服务下所有API列表信息
   */
  @action.bound async getAppApiList() {
    this.isLoading = true
    const {
      success,
      content: {name, hosts, categories, apiPrefiies, apis, ctime, mtime},
    } = await io.getAppApiList({':appKey': this.appKey})
    this.isLoading = false
    if (!success) return
    runInAction(() => {
      this.apiList = apis
      this.appInfo = {name, hosts, apiPrefiies, categories, ctime, mtime}
      this.listToTree()
    })
  }

  /** 将数据转换成左侧树需要的结构 */
  @action.bound listToTree() {
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

  @action.bound async addServiceCategory(value) {
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
  @action.bound async editServiceCategory(params, cateCode) {
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
  @action.bound async deleteServiceCategory(cateCode) {
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
  @action.bound async addServiceHost(value) {
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
  @action.bound async editServiceHost(value, index) {
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
  @action.bound async deleteServiceHost(host) {
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
  @action.bound async editServiceApiPrefix(newApiPrefiies) {
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
  @action.bound async getApiDetail() {
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
  @action.bound async getTestCaseList() {
    this.caseListLoading = true
    const {content: caseList, success} = await io.getTestCaseList({':appKey': this.appKey, ':apiId': this.apiId})
    if (!success) return
    runInAction(() => {
      this.caseList = caseList || []
      this.caseListLoading = false
    })
  }

  // 保存测试用例
  @action.bound async saveTestCase(name) {
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
  @action.bound async deleteCase(caseId) {
    this.caseListLoading = true
    const {success, content} = await io.deleteCase({':appKey': this.appKey, ':apiId': this.apiId, ':caseId': caseId})
    this.caseListLoading = false
    if (!success) return
    runInAction(() => {
      this.caseList = content
    })
  }
  // 切换测试用例
  @action.bound async useCase(caseId) {
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
  @action.bound async testApi() {
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

  @action.bound async saveApi(apiData) {
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
  @action.bound async deleteApi() {
    const {success} = await io.deleteApi({':appKey': this.appKey, ':apiId': this.apiId})
    if (success) {
      message.success('删除成功')
      await this.getAppApiList()
      history.push(`${config.pathPrefix}/app/${this.appKey}/apis/index`)
    }
  }
  /** 组件销毁时清理数据 */
  @action.bound clean() {
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
}

export default ApiTestStore
