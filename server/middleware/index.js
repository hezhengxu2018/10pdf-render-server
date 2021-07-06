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
}
