import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {Controlled as CodeMirror} from 'react-codemirror2'

// 直接value好像不行不知道为什么
const CodeBoxRead = ({value}) => {
  // console.log('value', value)
  const [data, setData] = useState(value)
  useEffect(() => {
    console.log('CodeBoxRead useEffect value', value)
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
          readOnly: false,
        }}
      />
    </div>
  )
}

export default observer(CodeBoxRead)
