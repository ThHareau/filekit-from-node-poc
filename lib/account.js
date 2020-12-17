const { request, url } = require('./request')

/**
 * Connects the user defines in the .env.
 * This will retrieve a cookie, and reuse this cookie in request that is given as a callback
 * @returns {Promise<function(url: String, option: Object): Promise<Object>>}
 */
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