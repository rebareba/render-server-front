import React from 'react'
import {observer, inject} from 'mobx-react'
import Sidebar from './sidebar'
import TestContent from './api-content'
import AppContent from './app-content'
import ApiNewEdit from './api-new-edit'
import AppApiStore from './app-api-store'
import {FrameProps, log} from '@src/common/utils'
const pageKeys = ['index', 'new']
const store = new AppApiStore()

@inject('globalStore')
@observer
class AppApi extends React.Component<FrameProps, any> {
  constructor(props) {
    super(props)
    store.appKey = this.props.match.params.appKey
    store.apiId = this.props.match.params.apiId
    log('AppApi', store.appKey, store.apiId)
    store.getAppApiList()
  }
  componentWillReceiveProps(nextProps) {
    store.appKey = nextProps.match.params.appKey
    store.apiId = nextProps.match.params.apiId
  }

  componentWillUnmount() {
    store.clean()
  }
  render() {
    // const store = new LeafStore(this.props.match.params.apiId, this.props.match.params.appKey)
    return (
      <div className="page-container page-test FBH" style={{overflowY: 'hidden'}}>
        <Sidebar store={store} />
        {store.apiId === 'index' ? <AppContent store={store} /> : null}
        {store.apiId === 'new' ? <ApiNewEdit store={store} /> : null}
        {pageKeys.indexOf(store.apiId) < 0 && store.editApi ? <ApiNewEdit store={store} /> : null}
        {pageKeys.indexOf(store.apiId) < 0 && !store.editApi ? <TestContent key={Math.random()} store={store} /> : null}
      </div>
    )
  }
}

export default AppApi
