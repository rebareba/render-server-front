import React from 'react'
import ReactMarkdown from 'react-markdown'
import {Anchor, Row, Col} from 'antd'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'

import CodeBlock from './code-block'

import {observer} from 'mobx-react'

import './markdown.styl'
@observer
export default class Markdown extends React.Component<any, any> {
  render() {
    const {props} = this
    return (
      <div className="markdown">
        <Row>
          <Col xs={24} sm={24} md={24} lg={18} xl={19}>
            <div className="md-content">
              <ReactMarkdown
                source={props.source}
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
              <MarkNav source={props.source} />
            </Anchor>
          </Col>
        </Row>
      </div>
    )
  }
}
