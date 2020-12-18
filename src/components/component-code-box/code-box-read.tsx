import React from 'react'
import {observer} from 'mobx-react'
import CodeMirror from 'codemirror'

export interface CodeBoxReadProps {
  value: any
  className?: string
}
@observer
class CodeBoxRead extends React.Component<CodeBoxReadProps, any> {
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.textareaNode, {
      lineNumbers: false, // 是否显示行号
      mode: {name: 'javascript', json: true}, // 默认脚本编码
      lineWrapping: false, // 是否强制换行
      readOnly: true,
    })
    this.editor.setSize('auto', 'auto') // 设置高度自适应
  }

  componentWillReceiveProps(nextProps) {
    this.editor.setValue(nextProps.value)
  }

  render() {
    return (
      <div>
        <textarea ref={(ref) => (this.textareaNode = ref)} defaultValue={this.props.value}></textarea>
      </div>
    )
  }
}

export default CodeBoxRead
