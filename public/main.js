const sendBtn = document.getElementById('send')
const cancelBtn = document.getElementById('cancel')
const responseEl = document.getElementById('response')

let token

sendBtn.addEventListener('click', () => {
  sendBtn.disabled = true
  cancelBtn.disabled = false
  responseEl.textContent = 'pending...'

  fetch('/abort-token')
    .then(res => res.text())
    .then(currentToken => {
      token = currentToken

      const headers = new Headers({
        'abort-token': token
      })

      return window.fetch('expensive-request', { headers })
    })
    .then(res => res.text())
    .then(text => {
      responseEl.textContent = text
    })
    .catch(console.error)
    .finally(() => {
      sendBtn.disabled = false
      cancelBtn.disabled = true
    })
})

cancelBtn.addEventListener('click', () => {
  fetch('/abort/' + token, {
    method: 'POST'
  })
})
