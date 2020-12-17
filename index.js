require('dotenv')
  .config()

const fs = require('fs')
const { tankerSession } = require('./lib/tanker')
const account = require('./lib/account')

const getFile = async () => {
  const [, , filePath] = process.argv

  await new Promise((res, rej) => {
    if (!filePath) return rej('File was not provided')

    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) return res('File is not readable')
      res(true)
    })
  })

  return fs.readFileSync(filePath)
}

const main = async () => {
  const file = await getFile()

  const accountRequest = await account.connect()

  const tanker = await tankerSession(accountRequest)

  await tanker.upload(file, {
    shareWithGroups: [process.env.TANKER_DOCTOLIB_IMPORT_GROUP_ID],
    onProgress: ({ currentBytes, totalBytes }) => console.log(`Progress: ${currentBytes} / ${totalBytes}`)
  })
}

main()
  .catch(console.error)
