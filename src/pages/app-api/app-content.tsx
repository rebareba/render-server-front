import React, {Component} from 'react'
import {observable, action, computed, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Form} from '@ant-design/compatible'
import {Table, Icon, Button, AutoComplete, message, Modal, Spin, Tabs, Input} from 'antd'
import InfoBox, {BoxItem} from '@src/components/component-info-box'
import AppCategoryModal from './app-modal-category'
import _ from 'lodash'
import AppHostModal from './app-modal-host'
const FormItem = Form.Item
@inject('globalStore')
@observer
class AppContent extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.categoryColumns = [
      {title: '类目名称', dataIndex: 'name', key: 'name'},
      {title: '类目Code', dataIndex: 'cateCode', key: 'cateCode'},
    ]
    this.hostColumns = [
      {title: '主机名称', dataIndex: 'name', key: 'name'},
      {title: '主机地址', dataIndex: 'host', key: 'host'},
    ]
    this.appApiPrefixColumns = [
      {
        title: '前缀',
        key: 'prefix',
        render: (text, record) => {
          return record
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '20%',
        render: (text, record) => {
          return (
            <div>
              <button className="button-style" onClick={() => this.deleteApiPrefix(record)}>
                删除
              </button>
            </div>
          )
        },
      },
    ]
  }
  // 删除前缀
  async deleteApiPrefix(record) {
    const {store} = this.props
    _.remove(store.appInfo.apiPrefiies, (item) => item === record)

    await store.editServiceApiPrefix(store.appInfo.apiPrefiies)
  }
  // 新增前缀
  @action.bound
  async addApiPrefix() {
    const {validateFields} = this.props.form

    validateFields(async (err, values) => {
      if (!err) {
        const {store} = this.props
        store.appInfo.apiPrefiies.push(values.apiPrefix)
        await store.editServiceApiPrefix(store.appInfo.apiPrefiies)
        this.props.store.apiPrefixVisible = false
      }
    })
  }
  @action.bound handleCancel() {
    this.props.store.apiPrefixVisible = false
  }

  async componentDidMount() {
    await this.props.globalStore.getList()
  }
  // 编辑 设置编辑的visible属性
  @action.bound handleEdit = (flag: string) => {
    this.props.store[flag] = true
  }
  render() {
    const {store} = this.props
    const {getFieldDecorator} = this.props.form
    const appInfo = toJS(store.appInfo)
    const {appConfigList} = this.props.globalStore
    let appConfig = toJS(appConfigList).find((config: any) => {
      return store.appKey === config.key
    })
    appConfig = appConfig || {config: {}}
    const tableCategoryProps = {
      columns: this.categoryColumns,
      rowKey: 'cateCode',
      bordered: true,
      pagination: false,
      size: 'small',
      dataSource: [...appInfo.categories],
    }
    const tableHostProps = {
      columns: this.hostColumns,
      rowKey: 'host',
      bordered: true,
      pagination: false,
      size: 'small',
      dataSource: [...appInfo.hosts],
    }
    const tableApiPrefixProps = {
      columns: this.appApiPrefixColumns,
      rowKey: 'host',
      bordered: true,
      pagination: false,
      size: 'small',
      dataSource: [...appInfo.apiPrefiies],
    }
    const modalProps = {
      title: '添加接口前缀',
      visible: store.apiPrefixVisible,
      onCancel: this.handleCancel,
      onOk: this.addApiPrefix,
      className: 'create-app-modal modal-new-style',
      key: 'apiPrefixAdd',
      maskClosable: false,
      width: 390,
    }

    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 15},
      colon: false,
    }
    return (
      <div className="FB1 FBH FBJ" style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <div className="test-content ml10 FB1 edit-table">
          <AppCategoryModal store={store} />
          <AppHostModal store={store} />
          <Spin spinning={store.isLoading}>
            <InfoBox title="服务基本信息">
              <div>
                <BoxItem label="服务名称:" value={appConfig.config.name} />
                <BoxItem label="服务描述:" value={appConfig.config.description} />
                <BoxItem label="创建时间:" value={appInfo.ctime} />
                <BoxItem label="上次修改时间:" value={appInfo.mtime} />
              </div>
            </InfoBox>
            <InfoBox
              title="接口分类信息"
              extra={
                <Button type="ghost" size="small" onClick={() => this.handleEdit('appCateVisible')}>
                  <Icon type="edit" /> 修改
                </Button>
              }
              type="table"
            >
              <Table {...tableCategoryProps} />
            </InfoBox>
            <InfoBox
              title="接口测试主机配置"
              extra={
                <Button type="ghost" size="small" onClick={() => this.handleEdit('appHostVisible')}>
                  <Icon type="edit" /> 修改
                </Button>
              }
              type="table"
            >
              <Table {...tableHostProps} />
            </InfoBox>
            <InfoBox
              title="接口路由前缀配置"
              extra={
                <Button type="ghost" size="small" onClick={() => this.handleEdit('apiPrefixVisible')}>
                  <Icon type="edit" /> 新增
                </Button>
              }
              type="table"
            >
              <Table {...tableApiPrefixProps} />
            </InfoBox>
            <Modal {...modalProps}>
              <Form>
                <FormItem {...formItemLayout} label="接口前缀" hasFeedback>
                  {getFieldDecorator('apiPrefix', {
                    rules: [
                      {required: true, message: '必须填写'},
                      {pattern: /^\/[a-zA-Z0-9-\/]*[a-zA-Z0-9-]$/, message: '接口前缀格式不对'},
                    ],
                  })(<Input placeholder="必须/开头" />)}
                </FormItem>
              </Form>
            </Modal>
          </Spin>
        </div>
      </div>
    )
  }
}

export default Form.create()(AppContent)
