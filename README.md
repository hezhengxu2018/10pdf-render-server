# English | [简体中文](./README_zhCN.md)

## Intro
10pdf is a pdf render server which is driven by pdf.js .

## Why
In most cases, render pdf by server is meanless, only when:
- Your users are still using IE and not install Adobe Acrobat Plugin yet.
- The PDF file size is quite large and you do not want to consume browser's performance too much.
- more precise permission control. e.g. forbid text copy.

## How to run 

**Notice: make sure your Node.js version is 12+**
```shell
npm install --production
npm run start
```

## Acknowledgement

[pdf.js](https://github.com/mozilla/pdf.js)
not only the render engine, but also HTML structure and CSS. 