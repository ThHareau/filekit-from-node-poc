const { request, url } = require('./request')

const connect = async () => {
  const result = await request(url('login.json'), {
    'credentials': 'include',
    'body': {
      username: process.env.USER_NAME,
      kind: 'doctor',
      password: process.env.PASSWORD,
    },
    'method': 'POST',
  })

  const { 'x-csrf-token': [xCsrfToken], 'set-cookie': cookies } = result.headers.raw()

  return (url, option) => request(url, {
    ...option,
    headers: {
      ...option.headers,
      'x-csrf-token': xCsrfToken,
      'Cookie': cookies.join(';'),
    }
  })
}

module.exports = { connect }