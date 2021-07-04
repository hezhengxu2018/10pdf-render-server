const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs')
const url = require('url')
const axios = require('axios')
const { Metadata } = require('./model/metadataModel')
const { Pagesize } = require('./model/pagesizeModel')
const { Text } = require('./model/textModel')
const { Image } = require('./model/imageModel')

const app = new Koa()
const {
  renderPDFImage,
  renderPDFTextContent,
  getPDFMetadata,
  getPDFPageSize,
} = require('./pdf_render')

const router = new Router({ prefix: '/api' })
const port = 3000
router.get('/renderPage', async (ctx) => {
  if (ctx.query.filePath && ctx.query.viewport && ctx.query.pageNum) {
    const viewport = Number(ctx.query.viewport)
    const pageNum = parseInt(ctx.query.pageNum, 10)
    const reqUrl = `${ctx.query.filePath}&viewport=${ctx.query.viewport}&pageNum=${pageNum}`
    const dbres = await Image.findOne({ url: reqUrl })
    if (dbres === null) {
      try {
        const data = await renderPDFImage(ctx.query.filePath, viewport, pageNum)
        const m = new Image({
          url: reqUrl,
          file_hash: '',
          result: data,
        })
        m.save()
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
  } else {
    ctx.type = 'application/json'
    ctx.body = { data: '参数错误' }
  }
})

router.get('/renderText', async (ctx) => {
  ctx.type = 'application/json'
  if (ctx.query.filePath && ctx.query.viewport && ctx.query.pageNum) {
    const viewport = Number(ctx.query.viewport)
    const pageNum = parseInt(ctx.query.pageNum, 10)
    const reqUrl = `${ctx.query.filePath}&viewport=${ctx.query.viewport}&pageNum=${pageNum}`
    const dbres = await Text.findOne({ url: reqUrl })
    if (dbres === null) {
      try {
        const data = await renderPDFTextContent(
          ctx.query.filePath,
          pageNum,
          viewport
        )
        const m = new Text({
          url: reqUrl,
          file_hash: '',
          result: JSON.stringify(data),
        })
        m.save()
        ctx.body = { status: 200, data, msg: '' }
      } catch (error) {
        ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
      }
    } else {
      const data = JSON.parse(dbres.result)
      ctx.body = { status: 200, data, msg: '' }
    }
  } else {
    ctx.body = { status: 417, data: {}, msg: '请求参数错误' }
  }
})

router.get('/getMetadata', async (ctx) => {
  if (ctx.query.filePath) {
    ctx.type = 'application/json'
    const dbres = await Metadata.findOne({ url: ctx.query.filePath })
    if (dbres === null) {
      try {
        const data = await getPDFMetadata(ctx.query.filePath)
        const m = new Metadata({
          url: ctx.query.filePath,
          file_hash: '',
          result: JSON.stringify(data),
        })
        m.save()
        ctx.body = { status: 200, data, msg: '' }
      } catch (error) {
        ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
      }
    } else {
      const data = JSON.parse(dbres.result)
      ctx.body = { status: 200, data, msg: '' }
    }
  } else {
    ctx.body = { status: 417, data: {}, msg: '请求参数错误' }
  }
})

router.get('/getPDFPageSize', async (ctx) => {
  if (ctx.query.filePath && ctx.query.viewport) {
    ctx.type = 'application/json'
    const reqUrl = `${ctx.query.filePath}&viewport=${ctx.query.viewport}`
    const dbres = await Pagesize.findOne({ url: reqUrl })
    if (dbres === null) {
      try {
        const data = await getPDFPageSize(
          ctx.query.filePath,
          ctx.query.viewport
        )
        const m = new Pagesize({
          url: reqUrl,
          file_hash: '',
          result: JSON.stringify(data),
        })
        m.save()
        ctx.body = { status: 200, data, msg: '' }
      } catch (error) {
        ctx.body = { status: 404, data: {}, msg: '获取文件失败' }
      }
    } else {
      const data = JSON.parse(dbres.result)
      ctx.body = { status: 200, data, msg: '' }
    }
  } else {
    ctx.body = { status: 417, data: {}, msg: '请求参数错误' }
  }
})

router.get('/download', async (ctx) => {
  if (ctx.query.filePath) {
    // generate the file name
    const reURI = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/
    const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i
    const splitURI = reURI.exec(ctx.query.filePath)
    const suggestedFilename =
      reFilename.exec(splitURI[1]) ||
      reFilename.exec(splitURI[2]) ||
      reFilename.exec(splitURI[3])
    const fileName = suggestedFilename[0]
    let filePath
    if (url.parse(ctx.query.filePath).protocol === null) {
      // get pdf file from local storage
      filePath = path.join(__dirname, '/static', ctx.query.filePath)
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
  } else {
    ctx.body = { status: 417, data: {}, msg: '请求参数错误' }
  }
})

app.use(serve(path.join(__dirname, '/static')))
app.use(router.routes())
app.use(
  router.allowedMethods({
    throw: true, // 抛出错误，代替设置响应头状态
    notImplemented: () => '不支持当前请求所需要的功能',
    methodNotAllowed: () => '不支持的请求方式',
  })
)

console.log(`You application is running here http://localhost:${port}`)
app.listen(port)
