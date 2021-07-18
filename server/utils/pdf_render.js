const pdfjsLib = require('pdfjs-dist/es5/build/pdf')
const range = require('lodash.range')
const { createCanvas } = require('canvas')
const { getPageSizeInches, parsePageSize } = require('./index')

async function renderPDFImage(pdfPath, vp = 1, pageNum = 1) {
  const loadingTask = pdfjsLib.getDocument(pdfPath)
  return new Promise((resolve, reject) => {
    loadingTask.promise.then((doc) => {
      const { numPages } = doc
      if (pageNum > numPages || pageNum < 1) {
        reject(new Error('输入页面错误'))
      }
      doc
        .getPage(pageNum)
        .then((page) => {
          const viewport = page.getViewport({ scale: vp })
          const canvas = createCanvas(viewport.width, viewport.height)
          const ctx = canvas.getContext('2d')
          const renderContext = {
            canvasContext: ctx,
            viewport,
          }
          try {
            page.render(renderContext).promise.then(() => {
              resolve(canvas.toBuffer())
            })
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
}

async function renderPDFTextContent(pdfPath, pageNum = 1, vp = 1.5) {
  const loadingTask = pdfjsLib.getDocument(pdfPath)
  return new Promise((resolve, reject) => {
    loadingTask.promise
      .then((doc) => {
        const { numPages } = doc
        if (Number.isNaN(pageNum)) {
          reject(new Error('输入页面错误'))
        }
        if (pageNum > numPages || pageNum < 1) {
          reject(new Error('输入页面错误'))
        }
        doc.getPage(pageNum).then(async (page) => {
          const viewport = page.getViewport({ scale: vp })
          Promise.all([
            parsePageSize(getPageSizeInches(page), 0),
            page.getTextContent(),
          ])
            .then((res) => {
              const pageSize = res[0]
              const textContent = res[1]
              resolve({ textContent, viewport, pageSize })
            })
            .catch((err) => {
              reject(new Error(err))
            })
        })
      })
      .catch((err) => {
        reject(new Error(err))
      })
  })
}

async function getPDFMetadata(pdfPath) {
  const loadingTask = pdfjsLib.getDocument(pdfPath)
  return new Promise((resolve, reject) => {
    loadingTask.promise.then((doc) => {
      const { numPages } = doc
      let metaData = ''
      let info = ''
      doc
        .getMetadata()
        .then((data) => {
          info = data.info
          if (data.metadata) {
            metaData = data.metadata.getAll()
          }
          const returnData = {
            numPages,
            metaData,
            info,
            contentLength: data.contentLength,
            contentDispositionFilename: data.contentDispositionFilename,
          }
          resolve(returnData)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  })
}

async function getPDFPageSize(filePath, vp, startPage, endPage) {
  const loadingTask = pdfjsLib.getDocument(filePath)
  return loadingTask.promise.then((doc) => {
    const { numPages } = doc
    let first
    let last
    if (startPage === undefined || endPage === undefined) {
      first = 1
      last = numPages
    } else {
      first = startPage
      last = endPage
    }
    const allPages = range(first, last + 1).map((number) => {
      return new Promise((resolve, reject) => {
        doc
          .getPage(number)
          .then((page) => {
            const viewport = page.getViewport({ scale: vp })
            resolve(viewport)
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
    return Promise.all(allPages)
  })
}

module.exports.renderPDFImage = renderPDFImage
module.exports.renderPDFTextContent = renderPDFTextContent
module.exports.getPDFMetadata = getPDFMetadata
module.exports.getPDFPageSize = getPDFPageSize
