import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter'
// 设置高亮样式
import {xonokai} from 'react-syntax-highlighter/dist/esm/styles/prism'
// 设置高亮的语言
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
// import { jsx, javascript } from "react-syntax-highlighter/dist/esm/languages/prism";
export interface CodeBlockProps {
  language: string
  value: string
}
class CodeBlock extends PureComponent<CodeBlockProps> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  }
  static defaultProps = {
    language: null,
  }
  componentDidMount() {
    // 注册要高亮的语法，
    // 注意：如果不设置打包后供第三方使用是不起作用的
    SyntaxHighlighter.registerLanguage('javascript', javascript)
    SyntaxHighlighter.registerLanguage('js', javascript)
    SyntaxHighlighter.registerLanguage('jsx', jsx)
  }
  render() {
    const {language, value} = this.props
    return (
      <figure className="highlight">
        <SyntaxHighlighter language={language} style={xonokai}>
          {value}
        </SyntaxHighlighter>
      </figure>
    )
  }
}
export default CodeBlock
