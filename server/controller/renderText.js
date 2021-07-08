const { renderPDFTextContent } = require('../utils/pdf_render')
const { databaseType } = require('../config.json')
const TextModelMongo = require('../model/mongodb/textModel')
const TextModelSqlite = require('../model/sqlite/textModel')

const useMongo = databaseType === 'mongodb'

const renderText = async (ctx) => {
  let dbres
  if (useMongo) {
    dbres = await TextModelMongo.get(ctx)
  } else {
    dbres = await TextModelSqlite.get(ctx)
  }
  if (dbres === null) {
    try {
      const data = await renderPDFTextContent(
        ctx.filePath,
        ctx.pageNum,
        ctx.viewport
      )
      ctx.body = { status: 200, data, msg: '' }
      if (useMongo) {
        TextModelMongo.set({
          url: ctx.reqPDFUrl,
          result: JSON.stringify(data),
        })
      } else {
        TextModelSqlite.set({
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

module.exports = renderText
