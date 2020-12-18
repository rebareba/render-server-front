import {createIo, APIS} from '@src/io'
// 用户登录相关接口配置
const apis: APIS = {
  // 1. 获取应用及所有api列表
  getAppApiList: {
    method: 'GET',
    url: '/app/:appKey',
  },
  // 2. 更新应用配置 包含hosts apiPrefix categoies
  updateApp: {
    method: 'PUT',
    url: '/app/:appKey',
  },
  // 3. 新增接口
  addApi: {
    method: 'POST',
    url: '/app/:appKey',
  },

  // 4. 获取单个API信息
  getApiDetail: {
    url: '/app/:appKey/api/:apiId',
  },
  // 5. 更新接口
  updateApi: {
    method: 'PUT',
    url: '/app/:appKey/api/:apiId',
  },

  // 6. 删除API
  deleteApi: {
    method: 'DELETE',
    url: '/app/:appKey/api/:apiId',
  },

  // 7. 获取接口的测试用例
  getTestCaseList: {
    url: '/app/:appKey/api/:apiId/case',
  },
  // 8. 获取接口的测试用例
  saveTestCase: {
    method: 'POST',
    url: '/app/:appKey/api/:apiId/case',
  },
  // 9. 获取接口的测试用例
  deleteCase: {
    method: 'DELETE',
    url: '/app/:appKey/api/:apiId/case/:caseId',
  },
  // 10. 测试接口
  testApi: {
    method: 'POST',
    url: '/test',
  },
}
export default createIo(apis, 'api')
