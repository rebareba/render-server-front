import * as React from 'react'

import {toJS} from 'mobx'

import {inject, observer} from 'mobx-react'

import Markdow from '../../components/markdown/markdown'

@inject('globalStore')
@observer
export default class About extends React.Component<any, any> {
  UNSAFE_componentWillMount() {
    this.props.globalStore.markdown('about')
  }
  render() {
    const md = toJS(this.props.globalStore.about)
    return <Markdow source={md} />
  }
}
