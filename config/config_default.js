const pkg = require("../package.json");

module.exports = {
  // 名称
  projectName: pkg.name,
  version: pkg.version,

  // npm run build-cdn 打包的 publicPath 路径
  cdnPrefix: `//cdn.xxxx.com/${pkg.name}/${pkg.version}/`,
  // npm run build 打包的 publicPath 路径
  versionPrefix: `/${pkg.name}/${pkg.version}/`,
  // devServer.port
  port: 3333,
  // 接口匹配转发 devServer.proxy
  proxy: {
    "/render-server/api/*": {
      target: 'http://127.0.0.1:8888',
      changeOrigin: true, // 支持跨域请求
      secure: true // 支持 https
    }
  },
  rewrites: [
    // {
    //   from: /^\/admin/, to: '/admin.html'
    // },
  ],
  // 这个配置 config/conf.json中的数据
  conf: {
    dev: {
      title: "前端项目部署服务",
      pathPrefix: "/render-server",
      apiPrefix: "/render-server/api",
      debug: true,
      // mock数据模拟延迟
      delay: 500,
      mock: {}
    },
    build: {
      title: "前端项目部署服务",
      pathPrefix: "/render-server",
      apiPrefix: "/render-server/api",
      debug: false,
      mock: {}
    }
  }
};
