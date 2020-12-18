## 介绍

前端为前端渲染服务的前端代码
## 目录结构

```
.
├── Makefile                   --- 打成tar包的命令
├── README.md                  --- 说明文件
├── config                     --- webpack 和 前端 配置文件目录
│   ├── config.js              --- 开发自定义配置替换default
│   ├── config_default.js      --- 默认的开发配置
│   └── index.js               --- webpack配置入口
│   └── conf.json              --- 前端配置 动态生成
├── .gitignore                 --- eslint代码规范配置文件
├── .babelr                    --- 转码规则和插件配置文件
├── .eslintr                   --- eslint代码规范配置文件
├── package-lock.json          --- eslint代码规范配置文件
├── package.json               --- 项目配置 及 脚本命令
├── tsconfig.json              --- typescript 配置文件
├── webpack.config.dev.js      --- npn run dev的依赖webpack配置
├── webpack.config.js          --- npn run build的依赖webpack配置
└── src                        --- 项目代码
    ├── admin.tsx              --- admin 入口
    ├── index.tsx              --- 前端入口
    ├── assets                 --- 静态文件
    ├── common                 --- 通用工具的文件夹
    │   ├── common.styl        --- 默认的样式
    │   ├── flexbox.css        --- 默认的flex布局样式
    │   ├── history.tsx        --- 路由
    │   └── utils.tsx          --- 通用工具的方法
    ├── components             --- 通用的组件目录
    ├── frame                  --- 页面布局目录
    ├── html                   --- webpack对应的插件地址和入口文件名对应
    ├── icon                   --- 使用svg-sprite-loader 这个插件的svg目录
    ├── io                     --- ajax请求的接口配置地址
    ├── mock                   --- mock数据
    ├── pages                  --- 页面集合目录
    └── store                  --- 全局store目录

```
## 常用命令

- 本地启动项目
    - 下面的命令会启动两个服务，一个是静态资源的监听服务，一个是 node 端服务

```angular2html
npm run dev

npm run ts-check

npm run build

npm run build-normal

npm run build-cdn

```
### 三级

多得多
