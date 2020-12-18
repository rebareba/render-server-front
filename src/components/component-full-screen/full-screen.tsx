import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {withRouter} from 'react-router'
import {Button, Icon} from 'antd'

@observer
class FullScreen extends Component {
  constructor(props) {
    super(props)
  }

  @action goBack = (e) => {
    e.stopPropagation()
    if (this.props.goBack) {
      this.props.goBack()
    } else {
      this.props.history.goBack()
    }
  }

  render() {
    return (
      <div className="full-screen animated bounceInRight">
        <div className="FBH FBAC FBJS top-bar">
          <label onClick={this.goBack}>
            <Icon type="left" style={{fontSize: 16, paddingRight: 8}} />
            <span>返回</span>
          </label>
          <span className="line">|</span>
          <h3>{this.props.title}</h3>
          {this.props.showButton && (
            <Button
              style={{marginLeft: 'auto', marginRight: '24px'}}
              disabled={this.props.buttonDisabled}
              onClick={() => this.props.onButtonClick()}
            >
              确定
            </Button>
          )}
        </div>
        <div className="full-screen-main">{this.props.children}</div>
      </div>
    )
  }
}

Component.propTypes = {
  title: PropTypes.string,
  showButton: PropTypes.bool,
  buttonDisabled: PropTypes.bool,
  onButtonClick: PropTypes.func,
  goBack: PropTypes.func,
}

FullScreen.defaultProps = {
  title: '全屏标题',
  showButton: false,
  buttonDisabled: false,
  onButtonClick: () => null,
}

export default withRouter(FullScreen)
