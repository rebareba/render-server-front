import React, {useEffect} from 'react'

import {toJS} from 'mobx'

import {inject, observer} from 'mobx-react'

import Markdow from '@components/markdown'

import pluginStore from './plugin-store'

const Plugin = () => {
  const {plugin} = pluginStore
  useEffect(() => {
    pluginStore.markdown('plugin')
  }, [])

  return <Markdow source={toJS(plugin)} />
}

export default inject('globalStore')(observer(Plugin))
