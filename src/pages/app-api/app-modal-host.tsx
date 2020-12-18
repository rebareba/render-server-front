import {Component} from 'react'
import {Modal, Table, Button, Input} from 'antd'
import {Form} from '@ant-design/compatible'
import {observable, action, computed, toJS} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'

const FormItem = Form.Item

@observer
class AppHostModal extends Component {
  constructor(props) {
    super()
    this.store = props.store
    const {getFieldDecorator} = props.form
    this.hostColumns = [
      {
        title: '主机名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          if (record.type === 'add' || record.type === 'edit') {
            return (
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '主机名称不能为空'}],
                  initialValue: record.type === 'edit' ? record.name : '',
                })(<Input placeholder="请输入新主机名称" />)}
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
        render: (text, record, index) => {
          if (record.type === 'add' || record.type === 'edit') {
            return (
              <FormItem>
                {getFieldDecorator('host', {
                  rules: [
                    {required: true, message: '主机code不能为空'},
                    {pattern: /^(http:\/\/|https:\/\/)\w+/, message: '必须以 http:// 或者https://开头'},
                  ],
                  initialValue: record.type === 'edit' ? record.host : '',
                })(<Input width="100" placeholder="请输入Host地址(注意加端口号)" />)}
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
                <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleAddHost('add')}>
                  添加
                </Button>
                <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleAddHost('cancel')}>
                  取消
                </Button>
              </div>
            )
          } else if (record.type === 'edit') {
            return (
              <div style={{marginRight: 0, width: 115}}>
                <Button
                  className="ml4 mr4"
                  type="ghost"
                  size="small"
                  onClick={() => this.handleEditHost('edit', index)}
                >
                  保存修改
                </Button>
                <Button
                  className="ml4 mr4"
                  type="ghost"
                  size="small"
                  onClick={() => this.handleEditHost('cancel', index)}
                >
                  取消
                </Button>
              </div>
            )
          }

          return (
            <div>
              <Button className="ml4 mr4" type="ghost" size="small" onClick={() => this.handleEdit(record.host)}>
                编辑
              </Button>
              <Button
                className="ml4 mr4"
                type="ghost"
                size="small"
                onClick={() => this.store.deleteServiceHost(record.host)}
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
    return this.store.appInfo.hosts.some((item) => item.type === 'add') || this.isEditing
  }

  /** if中方法是用于在新建API的时候，关闭modal框需要重新去请求一下主机数据，以保证数据同步 */
  @action.bound handleOnCancel() {
    this.store.appHostVisible = false
    _.remove(this.store.appInfo.hosts, (item) => item.type === 'add')
  }

  @action.bound addHost() {
    this.store.appInfo.hosts.push({name: '', host: '', type: 'add'})
  }

  @action.bound handleAddHost(actionType = 'add') {
    const {validateFields} = this.props.form
    if (actionType === 'add') {
      validateFields((err, values) => {
        if (!err) {
          this.store.addServiceHost(values)
        }
      })
    } else {
      _.remove(this.store.appInfo.hosts, (item) => item.type === 'add')
    }
  }

  @action.bound handleEditHost(actionType = 'edit', index) {
    const {validateFields} = this.props.form
    if (actionType === 'edit') {
      validateFields((err, values) => {
        if (!err) {
          // console.log('-----edit', values, cateCode)
          this.store.editServiceHost(values, index)
          this.isEditing = false
        }
      })
    } else {
      const keyItem = this.store.appInfo.hosts[index]
      if (keyItem) delete keyItem.type
      this.isEditing = false
      this.updateKey = Math.random()
    }
  }

  @action.bound handleEdit(host) {
    if (this.hasAddItem) return
    const keyItem = this.store.appInfo.hosts.find((item) => item.host === host)
    keyItem.type = 'edit'
    this.isEditing = true
    this.updateKey = Math.random()
  }

  render() {
    if (!this.store.appHostVisible) {
      return null
    }

    const modalProps = {
      title: '后端主机配置',
      visible: this.store.appHostVisible,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnCancel,
      className: 'app-host-modal',
      key: 'host',
      maskClosable: false,
      footer: (
        <Button disabled={this.hasAddItem} size="normal" onClick={this.addHost} type="primary">
          新建主机
        </Button>
      ),
    }

    const tableProps = {
      columns: this.hostColumns,
      rowKey: 'host',
      loading: this.store.isLoading,
      bordered: true,
      className: 'edit-table',
      dataSource: toJS(this.store.appInfo.hosts),
      pagination: false,
    }

    return (
      <Modal {...modalProps} data-update={this.updateKey}>
        <Table {...tableProps} />
      </Modal>
    )
  }
}

export default Form.create()(AppHostModal)
