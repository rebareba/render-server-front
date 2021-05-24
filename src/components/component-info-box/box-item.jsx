import React from 'react'
import {observer} from 'mobx-react'

const BoxItem = ({label, action, value}) => {
  return (
    <div className="filed-item">
      <div className="box-item-label">{label}</div>
      <span className="value-box">{value}</span>
      {action && (
        // eslint-disable-next-line react/button-has-type
        <button type="button" className="button-style ml24" onClick={action}>
          {' 编辑 '}
        </button>
      )}
    </div>
  )
}

export default observer(BoxItem)
