const Router = require('koa-router')
const renderPage = require('../controller/renderPage')
const renderText = require('../controller/renderText')
const getMetadata = require('../controller/getMetadata')
const getPagesize = require('../controller/getPagesize')
const downloadFile = require('../controller/downloadFile')
const {
  genReqPDFUrl,
  validateFilePath,
  validateViewport,
  validatePageNum,
} = require('../middleware')

const router = new Router({ prefix: '/api' })

router.get('/getMetadata', validateFilePath, genReqPDFUrl, getMetadata)
router.get(
  '/getPageSize',
  validateFilePath,
  validateViewport,
  genReqPDFUrl,
  getPagesize
)
router.get(
  '/renderPage',
  validateFilePath,
  validateViewport,
  validatePageNum,
  genReqPDFUrl,
  renderPage
)
router.get(
  '/renderText',
  validateFilePath,
  validateViewport,
  validatePageNum,
  genReqPDFUrl,
  renderText
)
router.get('/download', validateFilePath, downloadFile)

module.exports = router
