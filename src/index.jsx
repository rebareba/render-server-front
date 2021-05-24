import React, {Suspense} from 'react'
import * as ReactDOM from 'react-dom'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale-provider/zh_CN'
import {Router, Route, Switch, Redirect} from 'react-router-dom'
import {Provider} from 'mobx-react'

import '@common/flexbox.styl'
import '@common/common.styl'
import '@common/colors.styl'
import '@icons'

import {config, history} from '@utils'

import GlobalStore from '@common/global-store'

import Login from '@pages/login'

import Frame from '@src/frame'

import Home from '@pages/home'

import About from '@pages/about'

import AppApi from '@pages/app-api'

const stores = {globalStore: new GlobalStore()}

const App = () => {
  return (
    <Suspense fallback="加载中">
      <Router history={history}>
        <Switch>
          <Route path={`${config.pathPrefix}/login`} component={Login} />
          <Frame>
            <Switch>
              <Route path={`${config.pathPrefix}/home`} component={Home} />
              <Route path={`${config.pathPrefix}/about`} component={About} />
              <Route path={`${config.pathPrefix}/plugin`} component={Plugin} />
              <Route exact strict path={`${config.pathPrefix}/app/:appKey/apis/:apiId`} component={AppApi} />
              <Route path={`${config.pathPrefix}/404`} render={() => <div style={{fontSize: 100}}>404</div>} />

              <Redirect from="/" to={`${config.pathPrefix}/home`} />
            </Switch>
          </Frame>
        </Switch>
      </Router>
    </Suspense>
  )
}
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
)
