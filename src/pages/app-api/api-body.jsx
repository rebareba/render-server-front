import React from 'react'
import {observer} from 'mobx-react'
import {CodeBoxEdit} from '@components/component-code-box'

const BodyDescription = ({store}) => {
  const {defaultBody} = store
  return (
    <CodeBoxEdit
      value={defaultBody || ''}
      key={defaultBody || ''}
      onChange={(content) => {
        store.setValue('body', content)
      }}
    />
  )
}

export default observer(BodyDescription)
