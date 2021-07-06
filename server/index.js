const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const error = require('koa-json-error')
const router = require('./route/index')

const app = new Koa()
const port = 3000

// koa middleware
app.use(logger())
app.use(helmet())
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)
app.use(serve(path.join(__dirname, '/static')))
app.use(router.routes())
app.use(
  router.allowedMethods({
    throw: true,
  })
)
/* eslint-disable no-console */
console.log(`You application is running here http://localhost:${port}`)
app.listen(port)
