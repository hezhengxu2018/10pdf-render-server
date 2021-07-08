const { renderPDFImage } = require('../utils/pdf_render')
const { databaseType } = require('../config.json')
const ImageModelMongo = require('../model/mongodb/imageModel')
const ImageModelSqlite = require('../model/sqlite/imageModel')

const useMongo = databaseType === 'mongodb'
const renderPage = async (ctx) => {
  let dbres
  if (useMongo) {
    dbres = await ImageModelMongo.get(ctx)
  } else {
    dbres = await ImageModelSqlite.get(ctx)
  }
  if (dbres === null) {
    try {
      const data = await renderPDFImage(ctx.filePath, ctx.viewport, ctx.pageNum)
      ctx.type = 'image/png'
      ctx.body = data
      if (useMongo) {
        ImageModelMongo.set({
          url: ctx.reqPDFUrl,
          result: data,
        })
      } else {
        ImageModelSqlite.set({
          url: ctx.reqPDFUrl,
          result: data,
        })
      }
    } catch (error) {
      ctx.type = 'html'
      ctx.body = error
    }
  } else {
    ctx.type = 'image/png'
    ctx.body = dbres.result
  }
}

module.exports = renderPage
