import React from 'react'
import {List, Spin, Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import cls from 'classnames'

@observer
class TestCase extends React.Component {
  constructor(props) {
    super(props)
    const {store} = this.props
    store.getTestCaseList()
  }

  @action.bound handleShowHide() {
    const {store} = this.props
    store.showCase = !store.showCase
  }

  @action.bound handleClick(caseId) {
    console.log('handleClick', caseId)
    const {store} = this.props
    store.useCase(caseId)
  }

  // 删除测试用例
  @action.bound handleDelete(caseId) {
    const {store} = this.props
    return store.deleteCase(caseId)
  }

  render() {
    const {store} = this.props
    return (
      <div className={cls({'test-case': true, 'show-case': store.showCase, FBH: true})}>
        <div className={cls({'top-block': true, 'params-active': store.showCase})} onClick={this.handleShowHide}>
          <span>测试用例</span>
        </div>
        <div className={cls({'param-container': true, 'param-container-show': store.showCase})}>
          <Spin spinning={store.caseListLoading}>
            <List
              bordered
              dataSource={store.caseList}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      className="button-style-hover"
                      type="primary"
                      onClick={() => this.handleDelete(item.caseId)}
                    >
                      删除
                    </Button>,
                  ]}
                  key={item.caseId}
                >
                  <div className="test-case-item" onClick={() => this.handleClick(item.caseId)}>
                    <Button type="link">{item.name}</Button>
                  </div>
                </List.Item>
              )}
            />
          </Spin>
        </div>
      </div>
    )
  }
}

export default TestCase

//  <button className="button-style-hover">重命名</button>,
