import React from 'react'
import {AutoComplete, Checkbox} from 'antd'
import {observer} from 'mobx-react'
import _ from 'lodash'
import cls from 'classnames'

const {Option} = AutoComplete

const keyList = [
  'Token',
  'Cookie',
  'X-Requested-With',
  'Content-Type',
  'Authorization',
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Datetime',
  'Accept-Language',
  'Cache-Control',
  'Connection',
  'Content-Length',
  'Content-MD5',
  'Expect',
  'Forwarded',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Max-Forwards',
  'Origin',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'Upgrade',
  'User-Agent',
  'Via',
  'Warning',
  'X-Forwarded-For',
  'X-Forwarded-Host',
  'X-Forwarded-Proto',
  'X-Request-ID',
  'Access-Control-Allow-Origin',
  'Accept-Patch',
  'Accept-Ranges',
  'Age',
  'Allow',
  'Alt-Svc',
  'Content-Disposition',
  'Content-Encoding',
  'Content-Language',
  'Content-Location',
  'Content-Range',
  'Date',
  'ETag',
  'Expires',
  'Last-Modified',
  'Link',
  'Location',
]

const valueList = [
  'XMLHttpRequest',
  'application/json',
  'application/octet-strea',
  'application/xml',
  'application/zip',
  'application/x-www-form-urlencoded',
  'application/pdf',
  'application/javascript',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'text/plain',
  'utf-8',
  'gzip, deflate',
  'no-cache',
  'keep-alive',
  'en-US',
  'close',
  'zh-cn',
  '*/*',
]

const Headers = ({store}) => {
  const handleAddItem = () => {
    store.header.push({
      name: '',
      value: '',
    })
    store.update()
  }
  const handleOnChange = (value, key, item, index) => {
    item[key] = value

    if (index === store.header.length - 1 && key === 'name') {
      handleAddItem()
    }
    store.update()
  }

  const deleteItem = (deleteIndex) => {
    _.remove(store.header, (value, index) => index === deleteIndex)
    store.update()
  }

  return (
    <div className="test-headers" data-update={store.updateKey}>
      <table className="test-param-table" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th />
            <th>Headers 参数</th>
            <th>参数值</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {store.header.map((item, index) => {
            const keyProps = {
              style: {width: '100%'},
              value: item.name,
              disabled: item.disabled,
              placeholder: '请输入类型',
              onChange: (e) => handleOnChange(e, 'name', item, index),
            }

            const keyOptions = item.name
              ? keyList.filter((sitem) => sitem.toUpperCase().includes(item.name.toUpperCase()))
              : keyList

            const key = (
              <td style={{width: 300}} className={cls({'ant-form-item-required': item.isRequired})}>
                {keyProps.disabled ? (
                  keyProps.value
                ) : (
                  <AutoComplete {...keyProps}>
                    {keyOptions.map((sitem) => (
                      <Option key={sitem}>{sitem}</Option>
                    ))}
                  </AutoComplete>
                )}
              </td>
            )

            // **************************************************************

            const valueProps = {
              style: {width: '100%'},
              value: item.value,
              placeholder: item.description || '请输入值',
              onChange: (e) => handleOnChange(e, 'value', item, index),
            }

            const valueOptions = item.value
              ? valueList.filter((sitem) => sitem.toUpperCase().includes(item.value.toUpperCase()))
              : valueList

            const value = (
              <td>
                <AutoComplete {...valueProps}>
                  {valueOptions.map((sitem) => (
                    <Option key={sitem}>{sitem}</Option>
                  ))}
                </AutoComplete>
              </td>
            )

            let actionTd = ''
            if (index === store.header.length - 1 || item.disabled === true) {
              actionTd = <td style={{width: 70}} />
            } else {
              actionTd = (
                <td style={{width: 70}}>
                  <a onClick={() => deleteItem(index)}>删除</a>
                </td>
              )
            }

            return (
              <tr key={item.name}>
                <td style={{width: 50}}>
                  <Checkbox
                    disabled={item.isRequired}
                    checked={item.checked}
                    onChange={(e) => handleOnChange(e.target.checked, 'checked', item, index)}
                  />
                </td>
                {key}
                {value}
                {actionTd}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default observer(Headers)
