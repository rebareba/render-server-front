import React, {useState, useEffect} from 'react'
import {Menu, Input, Button} from 'antd'
import {FolderOutlined} from '@ant-design/icons'
import {action, observable, computed, toJS} from 'mobx'
import {observer} from 'mobx-react'
// import store from './api-store'
import {config, history} from '@utils'
import {Link} from 'react-router-dom'

const {SubMenu} = Menu
const {Search} = Input

const Sidebar = ({store}) => {
  /** 搜索列表 */
  const [searchResult, setSearchResult] = useState([])

  /** 搜索关键词 */
  const [searchKey, setSearchKey] = useState('')

  const openKeys = () => {
    if (store.list.length) {
      const api = store.apiList.find((item) => item.apiId === store.apiId)
      if (api) {
        return [api.cateCode]
      }
    }
    return []
  }

  const handleSearch = (e) => {
    setSearchKey(e.target.value)
    if (searchKey) {
      const results = store.list
        .filter((item) => item.type !== 'folder')
        .filter((item) => item.title.toLowerCase().includes(searchKey.toLowerCase()))
      setSearchResult(results)
    } else {
      searchResult.replace([])
      setSearchResult([])
    }
  }

  const handleSelect = (e) => {
    history.push(`${config.pathPrefix}/app/${store.appKey}/apis/${e.key}`)
  }

  function renderTree(treeData) {
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
        // arr.push(<Menu.Item key={item.key}>{item.title}</Menu.Item>)
      }
      return true
    })
    return arr
  }

  const treeData = searchKey ? searchResult : store.treeData
  const {appInfo, appKey} = store
  const appInfoData = toJS(appInfo)
  return (
    <div className="sidebar-test">
      <div className="fs20 fbh p6">
        <div style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} className="fb1">
          <Link to={`${config.pathPrefix}/app/${appKey}/apis/index`}>{appInfoData.name}</Link>
        </div>
        <Link to={`${config.pathPrefix}/app/${appKey}/apis/new`}>
          <Button type="primary" className="m4">
            新建
          </Button>
        </Link>
      </div>
      <div className="sidebar-test-search">
        <Search style={{width: 240}} placeholder="请输入API名称关键字" onChange={handleSearch} />
      </div>
      <div className="sidebar-tree">
        {store.treeData.length ? (
          <Menu mode="inline" onSelect={handleSelect} selectedKeys={[store.apiId]} defaultOpenKeys={openKeys()}>
            {renderTree(treeData)}
          </Menu>
        ) : null}
      </div>
    </div>
  )
}

export default observer(Sidebar)
