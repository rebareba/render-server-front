/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2020-05-20 10:52:22
 * @Description: render模板配置
 */

/* eslint-disable */

const pkg = require('../package.json')
const fs = require('fs');
const path = require('path');
const index = process.argv[2];
let filePath;
if (index) {
  filePath = path.join(__dirname, `../dist/${pkg.name}/${pkg.version}/${index}.html`)
} else {
  filePath = path.join(__dirname, `./render-server.ejs`);
}


let data = fs.readFileSync(filePath);

console.log(JSON.stringify(data.toString()));
