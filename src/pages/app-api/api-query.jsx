import {Input, Checkbox} from 'antd'
import {observer} from 'mobx-react'
import _ from 'lodash'
import cls from 'classnames'

const Query = ({store}) => {
  const handleAddItem = () => {
    store.query.push({
      name: '',
      value: '',
      checked: true,
    })
    store.update()
  }

  const handleOnChange = (value, key, item, index) => {
    item[key] = value

    if (index === store.query.length - 1 && key === 'name') {
      handleAddItem()
    }
    store.update()
  }

  const deleteItem = (deleteIndex) => {
    _.remove(store.query, (value, index) => index === deleteIndex)
    store.update()
  }

  return (
    <div className="test-query" data-update={store.updateKey}>
      <table className="test-param-table" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th />
            <th>Query 参数</th>
            <th>参数值</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {store.query.map((item, index) => {
            const keyProps = {
              value: item.name,
              placeholder: '请输入参数名',
              disabled: item.disabled,
              onChange: (e) => handleOnChange(e.target.value, 'name', item, index),
            }
            const valueProps = {
              value: item.value,
              placeholder: item.description || '请输入值',
              onChange: (e) => handleOnChange(e.target.value, 'value', item, index),
            }
            const key = (
              <td style={{width: 300}} className={cls({'ant-form-item-required': item.isRequired})}>
                {keyProps.disabled ? keyProps.value : <Input {...keyProps} />}
              </td>
            )
            const value = (
              <td>
                <Input {...valueProps} />
              </td>
            )
            let actionTd = ''
            if (index === store.query.length - 1 || item.disabled === true) {
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

export default observer(Query)
