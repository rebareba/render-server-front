import React, {useEffect} from 'react'
import {Modal, Form, Input} from 'antd'
import {observer} from 'mobx-react'

const FormItem = Form.Item

const CaseAddModal = ({store}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (form) form.resetFields()
  }, [])
  const handleOnCancel = () => {
    store.modalVisible.addCase = false
  }

  const handleOnOk = () => {
    const {validateFields} = form

    validateFields((err, values) => {
      if (!err) {
        store.saveTestCase(values.name)
      }
    })
  }
  const modalProps = {
    title: '新建测试用例',
    visible: store.modalVisible.addCase,
    onCancel: handleOnCancel,
    onOk: handleOnOk,
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
      <Form form={form}>
        <FormItem
          {...formItemLayout}
          name="name"
          label="用例名称： "
          rules={[
            {required: true, message: '测试用例名称不可为空'},
            {max: 20, message: '名称长度不应超过20位'},
          ]}
        >
          <Input placeholder="请填写新的测试用例名称" />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default observer(CaseAddModal)
