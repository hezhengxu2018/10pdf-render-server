const { getPDFMetadata } = require('../utils/pdf_render')
const { databaseType } = require('../config.json')
const MetadataModelMongo = require('../model/mongodb/metadataModel')
const MetadataModelSqlite = require('../model/sqlite/metaDataModel')

const useMongo = databaseType === 'mongodb'
const getMetadata = async (ctx) => {
  let dbres
  if (useMongo) {
    dbres = await MetadataModelMongo.get(ctx)
  } else {
    dbres = await MetadataModelSqlite.get(ctx)
  }
  if (dbres === null) {
    try {
      const data = await getPDFMetadata(ctx.filePath)
      if (useMongo) {
        MetadataModelMongo.set({
          url: ctx.reqPDFUrl,
          file_hash: '',
          result: JSON.stringify(data),
        })
      } else {
        MetadataModelSqlite.set({
          url: ctx.reqPDFUrl,
          file_hash: '',
          result: JSON.stringify(data),
        })
      }

      ctx.body = { status: 200, data, msg: '' }
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getMetadata
