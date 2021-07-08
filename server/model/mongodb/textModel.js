const mongoose = require('./db')

const TextSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  result: String,
})
const Text = mongoose.model('Text', TextSchema)

class TextModel {
  static async get(ctx) {
    const result = await Text.findOne({ url: ctx.reqPDFUrl })
    return result
  }

  static async set(obj) {
    new Text(obj).save()
  }
}

module.exports = TextModel
