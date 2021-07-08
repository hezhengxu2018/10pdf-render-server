const mongoose = require('mongoose')
const config = require('../../config.json')

mongoose.Promise = global.Promise
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

let options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

if (config.user) {
  options.user = config.user
  options.pass = config.pass
}

options = { ...options, ...config.options }

let connectString = ''

if (config.connectString) {
  connectString = config.connectString
} else {
  connectString = `mongodb://${config.servername}:${config.port}/${config.DATABASE}`
  if (config.authSource) {
    connectString += `?authSource=${config.authSource}`
  }
}

mongoose.connect(connectString, options)

module.exports = mongoose
