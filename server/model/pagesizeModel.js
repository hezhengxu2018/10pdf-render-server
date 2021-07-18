const { databaseType } = require('../config.json')
const PagesizeModelMongo = require('./mongodb/pagesizeModel')
const PagesizeModelSqlite = require('./sqlite/pagesizeModel')

const useMongo = databaseType === 'mongodb'
class PagesizeModel {
  static get(ctx) {
    if (useMongo) {
      return PagesizeModelMongo.get(ctx)
    }
    return PagesizeModelSqlite.get(ctx)
  }

  static set(obj) {
    if (useMongo) {
      return PagesizeModelMongo.set(obj)
    }
    return PagesizeModelSqlite.set(obj)
  }
}

module.exports = PagesizeModel
