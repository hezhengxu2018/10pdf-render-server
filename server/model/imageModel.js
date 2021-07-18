const { databaseType } = require('../config.json')
const ImageModelMongo = require('./mongodb/imageModel')
const ImageModelSqlite = require('./sqlite/imageModel')

const useMongo = databaseType === 'mongodb'
class ImageModel {
  static get(ctx) {
    if (useMongo) {
      return ImageModelMongo.get(ctx)
    }
    return ImageModelSqlite.get(ctx)
  }

  static set(obj) {
    if (useMongo) {
      return ImageModelMongo.set(obj)
    }
    return ImageModelSqlite.set(obj)
  }
}

module.exports = ImageModel
