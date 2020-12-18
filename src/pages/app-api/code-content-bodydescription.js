import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import InfoBox from '@src/components/component-info-box'
import {CodeBoxEdit} from '@src/components/component-code-box'

@observer
class CodeContentBodyDescription extends Component {
  constructor(props) {
    super()
    this.store = props.store
    store.bodyDescription = store.detail.bodyDescription
  }

  @action.bound handleGetMockContent(mode, content) {
    this.store.store[mode] = content
  }

  render() {
    return (
      <div>
        <InfoBox title="Body内容描述" bodyStyle={{padding: '0'}}>
          <CodeBoxEdit
            value={store.detail.bodyDescription || ''}
            onChange={(content) => this.handleGetMockContent('bodyDescription', content)}
          />
        </InfoBox>
      </div>
    )
  }
}

export default CodeContentBodyDescription
