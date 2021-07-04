const mongoose = require('./db')

const PagesizeSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  file_hash: String,
  result: String,
})
const Pagesize = mongoose.model('Pagesize', PagesizeSchema)

module.exports = {
  Pagesize,
}
