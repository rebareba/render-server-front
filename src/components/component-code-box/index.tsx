import CodeBoxR from './code-box-read'
import CodeBoxE from './code-box-edit'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
// 主题风格
// import 'codemirror/theme/idea.css'

// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/javascript/javascript'

import './code-box.styl'

export const CodeBoxRead = CodeBoxR

export const CodeBoxEdit = CodeBoxE
