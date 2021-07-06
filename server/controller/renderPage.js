const { ImageModel } = require('../model/imageModel')
const { renderPDFImage } = require('../utils/pdf_render')

const renderPage = async (ctx) => {
  const dbres = await ImageModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await renderPDFImage(ctx.filePath, ctx.viewport, ctx.pageNum)
      ImageModel.set({
        url: ctx.reqPDFUrl,
        result: data,
      })
      ctx.type = 'image/png'
      ctx.body = data
    } catch (error) {
      ctx.type = 'html'
      ctx.body = 'error'
    }
  } else {
    ctx.type = 'image/png'
    ctx.body = dbres.result
  }
}

module.exports = renderPage
