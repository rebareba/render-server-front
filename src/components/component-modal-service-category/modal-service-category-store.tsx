import {observable, runInAction, action} from 'mobx'
import {message} from 'antd'
import _ from 'lodash'
import io from '@src/pages/app-api/io'

class AppCategoryStore {
  constructor(rootStore = '') {
    this.rootStore = rootStore
  }

  @observable serviceCode = ''

  @observable visible = false

  @observable isLoading = true

  @observable categoryList = []

  @action.bound toggleModal(key, status = 'show', appDetail) {
    this.modalVisible[key] = status === 'show'
    if (appDetail) {
      this.currentApp = _.cloneDeep(appDetail)
    }
  }

  // 获取服务类目列表
  @action.bound async getServiceCategoryList() {
    try {
      this.isLoading = true
      const {content} = await io.category.getServiceCategoryList({
        query: {serviceCode: this.serviceCode},
      })
      runInAction(() => {
        this.categoryList.replace(content)
        this.isLoading = false
      })
    } catch (e) {
      message.error(e.message)
    }
  }

  // 新增类目
  @action.bound async addServiceCategory(params) {
    try {
      await io.category.addServiceCategory({
        body: {
          serviceCode: this.serviceCode,
          cateName: params.cateName,
          cateCode: params.cateCode,
        },
      })
      runInAction(() => {
        message.success('服务类目添加成功')
        return this.getServiceCategoryList()
      })
    } catch (e) {
      message.error(e.message)
    }
  }

  // 删除类目
  @action.bound async deleteServiceCategory(cateCode) {
    try {
      await io.category.deleteServiceCategory({
        params: {cateCode: cateCode},
        query: {serviceCode: this.serviceCode},
      })
      runInAction(() => {
        message.success('服务类目删除成功')
        return this.getServiceCategoryList()
      })
    } catch (e) {
      message.error(e.message)
    }
  }

  // 编辑类目
  @action.bound async editServiceCategory(params, cateCode) {
    try {
      await io.category.editServiceCategory({
        params: {cateCode: cateCode},
        body: {
          cateName: params.cateName,
          serviceCode: this.serviceCode,
        },
      })
      runInAction(() => {
        message.success('服务类目修改成功')
        return this.getServiceCategoryList()
      })
    } catch (e) {
      message.error(e.message)
    }
  }
}

export default AppCategoryStore
