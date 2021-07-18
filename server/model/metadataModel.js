const { databaseType } = require('../config.json')
const MetaDataMongo = require('./mongodb/metadataModel')
const MetaDataSqlite = require('./sqlite/metadataModel')

const useMongo = databaseType === 'mongodb'
class MetaDataModel {
  static get(ctx) {
    const Ctx = { reqPDFUrl: ctx.filePath }
    if (useMongo) {
      return MetaDataMongo.get(Ctx)
    }
    return MetaDataSqlite.get(Ctx)
  }

  static set(obj) {
    if (useMongo) {
      return MetaDataMongo.set(obj)
    }
    return MetaDataSqlite.set(obj)
  }
}

module.exports = MetaDataModel
