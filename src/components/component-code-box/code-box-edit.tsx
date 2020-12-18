import {Component} from 'react'
import {observer} from 'mobx-react'
import CodeMirror from 'codemirror'

@observer
class CodeBoxEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: props.value,
    }
  }
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.textareaNode, {
      lineNumbers: true, // 是否显示行号
      mode: {name: 'javascript', json: true}, // 默认脚本编码
      lineWrapping: false, // 是否强制换行
      readOnly: false,
    })
    this.editor.setSize('auto', this.props.width || 'auto') // 设置高度自适应
    this.editor.on('change', this.codemirrorValueChanged)
  }
  codemirrorValueChanged = (doc, change) => {
    this.props.onChange(doc.getValue())
  }
  render() {
    return (
      <div>
        <textarea rows="3" ref={(ref) => (this.textareaNode = ref)} defaultValue={this.state.defaultValue}></textarea>
      </div>
    )
  }
}

export default CodeBoxEdit
