import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import cls from 'classnames'

@observer
class InfoBox extends React.Component {
  render() {
    const {title, extra, bodyStyle, children, type = ''} = this.props
    return (
      <div className={cls({'box-item': true})}>
        <div className="box-head FBH">
          <div className="box-title">{title}</div>
          <div className="box-title-extra">{extra}</div>
        </div>
        <div className={cls({'box-content': true, 'table-type': type === 'table'})} style={bodyStyle}>
          {children}
        </div>
      </div>
    )
  }
}

export default InfoBox
