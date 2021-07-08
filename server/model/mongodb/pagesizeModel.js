const mongoose = require('./db')

const PagesizeSchema = mongoose.Schema({
  url: {
    type: String,
    index: true,
  },
  result: String,
})
const Pagesize = mongoose.model('Pagesize', PagesizeSchema)

class PagesizeModel {
  static async get(ctx) {
    const result = await Pagesize.findOne({ url: ctx.reqPDFUrl })
    return result
  }

  static async set(obj) {
    new Pagesize(obj).save()
  }
}

module.exports = PagesizeModel
