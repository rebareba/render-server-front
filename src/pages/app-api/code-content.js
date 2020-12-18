import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import InfoBox from '@src/components/component-info-box'
import {CodeBoxEdit} from '@src/components/component-code-box'

@observer
class CodeContent extends Component {
  constructor() {
    super()
    store.resultSample = store.detail.resultSample
    store.failResultSample = store.detail.failResultSample
    store.mockContent = store.detail.mockContent
  }

  @action.bound handleGetMockContent(mode, content) {
    store[mode] = content
  }

  render() {
    return (
      <div>
        <InfoBox title="成功返回结果示例" bodyStyle={{padding: '0'}}>
          <CodeBoxEdit
            value={store.detail.resultSample || ''}
            onChange={(content) => this.handleGetMockContent('resultSample', content)}
          />
        </InfoBox>

        <InfoBox title="失败返回结果示例" bodyStyle={{padding: '0'}}>
          <CodeBoxEdit
            value={store.detail.failResultSample || ''}
            onChange={(content) => this.handleGetMockContent('failResultSample', content)}
          />
        </InfoBox>

        <InfoBox title="Mock数据" bodyStyle={{padding: '0'}}>
          <CodeBoxEdit
            value={store.detail.mockContent || ''}
            onChange={(content) => this.handleGetMockContent('mockContent', content)}
          />
        </InfoBox>
      </div>
    )
  }
}

export default CodeContent
