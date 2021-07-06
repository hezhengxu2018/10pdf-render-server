const { renderPDFTextContent } = require('../utils/pdf_render')
const { TextModel } = require('../model/textModel')

const renderText = async (ctx) => {
  const dbres = await TextModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await renderPDFTextContent(
        ctx.filePath,
        ctx.pageNum,
        ctx.viewport
      )
      ctx.body = { status: 200, data, msg: '' }
      TextModel.set({
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

module.exports = renderText
