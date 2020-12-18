import {createIo, APIS} from '.'
// 用户登录相关接口配置
const apis: APIS = {
  login: {
    method: 'POST',
    url: '/login',
    // mock: Mock.login
  },
  logout: {
    method: 'POST',
    url: '/logout',
  },
  loginInfo: {
    method: 'get',
    url: '/login_info',
    // mock: Mock.loginInfo
  },
  list: {
    method: 'GET',
    url: '/list',
  },
  markdown: {
    method: 'GET',
    url: '/markdown',
  },
  edit: {
    method: 'PUT',
    url: '/edit',
  },
  add: {
    method: 'POST',
    url: '/add',
  },
  delete: {
    method: 'DELETE',
    url: '/delete',
  },
}
export default createIo(apis, 'global')
