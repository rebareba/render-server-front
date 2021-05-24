import React from 'react'
import {observer} from 'mobx-react'
import {CloseOutlined} from '@ant-design/icons'

const Tag = ({value, handleClick}) => {
  return (
    <div data-show="true" className="dtag ant-tag close-tag">
      <span className="ant-tag-text">{value}</span>
      <CloseOutlined onClick={handleClick} />
    </div>
  )
}

export default observer(Tag)
