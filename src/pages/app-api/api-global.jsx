import React from 'react'
import {Input, Checkbox, Table, Select} from 'antd'
import {observer} from 'mobx-react'
import ErrorStatus from '@components/component-error-status'
import _ from 'lodash'

const {Option} = Select

const ApiGlobal = ({store}) => {
  const handleOnChange = (value, key, item, index) => {
    item[key] = value
    if (index === store.globalConfig.length - 1 && key === 'name') {
      store.globalConfig.push({
        name: '',
        paramLocation: 'Header',
        value: '',
        checked: true,
      })
    }
    if (item.name) store.resetStorage()
    store.update()
  }

  const deleteItem = (deleteIndex, item) => {
    if (store.globalConfig.length > 1) {
      _.remove(store.globalConfig, (value, index) => index === deleteIndex)
      if (item.name) store.resetStorage()
      store.update()
    }
  }

  const paramsColumns = [
    {
      title: '使用',
      dataIndex: 'checked',
      key: 'checked',
      width: 100,
      render: (text, item, index) => {
        const props = {
          onChange: (e) => handleOnChange(e.target.checked, 'checked', item, index),
          checked: item.checked === true ? item.checked : false,
        }
        return <Checkbox {...props} />
      },
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, item, index) => {
        const props = {
          placeholder: '请填写参数名称',
          onChange: (e) => {
            handleOnChange(e.target.value, 'name', item, index)
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
      render: (text, item, index) => {
        const props = {
          value: item.paramLocation ? item.paramLocation : undefined,
          onChange: (value) => handleOnChange(value, 'paramLocation', item, index),
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
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      render: (value, item, index) => {
        const props = {
          placeholder: '填写值',
          onChange: (e) => handleOnChange(e.target.value, 'value', item, index),
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
          onChange: (e) => handleOnChange(e.target.value, 'description', item, index),
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
        return <a onClick={() => deleteItem(index, item)}>删除</a>
      },
    },
  ]
  /** HTTP类型的入参和映射 */
  /* 映射为http时入参需要去除参数类型和数组子元素类型 */
  const paramTableProps = {
    bordered: false,
    dataSource: [...store.globalConfig], // 由于层太深 直接赋值无法识别到数据的变化而重新渲染
    columns: paramsColumns,
    pagination: false,
    size: 'small',
    locale: {
      emptyText: <ErrorStatus tip="暂无数据" />,
    },
  }
  return (
    <div className="test-query" data-update={store.updateKey}>
      <Table {...paramTableProps} />
    </div>
  )
}

export default observer(ApiGlobal)
