import React from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {CodeBoxEdit} from '@src/components/component-code-box'

@observer
class BodyDescription extends React.Component {
  constructor(props) {
    super(props)
    const {store} = this.props
  }

  @action.bound handleGetBodyDescription(content) {
    const {store} = this.props
    store.body = content
  }

  render() {
    const {store} = this.props
    return (
      <CodeBoxEdit
        value={store.defaultBody || ''}
        key={store.defaultBody || ''}
        onChange={this.handleGetBodyDescription}
      />
    )
  }
}

export default BodyDescription
