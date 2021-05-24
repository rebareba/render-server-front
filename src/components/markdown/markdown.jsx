import React from 'react'
import ReactMarkdown from 'react-markdown'
import {Anchor, Row, Col} from 'antd'

import {observer} from 'mobx-react'

import MarkNav from 'markdown-navbar'

import 'markdown-navbar/dist/navbar.css'

import CodeBlock from './code-block'

import './markdown.styl'

const Markdown = ({source}) => {
  return (
    <div className="markdown">
      <Row>
        <Col xs={24} sm={24} md={24} lg={18} xl={19}>
          <div className="md-content">
            <ReactMarkdown
              source={source}
              renderers={{
                code: CodeBlock,
              }}
              escapeHtml={false}
            >
              {' '}
            </ReactMarkdown>
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
