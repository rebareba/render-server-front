import React from 'react'
import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import {xonokai} from 'react-syntax-highlighter/dist/esm/styles/prism'

import {Anchor, Row, Col} from 'antd'

import {observer} from 'mobx-react'

import MarkNav from 'markdown-navbar'

import 'markdown-navbar/dist/navbar.css'

import './markdown.styl'

const Markdown = ({source}) => {
  const components = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={xonokai}
          language={match[1]}
          PreTag="div"
          // eslint-disable-next-line react/no-children-prop
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      )
    },
  }
  return (
    <div className="markdown">
      <Row>
        <Col xs={24} sm={24} md={24} lg={18} xl={19}>
          <div className="md-content">
            <ReactMarkdown components={components}>{source}</ReactMarkdown>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={6} xl={5}>
          <Anchor className="md-guide">
            <div className="title">目录:</div>
            <MarkNav source={source} />
          </Anchor>
        </Col>
      </Row>
    </div>
  )
}

export default observer(Markdown)
