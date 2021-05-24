import React, {useEffect} from 'react'
import {observer} from 'mobx-react'
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter'
// 设置高亮样式
import {xonokai} from 'react-syntax-highlighter/dist/esm/styles/prism'
// 设置高亮的语言
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
// import { jsx, javascript } from "react-syntax-highlighter/dist/esm/languages/prism";
const CodeBlock = ({language, value}) => {
  useEffect(() => {
    SyntaxHighlighter.registerLanguage('javascript', javascript)
    SyntaxHighlighter.registerLanguage('js', javascript)
    SyntaxHighlighter.registerLanguage('jsx', jsx)
  }, [])

  return (
    <figure className="highlight">
      <SyntaxHighlighter language={language} style={xonokai}>
        {value}
      </SyntaxHighlighter>
    </figure>
  )
}
export default observer(CodeBlock)
