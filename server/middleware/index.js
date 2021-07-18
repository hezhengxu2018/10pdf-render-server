const fs = require('fs/promises')
const path = require('path')
const metadataModel = require('../model/metadataModel')

const genReqPDFUrl = async (ctx, next) => {
  let reqPDFUrl
  if (!ctx.query.viewport) {
    // if viewport does not exist, filePath is the only query param
    reqPDFUrl = `${ctx.query.filePath}`
  } else if (!ctx.query.pageNum) {
    // if pageNum does not exist, query params are filePath and viewport
    const viewport = Number(ctx.query.viewport).toFixed(2)
    reqPDFUrl = `${ctx.query.filePath}&viewport=${viewport}`
  } else {
    const pageNum = parseInt(ctx.query.pageNum, 10)
    const viewport = Number(ctx.query.viewport).toFixed(2)
    reqPDFUrl = `${ctx.query.filePath}&viewport=${viewport}&pageNum=${pageNum}`
  }
  ctx.reqPDFUrl = reqPDFUrl
  await next()
}

const checkFileExists = async (ctx, next) => {
  const queryRes = await metadataModel.get(ctx)
  if (queryRes) {
    const { fileHash } = queryRes
    // file with hash
    ctx.fileData = await fs.readFile(
      path.resolve(__dirname, `../static/pdf_cache/${fileHash}.pdf`)
    )
    await next()
  } else if (ctx.filePath.indexOf('/') > 0) {
    // remote file and have no record in database
    ctx.throw(400, 'you should request metadata first')
  } else {
    // local file and have no record in database
    const filePath = path.join(__dirname, '../static/pdf_cache', ctx.filePath)
    try {
      ctx.fileData = await fs.readFile(filePath)
    } catch (error) {
      if (error.code === 'ENOENT') {
        ctx.throw(404, '文件不存在')
      }
      ctx.throw(500, error)
    }
    await next()
  }
}

const genFileData = async (ctx, next) => {
  const dbres = await metadataModel.get(ctx)
  if (dbres.fileHash !== '') {
    ctx.fileData = await fs.readFile(
      path.join(__dirname, '../static/pdf_cache', `${dbres.fileHash}.pdf`)
    )
  }
  await next()
}

const validateFilePath = async (ctx, next) => {
  if (!ctx.query.filePath) {
    ctx.throw(400, '请求参数filePath缺失')
  }
  ctx.filePath = ctx.query.filePath
  await next()
}
const validateViewport = async (ctx, next) => {
  if (!ctx.query.viewport) {
    ctx.throw(400, '请求参数viewport缺失')
  }
  if (Number.isNaN(Number(ctx.query.viewport))) {
    ctx.throw(422, '请求参数viewport格式错误')
  }
  ctx.viewport = Number(Number(ctx.query.viewport).toFixed(2))
  await next()
}

const validatePageNum = async (ctx, next) => {
  if (!ctx.query.pageNum) {
    ctx.throw(400, '请求参数pageNum缺失')
  }
  if (Number.isNaN(Number(ctx.query.pageNum))) {
    ctx.throw(422, '请求参数pageNum格式错误')
  }
  ctx.pageNum = parseInt(ctx.query.pageNum, 10)
  await next()
}

module.exports = {
  genReqPDFUrl,
  validateFilePath,
  validateViewport,
  validatePageNum,
  checkFileExists,
  genFileData,
}
