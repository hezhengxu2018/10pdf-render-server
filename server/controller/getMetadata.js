const md5 = require('md5')
const fs = require('fs/promises')
const axios = require('axios')
const path = require('path')
const { getPDFMetadata } = require('../utils/pdf_render')
const MetadataModel = require('../model/metadataModel')

const getMetadata = async (ctx) => {
  const dbres = await MetadataModel.get(ctx)
  if (dbres === null) {
    try {
      let PDFFileData
      let pdfmd5
      if (ctx.filePath.indexOf('/') > 0) {
        // remote resource
        const httpRes = await axios.get(ctx.filePath, {
          responseType: 'arraybuffer',
        })
        PDFFileData = httpRes.data
        pdfmd5 = md5(PDFFileData)
        const tempPDFPath = path.resolve(
          __dirname,
          `../static/pdf_cache/${pdfmd5}.pdf`
        )
        try {
          await fs.stat(tempPDFPath)
        } catch (error) {
          if (error.errno === -4058) {
            fs.writeFile(tempPDFPath, PDFFileData)
          } else {
            ctx.throw(400, '读取文件失败')
          }
        }
      } else {
        // local resource
        const localPDFFile = path.resolve(
          __dirname,
          `../static/pdf_cache/${ctx.filePath}`
        )
        try {
          await fs.stat(localPDFFile)
          PDFFileData = await fs.readFile(localPDFFile)
          pdfmd5 = path.basename(ctx.filePath, '.pdf')
        } catch (error) {
          ctx.throw(400, '读取文件失败')
        }
      }

      const returnData = await getPDFMetadata(PDFFileData)
      ctx.body = { status: 200, data: returnData, msg: '' }
      returnData.contentLength = PDFFileData.length
      MetadataModel.set({
        url: ctx.filePath,
        fileHash: pdfmd5,
        result: JSON.stringify(returnData),
      })
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
    }
  } else {
    const data = JSON.parse(dbres.result)
    ctx.body = { status: 200, data, msg: '' }
  }
}

module.exports = getMetadata
