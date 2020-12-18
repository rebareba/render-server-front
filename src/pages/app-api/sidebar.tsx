import React from 'react'
import {Menu, Input, Badge, Dropdown, Button} from 'antd'
import {DownOutlined, FolderOutlined} from '@ant-design/icons'
import {action, observable, computed, toJS} from 'mobx'
import {observer} from 'mobx-react'
// import store from './api-store'
import {config, history} from '@src/common/utils'
import {Link} from 'react-router-dom'

const {SubMenu} = Menu
const {Search} = Input

@observer
class Sidebar extends React.Component {
  @observable store = this.props.store
  /** 搜索列表 */
  @observable searchResult = []

  /** 搜索关键词 */
  @observable searchKey = ''

  @computed get openKeys() {
    if (this.store.list.length) {
      const api = this.store.apiList.find((item) => item.apiId === this.store.apiId)
      if (api) {
        return [api.cateCode]
      }
    }
    return []
  }
  @action.bound handleSearch(e) {
    this.searchKey = e.target.value
    if (this.searchKey) {
      const results = this.store.list
        .filter((item) => item.type !== 'folder')
        .filter((item) => item.title.toLowerCase().includes(this.searchKey.toLowerCase()))

      this.searchResult.replace(results)
    } else {
      this.searchResult.replace([])
    }
  }

  @action.bound handleSelect(e) {
    history.push(`${config.pathPrefix}/app/${this.store.appKey}/apis/${e.key}`)
  }
  renderTree(treeData) {
    const arr = []
    treeData.forEach((item) => {
      if (item.children && item.children.length) {
        arr.push(
          <SubMenu
            key={item.key}
            title={
              <span>
                <FolderOutlined />
                <span>{item.title}</span>
              </span>
            }
          >
            {item.children.map((sitem) => {
              return <Menu.Item key={sitem.key}>{sitem.title}</Menu.Item>
            })}
          </SubMenu>,
        )
      } else {
        //arr.push(<Menu.Item key={item.key}>{item.title}</Menu.Item>)
      }
      return true
    })
    return arr
  }

  render() {
    const treeData = this.searchKey ? this.searchResult : this.store.treeData
    let {appInfo} = this.store
    appInfo = toJS(appInfo)
    return (
      <div className="sidebar-test">
        <div className="fs20 FBH p6">
          <div style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} className="FB1">
            <Link to={`${config.pathPrefix}/app/${this.store.appKey}/apis/index`}>{appInfo.name}</Link>
          </div>
          <Link to={`${config.pathPrefix}/app/${this.store.appKey}/apis/new`}>
            <Button type="primary" className="m4">
              新建
            </Button>
          </Link>
        </div>
        <div className="sidebar-test-search">
          <Search style={{width: 240}} placeholder="请输入API名称关键字" onChange={this.handleSearch} />
        </div>
        <div className="sidebar-tree">
          {this.store.treeData.length ? (
            <Menu
              mode="inline"
              onSelect={this.handleSelect}
              selectedKeys={[this.store.apiId]}
              defaultOpenKeys={this.openKeys}
            >
              {this.renderTree(treeData)}
            </Menu>
          ) : null}
        </div>
      </div>
    )
  }
}

export default Sidebar
