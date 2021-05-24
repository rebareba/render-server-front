import {useEffect, useState} from 'react'
import {Modal, Table, Button, Input, Form} from 'antd'
import {autorun, toJS} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'

const FormItem = Form.Item

const AppCategoryModal = ({store}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (form) form.resetFields()
    const disposer = autorun(() => {
      if (store.visible) {
        store.getServiceCategoryList()
      }
    })
    return () => {
      disposer()
    }
  }, [])

  const [updateKey, setUpdateKey] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  /** 当前是否已经处于添加状态，是的话新增按钮置灰 */
  const hasAddItem = () => {
    return store.appInfo.categories.some((item) => item.type === 'add') || isEditing
  }

  /** if中方法是用于在新建API的时候，关闭modal框需要重新去请求一下类目数据，以保证数据同步 */
  const handleOnCancel = () => {
    store.appCateVisible = false
    _.remove(store.appInfo.categories, (item) => item.type === 'add')
  }

  const addCategory = () => {
    store.appInfo.categories.push({name: '', cateCode: '', type: 'add'})
  }

  const handleAddCategory = (actionType = 'add') => {
    const {validateFields} = form
    if (actionType === 'add') {
      validateFields((err, values) => {
        if (!err) {
          store.addServiceCategory(values)
        }
      })
    } else {
      _.remove(store.appInfo.categories, (item) => item.type === 'add')
    }
  }

  const handleEditCategory = (actionType = 'edit', cateCode) => {
    const {validateFields} = form
    if (actionType === 'edit') {
      validateFields((err, values) => {
        if (!err) {
          // console.log('-----edit', values, cateCode)
          store.editServiceCategory(values, cateCode)
          setIsEditing(false)
        }
      })
    } else {
      const keyItem = store.appInfo.categories.find((item) => item.cateCode === cateCode)
      if (keyItem) delete keyItem.type
      setIsEditing(false)
      setUpdateKey(Math.random())
    }
  }

  const handleEdit = (cateCode) => {
    if (hasAddItem()) return
    const keyItem = store.appInfo.categories.find((item) => item.cateCode === cateCode)
    keyItem.type = 'edit'

    setIsEditing(true)
    setUpdateKey(Math.random())
  }

  if (!store.appCateVisible) {
    return null
  }
  const categoryColumns = [
    {
      title: '类目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.type === 'add' || record.type === 'edit') {
          return (
            <FormItem
              name="name"
              {...{
                rules: [{required: true, message: '类目名称不能为空'}],
                initialValue: record.type === 'edit' ? record.name : '',
              }}
            >
              <Input placeholder="请输入新类目名称" />
            </FormItem>
          )
        }
        return text
      },
    },
    {
      title: '类目code',
      dataIndex: 'cateCode',
      key: 'cateCode',
      render: (text, record) => {
        if (record.type === 'add') {
          return (
            <FormItem
              name="cateCode"
              {...{
                rules: [
                  {required: true, message: '类目code不能为空'},
                  {pattern: /[a-z0-9A-Z-_/]+/i, message: '字母数字下划线'},
                ],
              }}
            >
              <Input width="100" placeholder="请输入新类目code" />
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
      render: (text, record) => {
        if (record.type === 'add') {
          return (
            <div style={{marginRight: 0, width: 115}}>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleAddCategory('add')}>
                添加
              </Button>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleAddCategory('cancel')}>
                取消
              </Button>
            </div>
          )
        }
        if (record.type === 'edit') {
          return (
            <div>
              <Button
                className="ml4 mr4"
                type="ghost"
                size="small"
                onClick={() => handleEditCategory('edit', record.cateCode)}
              >
                保存修改
              </Button>
              <Button
                className="ml4 mr4"
                type="ghost"
                size="small"
                onClick={() => handleEditCategory('cancel', record.cateCode)}
              >
                取消
              </Button>
            </div>
          )
        }

        return (
          <div>
            <Button className="ml4 mr4" type="ghost" size="small" onClick={() => handleEdit(record.cateCode)}>
              编辑
            </Button>
            <Button
              className="ml4 mr4"
              type="ghost"
              size="small"
              onClick={() => store.deleteServiceCategory(record.cateCode)}
            >
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const modalProps = {
    title: '接口分类',
    visible: store.appCateVisible,
    onCancel: handleOnCancel,
    onOk: handleOnCancel,
    className: 'app-category-modal',
    key: store.visible,
    maskClosable: false,
    footer: (
      <Button disabled={hasAddItem()} size="normal" onClick={addCategory} type="primary">
        新建类目
      </Button>
    ),
  }

  const tableProps = {
    columns: categoryColumns,
    rowKey: 'cateCode',
    loading: store.isLoading,
    bordered: true,
    className: 'edit-table',
    dataSource: toJS(store.appInfo.categories),
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

export default observer(AppCategoryModal)
