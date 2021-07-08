const { getPDFPageSize } = require('../utils/pdf_render')
const { databaseType } = require('../config.json')
const pagesizeModelMongo = require('../model/mongodb/pagesizeModel')
const pagesizeModelSqlite = require('../model/sqlite/pagesizeModel')

const useMongo = databaseType === 'mongodb'
const getPagesize = async (ctx) => {
  let dbres
  if (useMongo) {
    dbres = await pagesizeModelMongo.get(ctx)
  } else {
    dbres = await pagesizeModelSqlite.get(ctx)
  }
  if (dbres === null) {
    try {
      const data = await getPDFPageSize(ctx.filePath, ctx.viewport)
      ctx.body = { status: 200, data, msg: '' }
      if (useMongo) {
        pagesizeModelMongo.set({
          url: ctx.reqPDFUrl,
          result: JSON.stringify(data),
        })
      } else {
        pagesizeModelSqlite.set({
          url: ctx.reqPDFUrl,
          result: JSON.stringify(data),
        })
      }
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getPagesize
