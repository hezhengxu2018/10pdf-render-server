const { getPDFMetadata } = require('../utils/pdf_render')
const { MetadataModel } = require('../model/metadataModel')

const getMetadata = async (ctx) => {
  const dbres = await MetadataModel.get(ctx)
  if (dbres === null) {
    try {
      const data = await getPDFMetadata(ctx.filePath)
      MetadataModel.set({
        url: ctx.reqPDFUrl,
        file_hash: '',
        result: JSON.stringify(data),
      })
      ctx.body = { status: 200, data, msg: '' }
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getMetadata
