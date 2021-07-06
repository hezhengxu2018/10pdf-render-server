const mongoose = require('./db')

const ImageSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  result: Buffer,
})
const Image = mongoose.model('Image', ImageSchema)

class ImageModel {
  static async get(ctx) {
    const result = await Image.findOne({ url: ctx.reqPDFUrl })
    return result
  }

  static async set(obj) {
    new Image(obj).save()
  }
}

module.exports = {
  ImageModel,
}
