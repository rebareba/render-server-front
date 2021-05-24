import React, {useEffect} from 'react'

import {toJS} from 'mobx'

import {inject, observer} from 'mobx-react'

import Markdow from '@components/markdown'

import aboutStore from './about-store'

const About = () => {
  const {about} = aboutStore
  useEffect(() => {
    aboutStore.markdown('about')
  }, [])

  return <Markdow source={toJS(about)} />
}

export default inject('globalStore')(observer(About))
