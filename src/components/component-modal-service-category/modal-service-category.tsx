import React, {Component} from 'react'
import {Modal, Table, Button, Input} from 'antd'
import {Form} from '@ant-design/compatible'
import {observable, action, autorun, computed} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'

const FormItem = Form.Item

@observer
class AppCategoryModal extends Component {
  constructor(props) {
    super()
    this.store = props.store
    const {getFieldDecorator} = props.form
    this.categoryColumns = [
      {
        title: '类目名称',
        dataIndex: 'cateName',
        key: 'cateName',
        render: (text, record) => {
          if (record.type === 'add' || record.type === 'edit') {
            return (
              <FormItem>
                {getFieldDecorator('cateName', {
                  rules: [{required: true, message: '类目名称不能为空'}],
                  initialValue: record.type === 'edit' ? record.cateName : '',
                })(<Input placeholder="请输入新类目名称" />)}
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
              <FormItem>
                {getFieldDecorator('cateCode', {
                  rules: [{required: true, message: '类目code不能为空'}],
                })(<Input placeholder="请输入新类目code" />)}
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
        width: '120',
        render: (text, record) => {
          if (record.type === 'add') {
            return (
              <div>
                <button className="button-style" onClick={() => this.handleAddCategory('add')}>
                  添加
                </button>
                <button className="button-style" onClick={() => this.handleAddCategory('cancel')}>
                  取消
                </button>
              </div>
            )
          } else if (record.type === 'edit') {
            return (
              <div>
                <button className="button-style" onClick={() => this.handleEditCategory('edit', record.cateCode)}>
                  保存修改
                </button>
                <button className="button-style" onClick={() => this.handleEditCategory('cancel', record.cateCode)}>
                  取消
                </button>
              </div>
            )
          }

          return (
            <div>
              <button className="button-style" onClick={() => this.handleEdit(record.cateCode)}>
                编辑
              </button>
              <button className="button-style" onClick={() => this.store.deleteServiceCategory(record.cateCode)}>
                删除
              </button>
            </div>
          )
        },
      },
    ]
    this.disposer = autorun(() => {
      if (this.store.visible) {
        this.store.getServiceCategoryList()
      }
    })
  }

  @observable updateKey = ''

  @observable isEditing = false

  /** 当前是否已经处于添加状态，是的话新增按钮置灰 */
  @computed get hasAddItem() {
    return this.store.categoryList.some((item) => item.type === 'add') || this.isEditing
  }

  componentWillUnmount() {
    this.disposer()
  }

  /** if中方法是用于在新建API的时候，关闭modal框需要重新去请求一下类目数据，以保证数据同步 */
  @action.bound handleOnCancel() {
    this.store.visible = false
    if (this.store.rootStore.backAction) {
      this.store.rootStore.backAction()
    }
  }

  @action.bound addCategory() {
    this.store.categoryList.push({name: '', code: '', type: 'add'})
  }

  @action.bound handleAddCategory(actionType = 'add') {
    const {validateFields} = this.props.form
    if (actionType === 'add') {
      validateFields((err, values) => {
        if (!err) {
          this.store.addServiceCategory(values)
        }
      })
    } else {
      _.remove(this.store.categoryList, (item) => item.type === 'add')
    }
  }

  @action.bound handleEditCategory(actionType = 'edit', cateCode) {
    const {validateFields} = this.props.form
    if (actionType === 'edit') {
      validateFields((err, values) => {
        if (!err) {
          // console.log('-----edit', values, cateCode)
          this.store.editServiceCategory(values, cateCode)
          this.isEditing = false
        }
      })
    } else {
      const keyItem = this.store.categoryList.find((item) => item.cateCode === cateCode)
      keyItem.type = ''
      this.isEditing = false
      this.updateKey = Math.random()
    }
  }

  @action.bound handleEdit(cateCode) {
    if (this.hasAddItem) return
    const keyItem = this.store.categoryList.find((item) => item.cateCode === cateCode)
    keyItem.type = 'edit'
    this.isEditing = true
    this.updateKey = Math.random()
  }

  render() {
    if (!this.store.visible) {
      return null
    }

    const modalProps = {
      title: '应用类目',
      visible: this.store.visible,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnCancel,
      className: 'app-category-modal',
      key: this.store.visible,
      maskClosable: false,
      footer: (
        <Button disabled={this.hasAddItem} size="large" onClick={this.addCategory} type="primary">
          新建类目
        </Button>
      ),
    }

    const tableProps = {
      columns: this.categoryColumns,
      rowKey: 'cateCode',
      loading: this.store.isLoading,
      bordered: true,
      dataSource: this.store.categoryList.slice(),
      pagination: false,
    }

    return (
      <Modal {...modalProps} data-update={this.updateKey}>
        <Table {...tableProps} />
      </Modal>
    )
  }
}

export default Form.create()(AppCategoryModal)
