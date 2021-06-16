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
如果想添加可预览的文档，请将pdf文件拷贝至server/static/。由于目前的文档渲染是无状态且没有做缓存，因此请求网络中的pdf会大幅降低渲染性能。

## 感谢

[pdf.js](https://github.com/mozilla/pdf.js)
项目中的HTML结构及CSS样式直接复制自其自带的example。
