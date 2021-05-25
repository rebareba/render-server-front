import {useEffect, useState} from 'react'
import {Spin, Input, Checkbox, Select, Radio, Table, Button, AutoComplete, Form, message} from 'antd'

import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import _ from 'lodash'
import MarkdownEditor from '@uiw/react-markdown-editor'
import ErrorStatus from '@src/components/component-error-status'
import {CodeBoxEdit} from '@components/component-code-box'
import InfoBox from '@src/components/component-info-box'

const FormItem = Form.Item
const {Option} = Select
const RadioGroup = Radio.Group

const ApiNewEdit = ({store}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (form) form.resetFields()
  }, [])
  const [updateKey, setUpdateKey] = useState('')

  // 参数设置
  const handleOnChange = (value, key, item) => {
    item[key] = key === 'isRequired' || key === 'description' ? value : _.trim(value)
    setUpdateKey(Math.random())
  }

  // 增加入参
  const handleAddParams = () => {
    store.newApiData.params.push({
      name: '',
      paramLocation: '',
      isRequired: true,
      value: '',
      description: '',
    })
    setUpdateKey(Math.random())
  }

  // 删除入参
  const deleteItem = (deleteIndex) => {
    _.remove(store.newApiData.params, (item, index) => index === deleteIndex)
    setUpdateKey(Math.random())
  }

  /**
   * 当修改path时,下面的入参中如果有入参的参数位置是Router Param，则需要重新校验一下该参数是否在path中，不在就重置为空
   */
  const handlePathChange = (e) => {
    const path = e.target.value
    // const reg = new RegExp('/:([^/:])(?=/?:?)', 'g')
    const reg = new RegExp('/:[^/:?]+', 'g')
    const matchs = path.match(reg)
    const oldRouterParam = store.newApiData.params.filter((item) => item.paramLocation === 'RouterParam')
    _.remove(store.newApiData.params, (item) => item.paramLocation === 'RouterParam')
    if (matchs) {
      matchs.forEach((name) => {
        name = name.substring(1)
        const oldParam = oldRouterParam.find((item) => item.name === name)
        if (oldParam) {
          store.newApiData.params.unshift(oldParam)
        } else {
          store.newApiData.params.unshift({
            name,
            paramLocation: 'RouterParam',
            isRequired: true,
            value: '',
            description: '',
          })
        }
      })
    }
    setUpdateKey(Math.random())
  }

  // 路径前缀修改操作
  const handleApiPrefixChange = (value) => {
    value = value.trim()
    store.newApiData.apiPrefix = value
    setUpdateKey(Math.random())
  }

  // 设置接口详情
  const handleSetDetail = (editor, data, value) => {
    // setState({markdown: value})
    store.newApiData.detail = value
  }

  // 设置接口详情
  const handleBody = (value) => {
    // setState({markdown: value})
    store.newApiData.body = value
  }

  const handleSave = () => {
    const {validateFields} = form
    validateFields((values) => {
      const apiData = {
        name: values.name,
        path: values.path,
        method: values.method,
        cateCode: values.cateCode,
        apiPrefix: store.newApiData.apiPrefix || '',
        description: values.description || '',
        params: store.newApiData.params,
        body: store.newApiData.body || '{}',
        detail: store.newApiData.detail || '',
      }
      if (apiData.apiPrefix && !/^\/[a-zA-Z0-9]+[^/]$/.test(apiData.apiPrefix)) {
        message.error('接口前缀填写不规范')
        return
      }

      if (apiData.method !== 'GET' || apiData.method !== 'HEAD') {
        try {
          const body = JSON.parse(apiData.body)
          if (!_.isObject(body)) {
            message.error('body填写不规范，不是JSON格式数据')
            return
          }
        } catch (e) {
          message.error('body填写不规范，不是JSON格式数据')
          return
        }
      }
      store.saveApi(apiData)
    }).catch((err) => {})
  }

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 19},
  }

  const paramsColumns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, item) => {
        if (item.paramLocation === 'RouterParam') return <strong>{item.name}</strong>
        const props = {
          placeholder: '请填写参数名称',
          onChange: (e) => {
            handleOnChange(e.target.value, 'name', item)
          },
          value: item.name ? item.name : undefined,
        }
        return <Input {...props} />
      },
    },
    {
      title: '参数位置',
      dataIndex: 'paramLocation',
      key: 'paramLocation',
      width: 150,
      render: (text, item) => {
        if (item.paramLocation === 'RouterParam') return <Input value={item.paramLocation} disabled />
        const props = {
          value: item.paramLocation ? item.paramLocation : undefined,
          onChange: (value) => handleOnChange(value, 'paramLocation', item),
        }

        const options = []
        options.push(<Option value="Query">Query</Option>)
        options.push(<Option value="Header">Header</Option>)

        return (
          <Select placeholder="请选择参数位置" {...props}>
            {options}
          </Select>
        )
      },
    },
    {
      title: '是否必传',
      dataIndex: 'isRequired',
      key: 'isRequired',
      width: 100,
      render: (text, item) => {
        if (item.paramLocation === 'RouterParam') return <Checkbox checked disabled />
        const props = {
          onChange: (e) => handleOnChange(e.target.checked, 'isRequired', item),
          checked: item.isRequired === true ? item.isRequired : false,
        }
        return <Checkbox {...props} />
      },
    },
    {
      title: '示例值',
      dataIndex: 'value',
      key: 'value',
      render: (value, item) => {
        const props = {
          placeholder: '填写示例值',
          onChange: (e) => handleOnChange(e.target.value, 'value', item),
          value: item.value ? item.value : undefined,
        }
        return <Input {...props} />
      },
    },
    {
      title: '描述说明',
      dataIndex: 'description',
      key: 'description',
      render: (value, item) => {
        const props = {
          placeholder: '描述说明字段含义',
          onChange: (e) => handleOnChange(e.target.value, 'description', item),
          value: item.description,
        }
        return <Input {...props} />
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 50,
      render: (value, item, index) => {
        if (item.paramLocation === 'RouterParam') return
        return <a onClick={() => deleteItem(index)}>删除</a>
      },
    },
  ]
  /** HTTP类型的入参和映射 */
  /* 映射为http时入参需要去除参数类型和数组子元素类型 */
  const paramTableProps = {
    bordered: false,
    dataSource: [...store.newApiData.params], // 由于层太深 直接赋值无法识别到数据的变化而重新渲染
    columns: paramsColumns,
    pagination: false,
    size: 'small',
    locale: {
      emptyText: <ErrorStatus tip="暂无数据" />,
    },
  }
  let {appInfo} = store
  appInfo = toJS(appInfo)

  return (
    <div className="fb1 fbh fbj" style={{overflowY: 'auto', overflowX: 'hidden'}} data-update={updateKey}>
      <div className="test-content ml10 fb1 edit-table">
        <Spin spinning={store.isLoading}>
          <Form form={form}>
            <InfoBox title="API基本信息">
              <FormItem
                name="name"
                {...formItemLayout}
                label="接口名称"
                rules={[
                  {required: true, message: 'API名称不可为空'},
                  {pattern: /^\S{2,128}$/, message: '长度范围2-128位'},
                ]}
                initialValue={store.newApiData.name}
                hasFeedback
              >
                <Input placeholder="请输入API名称, 仅限字母、数字和下划线, 且长度范围3-128位" autoComplete="off" />
              </FormItem>
              <FormItem
                name="description"
                {...formItemLayout}
                {...{
                  rules: [{required: false}],
                  initialValue: store.newApiData.description,
                }}
                label="功能描述"
                hasFeedback
              >
                <Input placeholder="请填写API功能描述" />
              </FormItem>
              <FormItem {...formItemLayout} label="接口前缀" hasFeedback>
                <AutoComplete onChange={(value) => handleApiPrefixChange(value)} placeholder="填写接口前缀，必须/开头">
                  {appInfo.apiPrefiies.map((prefix) => (
                    <AutoComplete.Option key={prefix}>{prefix}</AutoComplete.Option>
                  ))}
                </AutoComplete>
              </FormItem>
              <FormItem
                name="path"
                {...formItemLayout}
                {...{
                  rules: [
                    {required: true, message: 'API路径不可为空'},
                    {pattern: /^\/[a-z0-9-_.:/]+$/i, message: '必须以/开头，字母数字下划线点和冒号'},
                  ],
                  initialValue: store.newApiData.path,
                }}
                label="API路径"
                hasFeedback
              >
                <Input placeholder="必须以/开头，可以使用字母、数字、下划线和冒号" onChange={handlePathChange} />
              </FormItem>
              <FormItem
                name="method"
                {...formItemLayout}
                label="HTTP方法"
                {...{
                  rules: [{required: true, message: 'HTTP Method不可为空'}],
                  initialValue: store.newApiData.method || 'GET',
                }}
              >
                <RadioGroup>
                  <Radio value="GET">GET</Radio>
                  <Radio value="POST">POST</Radio>
                  <Radio value="DELETE">DELETE</Radio>
                  <Radio value="PUT">PUT</Radio>
                  <Radio value="HEAD">HEAD</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                name="cateCode"
                {...formItemLayout}
                label="所属分类"
                {...{
                  rules: [{required: true, message: '接口所属分类不能为空'}],
                  initialValue: store.newApiData.cateCode,
                }}
              >
                <Select placeholder="所属分类">
                  {appInfo.categories.map((item) => {
                    return <Option value={item.cateCode}>{item.name}</Option>
                  })}
                </Select>
              </FormItem>
            </InfoBox>
            <InfoBox title="API请求入参" extra={<Button onClick={handleAddParams}>增加入参</Button>}>
              <Table {...paramTableProps} />
            </InfoBox>
            <InfoBox title="Body示例（GET请求无需填写）" bodyStyle={{padding: '0'}}>
              <CodeBoxEdit value={store.newApiData.body || '{\n\n}'} onChange={(content) => handleBody(content)} />
            </InfoBox>
            <InfoBox title="详情描述" bodyStyle={{padding: '0'}}>
              <MarkdownEditor value={store.newApiData.detail || '\n\n\n\n\n\n'} onChange={handleSetDetail} />
            </InfoBox>
          </Form>
          <div className="fac">
            <Button ghost type="primary" size="large" onClick={() => handleSave()}>
              {store.type === 'edit' ? '确定' : '保存'}
            </Button>
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default observer(ApiNewEdit)
