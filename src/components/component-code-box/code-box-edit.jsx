import React, {useEffect} from 'react'
import {observer} from 'mobx-react'
import CodeMirror from 'codemirror'

const CodeBoxEdit = ({value, width, onChange}) => {
  const codeRef = React.createRef()

  useEffect(() => {
    if (codeRef) {
      const editor = CodeMirror.fromTextArea(codeRef, {
        lineNumbers: true, // 是否显示行号
        mode: {name: 'javascript', json: true}, // 默认脚本编码
        lineWrapping: false, // 是否强制换行
        readOnly: false,
      })
      editor.setSize('auto', width || 'auto') // 设置高度自适应
      editor.on('change', (doc) => {
        onChange(doc.getValue())
      })
    }
  }, [])
  return (
    <div>
      <textarea rows="3" ref={codeRef} defaultValue={value} />
    </div>
  )
}

export default observer(CodeBoxEdit)
