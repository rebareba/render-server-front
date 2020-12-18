import React from 'react'
import {Icon} from 'antd'

class Tag extends React.Component {
  render() {
    const {value} = this.props.data
    return (
      <div data-show="true" className="dtag ant-tag close-tag">
        <span className="ant-tag-text">{value}</span>
        <Icon type="close" onClick={this.props.handleClick} />
      </div>
    )
  }
}

export default Tag
