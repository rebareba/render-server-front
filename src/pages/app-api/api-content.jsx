import React, {useEffect} from 'react'
import {Input, Button, Spin, Tabs, Select, Tooltip, Form} from 'antd'
import {CopyOutlined} from '@ant-design/icons'
import {observer} from 'mobx-react'
import cls from 'classnames'
import _ from 'lodash'
import InfoBox from '@src/components/component-info-box'
import {CodeBoxRead} from '@components/component-code-box'
import {getMethodTag, message, copy} from '@utils'
import Headers from './api-headers'
import Query from './api-query'
import Detail from './api-detail'
import ApiGlobal from './api-global'
import BodyDescription from './api-body'
import TestCase from './api-case'
import CaseAddModal from './case-modal-add'

const {Option} = Select
const {TabPane} = Tabs

const ApiContent = ({store}) => {
  const {result, param} = store

  const [form] = Form.useForm()

  useEffect(() => {
    store.getApiDetail()
  }, [])

  // 点击测试
  const handleClick = () => {
    const {validateFieldsAndScroll} = form
    validateFieldsAndScroll((errs, values) => {
      // console.log('test handleClick', values)
      if (!errs) {
        store.testApi(values)
      }
    })
  }

  // 复制测试结果
  const handleResultCopy = () => {
    copy(store.result.body)
    message.success('已复制')
  }

  // 复制路径
  const handlePathCopy = (content) => {
    copy(content)
    message.success(`内容已复制: ${content}`)
  }

  // 保存测试参数
  const handleSaveClick = () => {
    if (store.formatParams()) {
      store.modalVisible.addCase = true
    }
  }

  const handleOnChange = (value, key, item) => {
    // console.log('handleOnChange', value, key, index)
    item[key] = value
    store.update()
  }

  // 保存测试参数
  const changeHost = (value) => {
    store.host = value
  }

  // 保存测试参数
  const changePrefix = (value) => {
    store.apiPrefix = value
  }

  // 这里table隐藏的条件(主要是为了隐藏thead)
  // Param参数为空, Body参数为空, Query参数为空或者为透传方式（透传模式，Query会塞一个空数组）
  const tableHide = !param.length
  return (
    <div className="fb1 fbh fbj" style={{overflowY: 'auto', overflowX: 'hidden'}}>
      <CaseAddModal store={store} outerForm={form} />
      <Form form={form}>
        <div className="test-content fb1">
          <Spin spinning={store.isLoading}>
            {/* ------------头部接口名称描述-------------- */}
            <div className="fbh fbac test-name ">
              <div className="fb1">
                {getMethodTag(store.method.toUpperCase())}
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
                  onChange={changeHost}
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
                  onChange={changePrefix}
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
            {/* ------------接口路径 测试 保存 按钮 -------------- */}
            <div className="fbh fbj mt20 mb20">
              <div
                className="pl10 fbh fbj fbac"
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
                    onClick={() => handlePathCopy(`${store.apiPrefix || ''}${store.apiDetail.path}`)}
                  />
                </Tooltip>
              </div>

              <Button type="primary" size="large" style={{marginLeft: '12px'}} onClick={handleClick}>
                测试
              </Button>
              <Button size="large" style={{marginLeft: '12px'}} onClick={handleSaveClick}>
                保存
              </Button>
            </div>
            {/* ------------参数配置的TAB -------------- */}
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
                                onChange={(e) => handleOnChange(e.target.value, 'value', item, index)}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/** **************************************************************************** */}

                <Query store={store} />

                {/** **************************************************************************** */}
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
                {/* ------------测试结果 -------------- */}
                <div className="test-result">
                  <InfoBox
                    title={<strong style={{color: 'blue'}}>测试结果展示: {store.result.status || '-'}</strong>}
                    extra={
                      <Button size="middle" type="primary" onClick={handleResultCopy}>
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
      </Form>
      <TestCase store={store} />
    </div>
  )
}

export default observer(ApiContent)
