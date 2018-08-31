const sendBtn = document.getElementById('send')
const cancelBtn = document.getElementById('cancel')

let token

sendBtn.addEventListener('click', () => {
  sendBtn.disabled = true
  cancelBtn.disabled = false

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
    .then(console.log)
    .catch(console.error)
    .finally(() => {
      sendBtn.disabled = false
      cancelBtn.disabled = true
    })
})

cancelBtn.addEventListener('click', () => {
  fetch('/abort/' + token)
})
