const mongoose = require('./db')

const MetadataSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  file_hash: String,
  result: Object,
})
const Metadata = mongoose.model('Metadata', MetadataSchema)

module.exports = {
  Metadata,
}
