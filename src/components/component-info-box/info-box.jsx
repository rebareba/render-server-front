import React from 'react'
import {observer} from 'mobx-react'
import cls from 'classnames'

const InfoBox = ({title, extra, bodyStyle, children, type = ''}) => {
  return (
    <div className={cls({'box-item': true})}>
      <div className="box-head fbh">
        <div className="box-title">{title}</div>
        <div className="box-title-extra">{extra}</div>
      </div>
      <div className={cls({'box-content': true, 'table-type': type === 'table'})} style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}

export default observer(InfoBox)
