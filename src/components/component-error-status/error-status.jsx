import React from 'react'
import {observer} from 'mobx-react'

import imgSrc from './empty.png'

const ErrorStatus = ({tip}) => {
  return (
    <div className="error-status fbv fbjc fbac">
      <div className="fbv fbjc fbac">
        <img src={imgSrc} alt="有错误" />
        <span className="error-status-tip">{tip}</span>
      </div>
    </div>
  )
}

export default observer(ErrorStatus)
