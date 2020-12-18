import {Component} from 'react'
import {Modal, Table, Button, Input} from 'antd'
import {Form} from '@ant-design/compatible'
import {observable, action, autorun, computed, toJS} from 'mobx'
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
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          if (record.type === 'add' || record.type === 'edit') {
            return (
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '类目名称不能为空'}],
                  initialValue: record.type === 'edit' ? record.name : '',
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
        render: (text, record, index) => {
          if (record.type === 'add') {
            return (
              <FormItem>
                {getFieldDecorator('cateCode', {
                  rules: [
                    {required: true, message: '类目code不能为空'},
                    {pattern: /[a-z0-9A-Z-_/]+/i, message: '字母数字下划线'},
                  ],
                })(<Input width="100" placeholder="请输入新类目code" />)}
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
                <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleAddCategory('add')}>
                  添加
                </Button>
                <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleAddCategory('cancel')}>
                  取消
                </Button>
              </div>
            )
          } else if (record.type === 'edit') {
            return (
              <div>
                <Button
                  className="ml4 mr4"
                  type="ghost"
                  size="small"
                  onClick={() => this.handleEditCategory('edit', record.cateCode)}
                >
                  保存修改
                </Button>
                <Button
                  className="ml4 mr4"
                  type="ghost"
                  size="small"
                  onClick={() => this.handleEditCategory('cancel', record.cateCode)}
                >
                  取消
                </Button>
              </div>
            )
          }

          return (
            <div>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleEdit(record.cateCode)}>
                编辑
              </Button>
              <Button
                className="ml4 mr4"
                type="ghost"
                size="small"
                onClick={() => this.store.deleteServiceCategory(record.cateCode)}
              >
                删除
              </Button>
            </div>
          )
        },
      },
    ]
  }

  @observable updateKey = ''

  @observable isEditing = false

  /** 当前是否已经处于添加状态，是的话新增按钮置灰 */
  @computed get hasAddItem() {
    return this.store.appInfo.categories.some((item) => item.type === 'add') || this.isEditing
  }

  componentWillMount() {
    this.disposer = autorun(() => {
      if (this.store.visible) {
        this.store.getServiceCategoryList()
      }
    })
  }

  componentWillUnmount() {
    this.disposer()
  }

  /** if中方法是用于在新建API的时候，关闭modal框需要重新去请求一下类目数据，以保证数据同步 */
  @action.bound handleOnCancel() {
    this.store.appCateVisible = false
    _.remove(this.store.appInfo.categories, (item) => item.type === 'add')
  }

  @action.bound addCategory() {
    this.store.appInfo.categories.push({name: '', cateCode: '', type: 'add'})
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
      _.remove(this.store.appInfo.categories, (item) => item.type === 'add')
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
      const keyItem = this.store.appInfo.categories.find((item) => item.cateCode === cateCode)
      if (keyItem) delete keyItem.type
      this.isEditing = false
      this.updateKey = Math.random()
    }
  }

  @action.bound handleEdit(cateCode) {
    if (this.hasAddItem) return
    const keyItem = this.store.appInfo.categories.find((item) => item.cateCode === cateCode)
    keyItem.type = 'edit'
    this.isEditing = true
    this.updateKey = Math.random()
  }

  render() {
    if (!this.store.appCateVisible) {
      return null
    }

    const modalProps = {
      title: '接口分类',
      visible: this.store.appCateVisible,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnCancel,
      className: 'app-category-modal',
      key: this.store.visible,
      maskClosable: false,
      footer: (
        <Button disabled={this.hasAddItem} size="normal" onClick={this.addCategory} type="primary">
          新建类目
        </Button>
      ),
    }

    const tableProps = {
      columns: this.categoryColumns,
      rowKey: 'cateCode',
      loading: this.store.isLoading,
      bordered: true,
      className: 'edit-table',
      dataSource: toJS(this.store.appInfo.categories),
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
