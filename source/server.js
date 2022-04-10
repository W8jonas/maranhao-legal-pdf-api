const express = require('express')
const cors = require('cors')
require('express-async-errors')

const {routes} = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 3000)
