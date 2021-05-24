import React, {useEffect} from 'react'
import {List, Spin, Button} from 'antd'
import {observer} from 'mobx-react'
import cls from 'classnames'

const TestCase = ({store}) => {
  useEffect(() => {
    store.getTestCaseList()
  }, [])

  const {showCase} = store

  return (
    <div className={cls({'test-case': true, 'show-case': showCase, fbh: true})}>
      <div
        className={cls({'top-block': true, 'params-active': store.showCase})}
        onClick={() => store.setValue('showCase', !showCase)}
      >
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
                  <Button className="button-style-hover" type="primary" onClick={() => store.deleteCase(item.caseId)}>
                    删除
                  </Button>,
                ]}
                key={item.caseId}
              >
                <div className="test-case-item" onClick={() => store.useCase(item.caseId)}>
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

export default observer(TestCase)
