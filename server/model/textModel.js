const mongoose = require('./db')

const TextSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  result: String,
})
const Text = mongoose.model('Text', TextSchema)

module.exports = {
  Text,
}
