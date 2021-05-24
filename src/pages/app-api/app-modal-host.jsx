import {useState, useEffect} from 'react'
import {Modal, Table, Button, Input, Form} from 'antd'
import {toJS} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'

const FormItem = Form.Item

const AppHostModal = ({store}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (form) form.resetFields()
  }, [])

  const [updateKey, setUpdateKey] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  /** 当前是否已经处于添加状态，是的话新增按钮置灰 */
  const hasAddItem = () => {
    return store.appInfo.hosts.some((item) => item.type === 'add') || isEditing
  }

  /** if中方法是用于在新建API的时候，关闭modal框需要重新去请求一下主机数据，以保证数据同步 */
  const handleOnCancel = () => {
    store.appHostVisible = false
    _.remove(store.appInfo.hosts, (item) => item.type === 'add')
  }

  const addHost = () => {
    store.appInfo.hosts.push({name: '', host: '', type: 'add'})
  }

  const handleAddHost = (actionType = 'add') => {
    const {validateFields} = form
    if (actionType === 'add') {
      validateFields((err, values) => {
        if (!err) {
          store.addServiceHost(values)
        }
      })
    } else {
      _.remove(store.appInfo.hosts, (item) => item.type === 'add')
    }
  }

  const handleEditHost = (actionType = 'edit', index) => {
    const {validateFields} = form
    if (actionType === 'edit') {
      validateFields((err, values) => {
        if (!err) {
          // console.log('-----edit', values, cateCode)
          store.editServiceHost(values, index)
          setIsEditing(true)
        }
      })
    } else {
      const keyItem = store.appInfo.hosts[index]
      if (keyItem) delete keyItem.type
      setIsEditing(false)
      setUpdateKey(Math.random())
    }
  }

  const handleEdit = (host) => {
    if (hasAddItem) return
    const keyItem = store.appInfo.hosts.find((item) => item.host === host)
    keyItem.type = 'edit'
    setIsEditing(true)
    setUpdateKey(Math.random())
  }

  if (!store.appHostVisible) {
    return null
  }
  const hostColumns = [
    {
      title: '主机名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.type === 'add' || record.type === 'edit') {
          return (
            <FormItem
              name="name"
              {...{
                rules: [{required: true, message: '主机名称不能为空'}],
                initialValue: record.type === 'edit' ? record.name : '',
              }}
            >
              <Input placeholder="请输入新主机名称" />
            </FormItem>
          )
        }
        return text
      },
    },
    {
      title: '主机地址',
      dataIndex: 'host',
      key: 'host',
      render: (text, record) => {
        if (record.type === 'add' || record.type === 'edit') {
          return (
            <FormItem
              name="host"
              {...{
                rules: [
                  {required: true, message: '主机code不能为空'},
                  {pattern: /^(http:\/\/|https:\/\/)\w+/, message: '必须以 http:// 或者https://开头'},
                ],
                initialValue: record.type === 'edit' ? record.host : '',
              }}
            >
              <Input width="100" placeholder="请输入Host地址(注意加端口号)" />
            </FormItem>
          )
        }
        return text
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        if (record.type === 'add') {
          return (
            <div style={{marginRight: 0, width: 115}}>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleAddHost('add')}>
                添加
              </Button>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleAddHost('cancel')}>
                取消
              </Button>
            </div>
          )
        }
        if (record.type === 'edit') {
          return (
            <div style={{marginRight: 0, width: 115}}>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleEditHost('edit', index)}>
                保存修改
              </Button>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleEditHost('cancel', index)}>
                取消
              </Button>
            </div>
          )
        }

        return (
          <div>
            <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleEdit(record.host)}>
              编辑
            </Button>
            <Button className="ml4 mr4" type="ghost" size="small" onClick={() => store.deleteServiceHost(record.host)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const modalProps = {
    title: '后端主机配置',
    visible: store.appHostVisible,
    onCancel: handleOnCancel,
    onOk: handleOnCancel,
    className: 'app-host-modal',
    key: 'host',
    maskClosable: false,
    footer: (
      <Button disabled={hasAddItem} size="normal" onClick={addHost} type="primary">
        新建主机
      </Button>
    ),
  }

  const tableProps = {
    columns: hostColumns,
    rowKey: 'host',
    loading: store.isLoading,
    bordered: true,
    className: 'edit-table',
    dataSource: toJS(store.appInfo.hosts),
    pagination: false,
  }

  return (
    <Modal {...modalProps} data-update={updateKey}>
      <Form form={form}>
        <Table {...tableProps} />
      </Form>
    </Modal>
  )
}

export default observer(AppHostModal)
