const express = require('express')
const app = express()
const port = 3000

app.get('/api/ping', (req, res) => {
  res.send('Ping!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})