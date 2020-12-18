import React from 'react'
import {observer} from 'mobx-react'

import imgSrc from './empty.png'

@observer
class ErrorStatus extends React.Component {
  render() {
    return (
      <div className="error-status FBV FBJC FBAC">
        <div className="FBV FBJC FBAC">
          <img src={imgSrc} alt="有错误" />
          <span className="error-status-tip">{this.props.tip}</span>
        </div>
      </div>
    )
  }
}

export default ErrorStatus
