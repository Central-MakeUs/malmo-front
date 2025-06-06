#!/usr/bin/env node

import config from 'config'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import fs from 'node:fs'
import { get } from 'es-toolkit/compat'

function getAllKeys(obj, prefix = '') {
  let keys = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], newPrefix))
      } else {
        keys.push(newPrefix)
      }
    }
  }
  return keys
}

async function loadEnvironmentVariables() {
  const envs = []

  // Load client configuration
  const clientConfig = config.get('client')
  if (clientConfig) {
    const keys = getAllKeys(clientConfig, '')
    keys.map((key) => {
      const value = get(clientConfig, key)
      const name = key
        .replace(/([A-Z])/g, '_$1')
        .replace(/\./g, '_')
        .toUpperCase()
      envs.push(`NEXT_PUBLIC_${name}="${value}"`)
    })
  }

  // Load server configuration
  const serverConfig = config.get('server')
  if (serverConfig) {
    const keys = getAllKeys(serverConfig, '')
    keys.map((key) => {
      const value = get(serverConfig, key)
      const name = key
        .replace(/([A-Z])/g, '_$1')
        .replace(/\./g, '_')
        .toUpperCase()
      envs.push(`${name}="${value}"`)
    })
  }

  // Set up AWS SSM client
  const ssmClient = new SSMClient()
  const parameters = config.get('aws.parameters')

  const keys = getAllKeys(parameters, '')
  await Promise.all(
    keys.map(async (key) => {
      const parameterKey = get(parameters, key)
      try {
        const command = new GetParameterCommand({ Name: parameterKey, WithDecryption: true })
        const data = await ssmClient.send(command)
        const name = key
          .replace(/([A-Z])/g, '_$1')
          .replace(/\./g, '_')
          .toUpperCase()
        envs.push(`${name}="${data.Parameter.Value}"`)
      } catch (e) {
        console.debug(`Failed to retrieve parameter value for key: ${parameterKey}`)
      }
    })
  )
  envs.sort((a, b) => a.startsWith('NEXT_PUBLIC_') - b.startsWith('NEXT_PUBLIC_') || a.localeCompare(b))

  fs.writeFileSync('.env', envs.join('\n'))
}

// Call the function
loadEnvironmentVariables()
