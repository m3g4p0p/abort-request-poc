const express = require('express')
const uuidv1 = require('uuid/v1')
const EventEmitter = require('events')

const app = express()
const abortEmitter = new EventEmitter()

// A very expensive operation that takes several million years to complete
const getMeaningOfLife = token => new Promise((resolve, reject) => {
  const handleAbort = currentToken => {
    if (token === currentToken) {
      global.clearTimeout(handle)
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

// Get a unique abort token
app.get('/abort-token', (req, res) => {
  res.end(uuidv1())
})

// Emit an abort event for a given token
app.post('/abort/:token', (req, res) => {
  const token = req.params.token

  if (!token) {
    res.sendStatus(400)
    return res.end()
  }

  abortEmitter.emit('abort', token)
})

// Get the meaning of life
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
