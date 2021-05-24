import React, {useEffect} from 'react'
import {observer, inject} from 'mobx-react'
import Sidebar from './sidebar'
import TestContent from './api-content'
import AppContent from './app-content'
import ApiNewEdit from './api-new-edit'
import AppApiStore from './app-api-store'

const pageKeys = ['index', 'new']
const store = new AppApiStore()

const AppApi = ({match}) => {
  const {appKey, apiId} = match.params
  console.log('appKey, apiId', appKey, apiId)
  useEffect(() => {
    console.log(' useEffect appKey, apiId', appKey, apiId)
    store.setValue('appKey', appKey)
    store.setValue('apiId', apiId)
    store.getAppApiList(appKey)
    return () => {
      store.clean()
    }
  }, [appKey, apiId])
  return (
    <div className="page-container page-test fbh" style={{overflowY: 'hidden'}}>
      <Sidebar store={store} />
      {store.apiId === 'index' ? <AppContent store={store} /> : null}
      {store.apiId === 'new' ? <ApiNewEdit store={store} /> : null}
      {pageKeys.indexOf(store.apiId) < 0 && store.editApi ? <ApiNewEdit store={store} /> : null}
      {pageKeys.indexOf(store.apiId) < 0 && !store.editApi ? <TestContent key={Math.random()} store={store} /> : null}
    </div>
  )
}

export default inject('globalStore')(observer(AppApi))
