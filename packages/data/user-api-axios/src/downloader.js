import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const configFile = path.join(import.meta.dirname, '..', 'config.json')
const tagMappingFile = path.join(import.meta.dirname, '..', 'tags.json')
const outputFile = path.join(import.meta.dirname, '..', 'swagger.json')

function isUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

function processSwaggerData(data, tagMapping) {
  const swaggerData = JSON.parse(data)
  swaggerData.servers = [{ url: '/api' }]
  swaggerData.info.description = ''

  for (const path in swaggerData.paths) {
    const pathItem = swaggerData.paths[path]
    for (const operation in pathItem) {
      if (pathItem[operation].tags) {
        pathItem[operation].tags = pathItem[operation].tags.map((tag) => tagMapping[tag] || tag)
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2), 'utf8')
}

async function main() {
  const configData = fs.readFileSync(configFile, 'utf8')
  const config = JSON.parse(configData)
  const inputSpec = config.inputSpec

  const tagData = fs.readFileSync(tagMappingFile, 'utf8')
  const tagMapping = JSON.parse(tagData)

  if (isUrl(inputSpec)) {
    const username = process.env.BASIC_AUTH_USER
    const password = process.env.BASIC_AUTH_PASS
    if (!username || !password) {
      throw new Error('Auth information is not properly formatted.')
    }

    const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    const response = await fetch(inputSpec, {
      headers: {
        Authorization: basicAuth,
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching Swagger JSON from URL: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    processSwaggerData(JSON.stringify(data), tagMapping)
  } else {
    const localData = fs.readFileSync(inputSpec, 'utf8')
    processSwaggerData(localData, tagMapping)
  }
}

main()
