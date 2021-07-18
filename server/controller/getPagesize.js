const { getPDFPageSize } = require('../utils/pdf_render')
const pagesizeModel = require('../model/pagesizeModel')

const getPagesize = async (ctx) => {
  const dbres = await pagesizeModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await getPDFPageSize(ctx.fileData, ctx.viewport)
      ctx.body = { status: 200, data, msg: '' }
      pagesizeModel.set({
        url: ctx.reqPDFUrl,
        result: JSON.stringify(data),
      })
    } catch (error) {
      ctx.throw(400, '获取文件失败')
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getPagesize
