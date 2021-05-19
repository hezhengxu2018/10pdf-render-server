import request from '../utils/request'

export function getPDFPageImage(filePath,pageNum,viewport) {
  return request({
    url: '/finance/hotProductionLists',
    method: 'get',
    params: {
      filePath,
      pageNum,
      viewport
    }
  })
}
export function getPDFPageText(filePath,pageNum,viewport) {
  return request({
    url: '/renderText',
    method: 'get',
    params: {
      filePath,
      pageNum,
      viewport
    }
  })
}
export function getPDFMetadata(filePath,viewport) {
  return request({
    url: '/getMetadata',
    method: 'get',
    params: {
      filePath,
      viewport
    }
  })
}