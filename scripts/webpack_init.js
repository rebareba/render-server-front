/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2020-07-10 16:30:46
 * @Description: webpack的脚本，动态生成mock.json和config/conf.json
 */ 
const path = require('path')
const fs = require('fs')
const config = require('../config')

/**
 * 初始化项目的配置 动态生成mock.json和config/conf.json
 * @param {string} env  dev|build
 */
 module.exports = (env = 'dev') => {
  // 1.根据环境变量来生成
  if (env === 'build') {
    fs.writeFileSync(path.join(__dirname, '../config/conf.json'), JSON.stringify(config.conf.build, null, '\t'))
  } else {
    fs.writeFileSync(path.join(__dirname, '../config/conf.json'), JSON.stringify(config.conf.dev, null, '\t'))
  }

  // 2.动态生成mock数据 读取src文件夹下面所有以 -mock.json结尾的文件 存储到io/index.json文件当中
  let mockJson = {}
  const mockFiles = syncWalkDir(path.join(__dirname, '../src'), (file) => /-mock.json$/.test(file))
  console.log('mocks: ->>>>>>>>>>>>>>>>>>>>>>>')
  mockFiles.forEach((filePath) => {
    const p = path.parse(filePath)
    const mockKey = p.name.substr(0, p.name.length - 5)
    console.log(mockKey, filePath)
    if (mockJson[mockKey]) {
      console.error('mockKey exist', filePath)
      process.exit(0)
    }
    mockJson[mockKey] = require(filePath)
  })
  // 如果是生产 mock数据筛选
  if (env === 'build') {
    // 如果是打包环境， 最小化mock资源数据
    const mockMap = config.conf.build.mock || {}
    const buildMockJson = {}
    Object.keys(mockMap).forEach((key) => {
      const [name, method] = key.split('.')
      if (mockJson[name][method] && mockJson[name][method][mockMap[key]]) {
        if (!buildMockJson[name]) buildMockJson[name] = {}
        if (!buildMockJson[name][method]) buildMockJson[name][method] = {}
        buildMockJson[name][method][mockMap[key]] = mockJson[name][method][mockMap[key]]
      }
    })
    mockJson = buildMockJson
  }
  fs.writeFileSync(path.join(__dirname, '../mock.json'), JSON.stringify(mockJson, null, '\t'))
 }

 /**
 * 同步获取目录的文件列表
 * @param {paht} dir
 * @param {function} fileter 路径过滤器方法 返回true或false
 */
function syncWalkDir(dir = __dirname, filter) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    file = path.resolve(dir, file)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      results = results.concat(syncWalkDir(file, filter))
    }
    if (filter && filter(file)) {
      results.push(file)
    }
  })
  return results
}
