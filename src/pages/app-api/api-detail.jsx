import React from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import {Button, Modal} from 'antd'
import InfoBox, {BoxItem} from '@components/component-info-box'
import {CodeBoxRead} from '@components/component-code-box'
import ReactMarkdown from 'react-markdown'

const Detail = ({store}) => {
  const handleDelete = async () => {
    Modal.confirm({
      title: `删除接口`,
      content: `确认删除该接口及测试用例？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        store.deleteApi()
      },
    })
  }

  const handleEdit = async () => {
    const detail = toJS(store.apiDetail)
    store.newApiData = detail
    store.editApi = true
  }

  const detail = toJS(store.apiDetail)
  return (
    <div>
      <InfoBox title="接口信息">
        <BoxItem label="API名称" value={detail.name} />
        <BoxItem label="API路径" value={detail.path} />
        <BoxItem label="API前缀" value={detail.apiPrefix} />
        <BoxItem label="API完整路径" value={`${detail.apiPrefix}${detail.path}`} />
        <BoxItem label="API功能描述" value={detail.description} />
      </InfoBox>

      <table className="test-param-table mb20" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th>参数名</th>
            <th>位置</th>
            <th>是否必须</th>
            <th>描述</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          {detail.params.map((item) => {
            return (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.paramLocation}</td>
                <td>{item.isRequired ? '是' : '否'}</td>
                <td>{item.value}</td>
                <td>{item.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {['POST', 'PUT', 'DELETE'].indexOf(detail.method.toUpperCase()) >= 0 ? (
        <InfoBox title="Boy示例">
          <CodeBoxRead value={detail.body} />
        </InfoBox>
      ) : (
        ''
      )}
      <InfoBox title="详情描述">
        <ReactMarkdown source={detail.detail} escapeHtml={false} />
      </InfoBox>
      <div className="fac">
        <Button type="ghost" size="large" onClick={() => handleEdit()}>
          编辑
        </Button>
        <Button className="ml10" type="ghost" size="large" onClick={() => handleDelete()}>
          删除
        </Button>
      </div>
    </div>
  )
}

export default observer(Detail)
