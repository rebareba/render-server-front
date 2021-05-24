import React, {useEffect} from 'react'
import {toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Table, Icon, Button, Modal, Spin, Form, Input} from 'antd'
import InfoBox, {BoxItem} from '@components/component-info-box'
import _ from 'lodash'
import AppCategoryModal from './app-modal-category'
import AppHostModal from './app-modal-host'

const FormItem = Form.Item

const AppContent = ({store}) => {
  const [form] = Form.useForm()
  // 删除前缀
  const deleteApiPrefix = async (record) => {
    _.remove(store.appInfo.apiPrefiies, (item) => item === record)

    await store.editServiceApiPrefix(store.appInfo.apiPrefiies)
  }
  useEffect(() => {
    store.getList()
  }, [])
  const categoryColumns = [
    {title: '类目名称', dataIndex: 'name', key: 'name'},
    {title: '类目Code', dataIndex: 'cateCode', key: 'cateCode'},
  ]
  const hostColumns = [
    {title: '主机名称', dataIndex: 'name', key: 'name'},
    {title: '主机地址', dataIndex: 'host', key: 'host'},
  ]
  const appApiPrefixColumns = [
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
            <button type="button" className="button-style" onClick={() => deleteApiPrefix(record)}>
              删除
            </button>
          </div>
        )
      },
    },
  ]

  // 新增前缀
  const addApiPrefix = async () => {
    const {validateFields} = form

    validateFields(async (err, values) => {
      if (!err) {
        store.appInfo.apiPrefiies.push(values.apiPrefix)
        await store.editServiceApiPrefix(store.appInfo.apiPrefiies)
        store.setValue('apiPrefixVisible', false)
      }
    })
  }

  const handleCancel = () => {
    store.apiPrefixVisible = false
  }

  // 编辑 设置编辑的visible属性
  const handleEdit = (flag) => {
    store.setValue(flag, true)
  }

  const appInfo = toJS(store.appInfo)
  const {appConfigList} = store
  let appConfig = toJS(appConfigList).find((config) => {
    return store.appKey === config.key
  })
  appConfig = appConfig || {config: {}}
  const tableCategoryProps = {
    columns: categoryColumns,
    rowKey: 'cateCode',
    bordered: true,
    pagination: false,
    size: 'small',
    dataSource: [...appInfo.categories],
  }
  const tableHostProps = {
    columns: hostColumns,
    rowKey: 'host',
    bordered: true,
    pagination: false,
    size: 'small',
    dataSource: [...appInfo.hosts],
  }
  const tableApiPrefixProps = {
    columns: appApiPrefixColumns,
    rowKey: 'host',
    bordered: true,
    pagination: false,
    size: 'small',
    dataSource: [...appInfo.apiPrefiies],
  }
  const modalProps = {
    title: '添加接口前缀',
    visible: store.apiPrefixVisible,
    onCancel: handleCancel,
    onOk: addApiPrefix,
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
    <div className="fb1 fbh fbj" style={{overflowY: 'auto', overflowX: 'hidden'}}>
      <div className="test-content ml10 fb1 edit-table">
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
              <Button type="ghost" size="small" onClick={() => handleEdit('appCateVisible')}>
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
              <Button type="ghost" size="small" onClick={() => handleEdit('appHostVisible')}>
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
              <Button type="ghost" size="small" onClick={() => handleEdit('apiPrefixVisible')}>
                <Icon type="edit" /> 新增
              </Button>
            }
            type="table"
          >
            <Table {...tableApiPrefixProps} />
          </InfoBox>
          <Modal {...modalProps}>
            <Form form={form}>
              <FormItem
                name="apiPrefix"
                {...formItemLayout}
                label="接口前缀"
                hasFeedback
                {...{
                  rules: [
                    {required: true, message: '必须填写'},
                    {pattern: /^\/[a-zA-Z0-9]*[a-zA-Z0-9-]$/, message: '接口前缀格式不对'},
                  ],
                }}
              >
                <Input placeholder="必须/开头" />
              </FormItem>
            </Form>
          </Modal>
        </Spin>
      </div>
    </div>
  )
}

export default inject('globalStore')(observer(AppContent))
