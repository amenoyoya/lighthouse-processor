const express = require('express')
const nedb = require('nedb')
const cors = require('cors')
const expressNedbRest = require('express-nedb-rest')

// setup express app
const app = express()

// accept CORS
app.use(cors())

// create NeDB datastore
const datastore = new nedb({filename: './lighthouse.db',  autoload: true})

// create rest api router and connect it to datastore  
const restApi = expressNedbRest()
restApi.addDatastore('lighthouse', datastore)

// setup express server to serve rest service
app.use('/', restApi)

app.listen(8080, '0.0.0.0', function () {
  console.log('NeDB REST API Server: http://localhost:8080')
})
