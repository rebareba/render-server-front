import {Component} from 'react'
import {Spin, Input, Checkbox, Select, Radio, Table, Button, AutoComplete, message} from 'antd'
import {Form} from '@ant-design/compatible'
import {observer} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import _ from 'lodash'
import MarkdownEditor from '@uiw/react-markdown-editor'
import ErrorStatus from '@src/components/component-error-status'
import {CodeBoxEdit} from '@src/components/component-code-box'
import InfoBox from '@src/components/component-info-box'

const FormItem = Form.Item
const {Option} = Select
const RadioGroup = Radio.Group

@observer
class ApiNewEdit extends Component {
  @observable updateKey = ''

  isShowBodyDescr = false

  expendIndex = ''

  constructor(props) {
    super(props)
    this.store = props.store
    // 入参表格字段
    this.paramsColumns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, item, index) => {
          if (item.paramLocation === 'RouterParam') return <strong>{item.name}</strong>
          const props = {
            placeholder: '请填写参数名称',
            onChange: (e) => {
              this.handleOnChange(e.target.value, 'name', item)
            },
            value: item.name ? item.name : undefined,
          }
          return (
            <FormItem>
              <Input {...props} />
            </FormItem>
          )
        },
      },
      {
        title: '参数位置',
        dataIndex: 'paramLocation',
        key: 'paramLocation',
        width: 150,
        render: (text, item, index) => {
          if (item.paramLocation === 'RouterParam') return <Input value={item.paramLocation} disabled />
          const {getFieldValue} = this.props.form
          const props = {
            value: item.paramLocation ? item.paramLocation : undefined,
            onChange: (value) => this.handleOnChange(value, 'paramLocation', item),
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
        render: (text, item, index) => {
          if (item.paramLocation === 'RouterParam') return <Checkbox checked disabled />
          const props = {
            onChange: (e) => this.handleOnChange(e.target.checked, 'isRequired', item),
            checked: item.isRequired === true ? item.isRequired : false,
          }
          return <Checkbox {...props} />
        },
      },
      {
        title: '示例值',
        dataIndex: 'value',
        key: 'value',
        render: (value, item, index) => {
          const props = {
            placeholder: '填写示例值',
            onChange: (e) => this.handleOnChange(e.target.value, 'value', item),
            value: item.value ? item.value : undefined,
          }
          return <Input {...props} />
        },
      },
      {
        title: '描述说明',
        dataIndex: 'description',
        key: 'description',
        render: (value, item, index) => {
          const props = {
            placeholder: '描述说明字段含义',
            onChange: (e) => this.handleOnChange(e.target.value, 'description', item),
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
          return <a onClick={() => this.deleteItem(index)}>删除</a>
        },
      },
    ]
  }

  // 参数设置
  @action.bound handleOnChange(value, key, item) {
    item[key] = key === 'isRequired' || key === 'description' ? value : _.trim(value)
    this.updateKey = Math.random()
  }

  // 增加入参
  @action.bound handleAddParams() {
    this.store.newApiData.params.push({
      name: '',
      paramLocation: '',
      isRequired: true,
      value: '',
      description: '',
    })
    this.updateKey = Math.random()
  }

  // 删除入参
  @action.bound deleteItem(deleteIndex) {
    _.remove(this.store.newApiData.params, (item, index) => index === deleteIndex)
    this.updateKey = Math.random()
  }
  /**
   * 当修改path时,下面的入参中如果有入参的参数位置是Router Param，则需要重新校验一下该参数是否在path中，不在就重置为空
   */
  @action.bound handlePathChange(e) {
    const path = e.target.value
    // const reg = new RegExp('/:([^/:])(?=/?:?)', 'g')
    const reg = new RegExp('/:[^/:?]+', 'g')
    const matchs = path.match(reg)
    const oldRouterParam = this.store.newApiData.params.filter((item) => item.paramLocation === 'RouterParam')
    _.remove(this.store.newApiData.params, (item, index) => item.paramLocation === 'RouterParam')
    if (matchs) {
      matchs.forEach((name) => {
        name = name.substring(1)
        const oldParam = oldRouterParam.find((item) => item.name === name)
        if (oldParam) {
          this.store.newApiData.params.unshift(oldParam)
        } else {
          this.store.newApiData.params.unshift({
            name,
            paramLocation: 'RouterParam',
            isRequired: true,
            value: '',
            description: '',
          })
        }
      })
    }
    this.updateKey = Math.random()
  }
  // 路径前缀修改操作
  @action.bound handleApiPrefixChange(value) {
    value = value.trim()
    this.store.newApiData.apiPrefix = value
    this.updateKey = Math.random()
  }
  // 设置接口详情
  handleSetDetail = (editor, data, value) => {
    // this.setState({markdown: value})
    this.store.newApiData.detail = value
  }
  // 设置接口详情
  handleBody = (value) => {
    // this.setState({markdown: value})
    this.store.newApiData.body = value
  }
  @action.bound handleSave() {
    const {validateFieldsAndScroll} = this.props.form
    validateFieldsAndScroll((errs, values) => {
      if (!errs) {
        const apiData = {
          name: values.name,
          path: values.path,
          method: values.method,
          cateCode: values.cateCode,
          apiPrefix: this.store.newApiData.apiPrefix || '',
          description: values.description || '',
          params: this.store.newApiData.params,
          body: this.store.newApiData.body || '{}',
          detail: this.store.newApiData.detail || '',
        }
        if (apiData.apiPrefix && !/^\/[a-zA-Z0-9-\/]+[^/]$/.test(apiData.apiPrefix)) {
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
        this.store.saveApi(apiData)
      }
    })
  }
  render() {
    const store = this.store
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 19},
    }
    /** HTTP类型的入参和映射 */
    /* 映射为http时入参需要去除参数类型和数组子元素类型 */
    const paramTableProps = {
      bordered: false,
      dataSource: [...store.newApiData.params], // 由于层太深 直接赋值无法识别到数据的变化而重新渲染
      columns: this.paramsColumns,
      pagination: false,
      size: 'small',
      locale: {
        emptyText: <ErrorStatus tip="暂无数据" />,
      },
    }
    let {appInfo} = store
    appInfo = toJS(appInfo)
    const {getFieldDecorator} = this.props.form
    return (
      <div className="FB1 FBH FBJ" style={{overflowY: 'auto', overflowX: 'hidden'}} data-update={this.updateKey}>
        <div className="test-content ml10 FB1 edit-table">
          <Spin spinning={store.isLoading}>
            <Form>
              <InfoBox title="API基本信息">
                <FormItem {...formItemLayout} label="接口名称" hasFeedback>
                  {getFieldDecorator('name', {
                    rules: [
                      {required: true, message: 'API名称不可为空'},
                      {pattern: /^\S{2,128}$/, message: '长度范围2-128位'},
                    ],
                    initialValue: store.newApiData.name,
                  })(
                    <Input placeholder="请输入API名称, 仅限字母、数字和下划线, 且长度范围3-128位" autoComplete="off" />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="功能描述" hasFeedback>
                  {getFieldDecorator('description', {
                    rules: [{required: false}],
                    initialValue: store.newApiData.description,
                  })(<Input placeholder="请填写API功能描述" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="接口前缀" hasFeedback>
                  <AutoComplete
                    onChange={(value) => this.handleApiPrefixChange(value)}
                    placeholder="填写接口前缀，必须/开头"
                  >
                    {appInfo.apiPrefiies.map((prefix) => (
                      <AutoComplete.Option key={prefix}>{prefix}</AutoComplete.Option>
                    ))}
                  </AutoComplete>
                </FormItem>
                <FormItem {...formItemLayout} label="API路径" hasFeedback>
                  {getFieldDecorator('path', {
                    rules: [
                      {required: true, message: 'API路径不可为空'},
                      {pattern: /^\/[a-z0-9-_.:/]+$/i, message: '必须以/开头，字母数字下划线点和冒号'},
                    ],
                    initialValue: store.newApiData.path,
                  })(
                    <Input
                      placeholder="必须以/开头，可以使用字母、数字、下划线和冒号"
                      onChange={this.handlePathChange}
                    />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="HTTP方法">
                  {getFieldDecorator('method', {
                    rules: [{required: true, message: 'HTTP Method不可为空'}],
                    initialValue: store.newApiData.method,
                  })(
                    <RadioGroup>
                      <Radio value="GET">GET</Radio>
                      <Radio value="POST">POST</Radio>
                      <Radio value="DELETE">DELETE</Radio>
                      <Radio value="PUT">PUT</Radio>
                      <Radio value="HEAD">HEAD</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="所属分类">
                  {getFieldDecorator('cateCode', {
                    rules: [{required: true, message: '接口所属分类不能为空'}],
                    initialValue: store.newApiData.cateCode,
                  })(
                    <Select placeholder="所属分类">
                      {appInfo.categories.map((item) => {
                        return <Option value={item.cateCode}>{item.name}</Option>
                      })}
                    </Select>,
                  )}
                </FormItem>
              </InfoBox>
              <InfoBox title="API请求入参" extra={<Button onClick={this.handleAddParams}>增加入参</Button>}>
                <Table {...paramTableProps} />
              </InfoBox>
              <InfoBox title="Body示例（GET请求无需填写）" bodyStyle={{padding: '0'}}>
                <CodeBoxEdit
                  value={store.newApiData.body || '{\n\n}'}
                  onChange={(content) => this.handleBody(content)}
                />
              </InfoBox>
              <InfoBox title="详情描述" bodyStyle={{padding: '0'}}>
                <MarkdownEditor value={store.newApiData.detail || '\n\n\n\n\n\n'} onChange={this.handleSetDetail} />
              </InfoBox>
            </Form>
            <div className="fac">
              <Button ghost type="primary" size="large" onClick={() => this.handleSave()}>
                {store.type === 'edit' ? '确定' : '保存'}
              </Button>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default Form.create()(ApiNewEdit)
