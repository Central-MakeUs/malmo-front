import fs from 'fs'
import { google } from 'googleapis'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json')
const spreadsheetId = '11xI7Bn1oqXVXIOpO5SJsibk6g-0BQBQK5P30Q5u1IWM'

function setNestedValue(obj, path, value) {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = current[key] || {}
    if (typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
  fs.mkdirSync(dir, { recursive: true })
}

async function fetchTranslations() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: SCOPES,
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    // messages 디렉토리 초기화
    const baseDir = path.join(process.cwd(), 'messages')
    cleanDirectory(baseDir)

    // 모든 언어에 대한 번역 객체 초기화
    const translations = {}

    for (const sheet of spreadsheet.data.sheets) {
      const sheetName = sheet.properties.title
      console.log(`Processing sheet: ${sheetName}`)

      const fullResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
      })

      const data = fullResponse.data.values
      if (!data || data.length < 2) {
        console.log(`Skipping sheet ${sheetName}: No data or insufficient rows`)
        continue
      }

      const headers = data[0]
      const keyIndex = headers.findIndex((header) => header === 'key')
      if (keyIndex === -1) {
        console.log(`Skipping sheet ${sheetName}: No 'key' column found`)
        continue
      }

      const languageCodes = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => header && header !== 'key')

      languageCodes.forEach(({ header }) => {
        if (!translations[header]) translations[header] = {}
      })

      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (row && row[keyIndex]) {
          const key = row[keyIndex].trim()

          languageCodes.forEach(({ header, index }) => {
            const value = row[index] || ''
            setNestedValue(translations[header], `${sheetName}.${key}`, value)
          })
        }
      }
    }

    // 언어별로 파일 작성
    Object.entries(translations).forEach(([lang, content]) => {
      fs.writeFileSync(path.join(baseDir, `${lang}.json`), JSON.stringify(content, null, 2))
      console.log(`Created translation file: ${lang}.json`)
    })

    console.log('\nAll translation files have been written successfully.')
  } catch (error) {
    console.error('Error fetching translations:', error.message)
    if (error.response) {
      console.error('Error details:', error.response.data)
    }
    throw error
  }
}

fetchTranslations()
