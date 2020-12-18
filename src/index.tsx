import * as React from 'react'

import * as ReactDOM from 'react-dom'
import {ConfigProvider} from 'antd'
import zh_CN from 'antd/es/locale-provider/zh_CN'
import '@babel/polyfill'
import {config} from '@src/common/utils'
import {Router, Route, Switch, Redirect} from 'react-router-dom'

import history from '@src/common/history'

import {Provider} from 'mobx-react'
import GlobalStore from './io/global-store'
const stores = {globalStore: new GlobalStore()}

import '@src/common/flexbox.css'
import '@src/common/common.styl'

import Frame from './frame'

import Login from '@src/pages/login/login'
import Home from '@src/pages/home/home'
import About from '@src/pages/about/about'
import Plugin from '@src/pages/plugin/plugin'
import AppApi from '@src/pages/app-api'

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path={config.pathPrefix + '/login'} component={Login} />
          <Frame {...stores}>
            <Switch>
              <Route path={config.pathPrefix + '/home'} component={Home} />
              <Route path={config.pathPrefix + '/about'} component={About} />
              <Route path={config.pathPrefix + '/plugin'} component={Plugin} />
              <Route exact strict path={config.pathPrefix + '/app/:appKey/apis/:apiId'} component={AppApi} />
              <Route path={config.pathPrefix + '/404'} render={() => <div style={{fontSize: 100}}>404</div>} />
              <Redirect from="/" to={config.pathPrefix + '/home'} />
            </Switch>
          </Frame>
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
)
