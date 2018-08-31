const express = require('express')
const uuidv1 = require('uuid/v1')
const EventEmitter = require('events')

const app = express()
const abortEmitter = new EventEmitter()

// A very expensive operation that takes several million years to complete
const getMeaningOfLife = token => new Promise((resolve, reject) => {
  const handleAbort = currentToken => {
    if (token === currentToken) {
      // Tidy everything up and reject
      global.clearTimeout(handle)
      abortEmitter.off('abort', handleAbort)
      reject(new Error('aborted'))
    }
  }

  abortEmitter.on('abort', handleAbort)

  const handle = global.setTimeout(() => {
    abortEmitter.off('abort', handleAbort)
    resolve('42')
  }, 7500)
})

app.use(express.static('public'))

// Get a unique abort token; in a real app,
// tie the token to the client IP in a lookup
// table or something
app.get('/abort-token', (req, res) => {
  res.end(uuidv1())
})

// Emit an abort event for a given token
app.post('/abort/:token', (req, res) => {
  abortEmitter.emit('abort', req.params.token)
})

// Expensively get the meaning of life
app.get('/expensive-request', (req, res) => {
  const token = req.get('abort-token')

  if (!token) {
    res.sendStatus(400)
    return res.end()
  }

  getMeaningOfLife(token)
    .then(mol => res.end(mol))
    .catch(() => res.end('aborted'))
})

app.listen(3000)
