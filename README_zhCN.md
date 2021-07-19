# [English](./README.md) | 简体中文

## 介绍
10pdf是一个基于pdf.js的PDF文件渲染服务器，所有的渲染都在nodejs的服务器中完成，因此性能不如在浏览器端使用pdf.js。
本项目最低支持的浏览器版本为IE10，事实上如果使用JQuery编写页面可以获得更低版本IE浏览器的支持。

## 为什么
这是一个尴尬的问题，将pdf文件放在服务器端渲染在大部分情况下是毫无意义的。

仅当你有以下需求时可以考虑选择使用服务器端渲染：
- 客户浏览器浏览器版本较低（但是高于IE10&#x1f605;），且本地没有安装adobe acrobat插件。
- pdf文件内容较多，或者客户机器性能差。服务器的渲染结果不会像客户端渲染拖累机器性能。
- 较细颗粒度的权限控制：如不允许用户复制文本，仅允许查看特定页数的文档内容等。

由于支持IE10，框架依旧使用的是Vue2。更高版本的Vue会使得该项目的意义进一步下降&#x1f915;

## 如何运行

**由于服务器端用到了部分NodeJS 12+的特性，请确保本地的nodejs版本高于12**
```shell
npm install --production
npm run start
```
如果想添加可预览的文档，请将pdf文件拷贝至server/static/pdf_cache。当然也可以直接请求网络资源，10pdf会缓存远程资源至该文件夹。

### config json
10pdf 会使用数据库对已经渲染过的资源进行缓存，默认使用sqllite对已经渲染的资源进行缓存，可以配置 config.json (server/config.json) 来使用mongodb作为默认的数据库。

| Props        | Description                              | Type   |
| ------------ | ---------------------------------------- | ------ |
| databaseType | "sqlite"/"mongodb" sqlite 是默认的数据库 | String |
| servername   | mongodb 主机地址                         | String |
| DATABASE     | mongodb 使用的数据库名称                 | String |
| port         | mongodb 端口                             | Number |
| user         | mongodb 需要认证的用户名                 | String |
| pass         | mongodb 密码                             | String |
| authSource   | mongodb 的 authSource                    | String |

## 感谢

[pdf.js](https://github.com/mozilla/pdf.js)
项目中的HTML结构及CSS样式直接复制自其自带的example。

