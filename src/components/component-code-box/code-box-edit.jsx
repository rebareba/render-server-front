import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Controlled as CodeMirror} from 'react-codemirror2'

const CodeBoxEdit = ({value, width, onChange}) => {
  const [data, setData] = useState(value)
  useEffect(() => {
    console.log('CodeBoxEdit useEffect value', value)
    setData(value)
  }, [value])
  return (
    <div>
      <CodeMirror
        value={data}
        options={{
          lineNumbers: true, // 是否显示行号
          mode: {name: 'javascript', json: true}, // 默认脚本编码
          lineWrapping: false, // 是否强制换行
        }}
        onBeforeChange={(editor, data, value) => {
          // console.log('onBeforeChange', data, value)
          setData(value)
        }}
        onChange={(editor, data, value) => {
          // setData({value})
          onChange(value)
        }}
      />
    </div>
  )
}

export default observer(CodeBoxEdit)
