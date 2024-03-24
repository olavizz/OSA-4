require('dotenv').config({ path: __dirname + '/.env'})

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
console.log(process.env)

module.exports = {
  MONGODB_URI,
  PORT
}