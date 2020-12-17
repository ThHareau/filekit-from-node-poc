require('dotenv')
  .config()

const fs = require('fs')
const { openTankerSession } = require('./lib/tanker')
const account = require('./lib/account')

const getFileContent = async () => {
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
  const file = await getFileContent()

  const accountRequest = await account.connect()

  const tanker = await openTankerSession(accountRequest)

  await tanker.upload(file, {
    shareWithGroups: [process.env.TANKER_DOCTOLIB_IMPORT_GROUP_ID],
    onProgress: ({ currentBytes, totalBytes }) => console.log(`Progress: ${currentBytes} / ${totalBytes}`)
  })
}

main()
  .catch(console.error)
