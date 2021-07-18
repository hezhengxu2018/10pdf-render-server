const { databaseType } = require('../config.json')
const TextModelMongo = require('./mongodb/textModel')
const TextModelSqlite = require('./sqlite/textModel')

const useMongo = databaseType === 'mongodb'
class TextModel {
  static get(ctx) {
    if (useMongo) {
      return TextModelMongo.get(ctx)
    }
    return TextModelSqlite.get(ctx)
  }

  static set(obj) {
    if (useMongo) {
      return TextModelMongo.set(obj)
    }
    return TextModelSqlite.set(obj)
  }
}

module.exports = TextModel
