import React from 'react'
class BoxItem extends React.Component {
  render() {
    return (
      <div className="filed-item">
        <label className="box-item-label">{this.props.label}</label>
        <span className="value-box">{this.props.value}</span>
        {this.props.action && (
          <button className="button-style ml24" onClick={this.props.action}>
            {' '}
            编辑{' '}
          </button>
        )}
      </div>
    )
  }
}

export default BoxItem
