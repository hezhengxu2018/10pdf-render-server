const { PagesizeModel } = require('../model/pagesizeModel')
const { getPDFPageSize } = require('../utils/pdf_render')

const getPagesize = async (ctx) => {
  const dbres = await PagesizeModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await getPDFPageSize(ctx.filePath, ctx.viewport)
      ctx.body = { status: 200, data, msg: '' }
      PagesizeModel.set({
        url: ctx.reqPDFUrl,
        result: JSON.stringify(data),
      })
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getPagesize
