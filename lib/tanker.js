const FileKit = require('../modules/FileKit')
const { api } = require('./request')

const tankerIdentity = async (accountRequest) => {
  const response = (await accountRequest(api('security', 'tanker_identities.json'), {
    method: 'POST',
    body: { disposable: true }
  }))

  return await response.json()
}

const tankerSession = async (accountRequest) => {

  const { tanker_identity: { value: identity } } = await tankerIdentity(accountRequest)

  console.debug({ identity })
  const tanker = new FileKit({ appId: process.env.TANKER_APP_ID, dataStore: { dbPath: process.env.TANKER_PATH } })

  await tanker.startDisposableSession({ identity })

  return tanker
}

module.exports = {
  tankerSession
}