const mongoose = require('./db')

const ImageSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  result: Buffer,
})
const Image = mongoose.model('Image', ImageSchema)

module.exports = {
  Image,
}
