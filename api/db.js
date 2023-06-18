const { connect } = require('mongoose')

const mongoUrl = process.env.MONGO_URL || 'mongodb://root:p%40ssw0rd2023@127.0.0.1:27017/node-rest-api?authSource=admin'

const Connect = async () => {
  try {
    console.log('Connecting to MongoDB...')
    console.log(mongoUrl)
    await connect(mongoUrl, {
      keepAliveInitialDelay: 300000,
      connectTimeoutMS: 300000,
      useNewUrlParser: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = { Connect }
