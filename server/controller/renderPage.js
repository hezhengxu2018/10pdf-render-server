const { renderPDFImage } = require('../utils/pdf_render')
const ImageModel = require('../model/imageModel')

const renderPage = async (ctx) => {
  const dbres = await ImageModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await renderPDFImage(ctx.fileData, ctx.viewport, ctx.pageNum)
      ctx.type = 'image/png'
      ctx.body = data
      ImageModel.set({
        url: ctx.reqPDFUrl,
        result: data,
      })
    } catch (error) {
      ctx.type = 'html'
      ctx.body = error
    }
  } else {
    ctx.type = 'image/png'
    ctx.body = dbres.result
  }
}

module.exports = renderPage
