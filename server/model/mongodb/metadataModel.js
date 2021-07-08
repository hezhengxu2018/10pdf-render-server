const mongoose = require('./db')

const MetadataSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  file_hash: String,
  result: String,
})
const Metadata = mongoose.model('Metadata', MetadataSchema)

class MetadataModel {
  static async get(ctx) {
    const result = await Metadata.findOne({ url: ctx.reqPDFUrl })
    return result
  }

  static async set(obj) {
    new Metadata(obj).save()
  }
}

module.exports = MetadataModel
