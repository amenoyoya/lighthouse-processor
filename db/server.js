const express = require('express')
const nedb = require('nedb')
const cors = require('cors')
const expressNedbRest = require('express-nedb-rest')

// setup express app
const app = express()

// accept CORS
app.use(cors())

// create rest api router and connect it to datastore  
const restApi = expressNedbRest()
restApi.addDatastore('lighthouse', new nedb({
  filename: './lighthouse.db',
  autoload: true
}))

// setup express server to serve rest service
app.use('/api/', restApi)

app.listen(8080, '0.0.0.0', function () {
  console.log('NeDB REST API Server: http://localhost:8080')
})
