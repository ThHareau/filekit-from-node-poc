const _fetch = require('node-fetch')
const https = require('https')

const agent = new https.Agent({ rejectUnauthorized: false })

const fetch = (url, options) => _fetch(url, { agent, ...options })

const url = (...resources) => [process.env.URL, ...resources].join('/')

const api = (...resources) => url('api', ...resources)

const request = (url, option) => {
  console.info(`${option.method  || 'GET'} ${url}`)
  return fetch(url, {
    mode: 'cors',
    ...option,
    body: option.body ? (typeof option.body === 'object' ? JSON.stringify(option.body) : option.body) : option.body,
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json; charset=utf-8',
      'doctor-desktop-js-version': 'desktop.js',
      ...option.headers,
    },
  })
}

module.exports = {
  request,
  url,
  api,
}