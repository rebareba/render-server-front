import React from 'react'
import {Modal, Input} from 'antd'
import {Form} from '@ant-design/compatible'
import {action} from 'mobx'
import {observer} from 'mobx-react'

const FormItem = Form.Item

@observer
class CaseAddModal extends React.Component {
  @action.bound handleOnCancel() {
    const {store} = this.props
    store.modalVisible.addCase = false
  }

  @action.bound handleOnOk() {
    const {store} = this.props
    const {validateFields} = this.props.form

    validateFields((err, values) => {
      if (!err) {
        store.saveTestCase(values.name)
      }
    })
  }

  render() {
    const {store} = this.props

    const {getFieldDecorator} = this.props.form
    const modalProps = {
      title: '新建测试用例',
      visible: store.modalVisible.addCase,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnOk,
      maskClosable: false,
      destroyOnClose: true,
      className: 'test-case-add',
    }

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      colon: false,
    }

    return (
      <Modal {...modalProps}>
        <Form>
          <FormItem {...formItemLayout} label="用例名称： " hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '测试用例名称不可为空'},
                {max: 20, message: '名称长度不应超过20位'},
              ],
            })(<Input placeholder="请填写新的测试用例名称" ref={(input) => (this.nameInput = input)} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(CaseAddModal)
