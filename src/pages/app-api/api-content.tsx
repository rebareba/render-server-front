import React from 'react'
import {action} from 'mobx'
import {Input, Button, message, Spin, Tabs, Select, Tooltip} from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import {Form} from '@ant-design/compatible'
import {observer} from 'mobx-react'
import cls from 'classnames'
import copy from 'copy-to-clipboard'
import _ from 'lodash'
import InfoBox from '@src/components/component-info-box'
import {CodeBoxRead} from '@src/components/component-code-box'
import Headers from './api-headers'
import Query from './api-query'
import Detail from './api-detail'
import ApiGlobal from './api-global'
import BodyDescription from './api-body'
import TestCase from './api-case'
import CaseAddModal from './case-modal-add'
import {getHttpMethodTag, FrameProps} from '@src/common/utils'
const {Option} = Select
const {TabPane} = Tabs

@observer
class ApiContent extends React.Component<FrameProps, any> {
  constructor(props) {
    super(props)
    this.store = props.store
    this.store.result = {headers: {}, body: '', status: '-'}
    console.log('ApiContent constructor')
  }
  componentDidMount() {
    console.log('ApiContent componentDidMount', this.store.apiId, this.store.appKey)
    this.store.getApiDetail()
  }
  // 点击测试
  @action.bound handleClick() {
    const {validateFieldsAndScroll} = this.props.form
    validateFieldsAndScroll((errs, values) => {
      console.log('test handleClick', values)
      if (!errs) {
        this.store.testApi(values)
      }
    })
  }

  // 复制测试结果
  @action.bound handleResultCopy() {
    const {store} = this.props
    copy(store.result.body)
    message.success('已复制')
  }

  // 复制路径
  @action.bound handlePathCopy(content) {
    copy(content)
    message.success(`内容已复制: ${content}`)
  }

  // 保存测试参数
  @action.bound handleSaveClick() {
    if (this.store.formatParams()) {
      this.store.modalVisible.addCase = true
    }
  }

  // 切换测试用例
  @action.bound handleCaseChange(e) {
    this.store.selectedCaseId = e.key
    this.handleResetFieldValue()
  }

  @action.bound handleOnChange(value, key, item, index) {
    console.log('handleOnChange', value, key, index)
    const {store} = this.props
    item[key] = value
    store.update()
  }

  // 保存测试参数
  @action.bound changeHost(value: string) {
    this.store.host = value
  }
  // 保存测试参数
  @action.bound changePrefix(value: string) {
    this.store.apiPrefix = value
  }
  render() {
    const store = this.store
    const {apiDetail, result, header, query, param} = store
    const {getFieldDecorator} = this.props.form
    console.log('result.body', result.body)

    // 这里table隐藏的条件(主要是为了隐藏thead)
    // Param参数为空, Body参数为空, Query参数为空或者为透传方式（透传模式，Query会塞一个空数组）
    const tableHide = !param.length
    return (
      <div className="FB1 FBH FBJ" style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <CaseAddModal store={store} outerForm={this.props.form} />

        <div className="test-content FB1">
          <Spin spinning={store.isLoading}>
            {/*------------头部接口名称描述-------------- */}
            <div className="FBH FBAC test-name ">
              <div className="FB1">
                {getHttpMethodTag(store.method.toUpperCase())}
                <span style={{fontSize: 20, fontWeight: 600}}>{store.apiDetail.name}</span>
                <span style={{fontSize: 12, marginLeft: 20, opacity: 0.7, paddingTop: 8}}>
                  {store.apiDetail.description}
                </span>
              </div>

              <div>
                <Select
                  style={{width: 100}}
                  defaultValue={store.host}
                  allowClear
                  value={store.host}
                  placeholder="设置主机"
                  onChange={this.changeHost}
                >
                  {store.appInfo.hosts.map((item) => (
                    <Option key={item} value={item.host}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  style={{width: 100}}
                  defaultValue={store.apiPrefix}
                  value={store.apiPrefix}
                  className="ml4"
                  placeholder="设置前缀"
                  onChange={this.changePrefix}
                  allowClear
                >
                  {store.appInfo.apiPrefiies.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {/*------------接口路径 测试 保存 按钮 -------------- */}
            <div className="FBH FBJ mt20 mb20">
              <div
                className="pl10 FBH FBJ FBAC"
                style={{height: 40, background: '#F5F7F9', fontSize: 14, letterSpacing: 1, width: '100%'}}
              >
                <div>
                  <strong style={{color: '#1890ff'}}>{store.host || ''}</strong>
                  <span style={{color: '#52c41a'}}>{store.apiPrefix || ''}</span>
                  <span style={{fontWeight: 500}}>{store.apiDetail.path}</span>
                </div>
                <Tooltip title="点击复制路径">
                  <CopyOutlined
                    className="copyIcon"
                    onClick={() => this.handlePathCopy(`${store.apiPrefix || ''}${store.apiDetail.path}`)}
                  />
                </Tooltip>
              </div>

              <Button type="primary" size="large" style={{marginLeft: '12px'}} onClick={this.handleClick}>
                测试
              </Button>
              <Button size="large" style={{marginLeft: '12px'}} onClick={this.handleSaveClick}>
                保存
              </Button>
            </div>
            {/*------------参数配置的TAB -------------- */}
            <Tabs
              type="card"
              // tabBarExtraContent={tabExtra}
            >
              <TabPane tab="参数配置" key="1">
                <div className={cls({'test-param': true, hide: tableHide, mt5: true})} style={{marginTop: 4}}>
                  <table className="test-param-table" cellSpacing="0" cellPadding="0" data-update={store.updateKey}>
                    <tbody>
                      {param.map((item, index) => {
                        return (
                          <tr key={item.index}>
                            <td>路由参数</td>
                            <td className={cls({'ant-form-item-required': true})}>{item.name}</td>
                            <td>
                              <Input
                                placeholder={`必填 - ${item.description}`}
                                value={item.value}
                                onChange={(e) => this.handleOnChange(e.target.value, 'value', item, index)}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/** *****************************************************************************/}

                <Query store={store} />

                {/** *****************************************************************************/}
                <Headers store={store} />
                {['POST', 'PUT', 'DELETE'].indexOf(store.method.toUpperCase()) >= 0 ? (
                  <div className="test-param">
                    <div className="test-param" style={{overflow: 'scroll'}}>
                      <table className="test-param-table" cellSpacing="0" cellPadding="0">
                        <thead>
                          <tr>
                            <th>Body参数(json格式)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{padding: 0}}>
                              <BodyDescription store={store} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
                {/*------------测试结果 -------------- */}
                <div className="test-result">
                  <InfoBox
                    title={<strong style={{color: 'blue'}}>测试结果展示: {store.result.status || '-'}</strong>}
                    extra={
                      <Button size="middle" type="primary" onClick={this.handleResultCopy}>
                        复制
                      </Button>
                    }
                  >
                    {result ? <CodeBoxRead value={result ? result.body : ''} /> : null}
                  </InfoBox>
                  <CodeBoxRead value={result.headers ? JSON.stringify(result.headers, null, 4) : ''} />
                </div>
              </TabPane>
              <TabPane tab="接口信息" key="2">
                <Detail store={store} />
              </TabPane>
              <TabPane tab="全局参数" key="3">
                <ApiGlobal store={store} />
              </TabPane>
            </Tabs>
          </Spin>
        </div>

        <TestCase store={store} form={this.props.form} />
      </div>
    )
  }
}

export default Form.create()(ApiContent)
