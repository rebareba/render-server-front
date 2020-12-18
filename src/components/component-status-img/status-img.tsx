import React, {Component} from 'react'
// import PropTypes from 'prop-types'

import empty from '@src/assets/icon/status-empty.svg'
import success from '@src/assets/icon/status-success.svg'
import waiting from '@src/assets/icon/status-waiting.svg'
import error from '@src/assets/icon/status-fail.svg'

const getImgSource = (status = 'empty') => {
  let result = ''
  switch (status) {
    case 'empty':
      result = empty
      break
    case 'success':
      result = success
      break
    case 'waiting':
      result = waiting
      break
    case 'error':
      result = error
      break
    default:
      result = empty
      break
  }
  return result
}

class StatusImg extends Component {
  render() {
    const minHeight = this.props.height || 155
    const imgSrc = getImgSource(this.props.status)
    return (
      <div className="status-img FBV FBJC FBAC" style={{minHeight: `${minHeight}px`}}>
        <div className="FBV FBJC FBAC">
          <img src={imgSrc} alt="有错误" width="200px" />
          <span className="status-tip">{this.props.tip}</span>
        </div>
      </div>
    )
  }
}

export default StatusImg
