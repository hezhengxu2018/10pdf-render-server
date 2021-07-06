const fs = require('fs')
const url = require('url')
const axios = require('axios')
const path = require('path')

const downloadFile = async (ctx) => {
  // generate the file name
  const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i
  const fileName = reFilename.exec(ctx.query.filePath)[0]
  let filePath
  if (url.parse(ctx.query.filePath).protocol === null) {
    // get pdf file from local storage
    filePath = path.join(__dirname, '../static', ctx.query.filePath)
    try {
      await fs.promises.stat(filePath)
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '文件不存在' }
    }
    ctx.set({
      'Content-Disposition': `attachment; filename=${fileName}`,
      'content-type': 'application/octet-stream',
    })
    ctx.body = fs.createReadStream(filePath)
  } else {
    // get pdf from Internet
    filePath = ctx.query.filePath
    try {
      const { data } = await axios.get(filePath, {
        responseType: 'arraybuffer',
      })
      ctx.set({
        'Content-Disposition': `attachment; filename=${fileName}`,
        'content-type': 'application/octet-stream',
      })
      ctx.body = data
    } catch (error) {
      ctx.body = { status: 404, data: {}, msg: '文件不存在' }
    }
  }
}

module.exports = downloadFile
