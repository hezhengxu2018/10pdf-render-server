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
you can put the pdf file into server/static/pdf_cache directory or use the Internet resource directly, 10pdf can cache remote file into this directory

### config json
10pdf can use database to cache the render result, you can set config.json (server/config.json) to use mongodb as default database.

| Props        | Description                                      | Type   |
| ------------ | ------------------------------------------------ | ------ |
| databaseType | "sqlite"/"mongodb" sqlite is the default databse | String |
| servername   | mongodb host address                             | String |
| DATABASE     | mongodb database name                            | String |
| port         | mongodb port                                     | Number |
| user         | mongodb auth user                                | String |
| pass         | mongodb password                                 | String |
| authSource   | authSource of mongodb                            | String |
## Acknowledgement

[pdf.js](https://github.com/mozilla/pdf.js)
not only offer the render engine, but also HTML structure and CSS. 