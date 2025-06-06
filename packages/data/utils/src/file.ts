import mime from 'mime/lite'

/**
 * URL에서 파일명 추출
 */
export const extractFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()

    // 쿼리 파라미터 제거
    if (filename && filename.includes('?')) {
      return decodeURIComponent(filename.split('?')[0] || '') || 'file'
    }

    return decodeURIComponent(filename || 'file')
  } catch (e) {
    const parts = url.split('/')
    let filename = parts[parts.length - 1] || 'file'

    // 쿼리 파라미터 제거
    if (filename.includes('?')) {
      filename = filename.split('?')[0] || ''
    }

    try {
      return decodeURIComponent(filename)
    } catch {
      return filename
    }
  }
}

/**
 * Content-Disposition 헤더에서 파일명 추출
 */
const extractFilenameFromContentDisposition = (header: string | null): string | null => {
  if (!header) return null

  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(header)

  if (matches && matches[1]) {
    let filename = matches[1].replace(/['"]/g, '')

    // UTF-8 인코딩 처리
    if (filename.startsWith("UTF-8''")) {
      filename = filename.substring(7)
    }

    try {
      return decodeURIComponent(filename)
    } catch {
      return filename
    }
  }

  return null
}

/**
 * 파일 확장자로 MIME 타입 추정 (mime-types 라이브러리 사용)
 */
export const getMimeTypeFromFilename = (filename: string): string => {
  return mime.getExtension(filename) || 'application/octet-stream'
}

/**
 * URL을 File 객체로 변환 (동기 버전)
 * CORS 없이 즉시 사용 가능
 *
 * @param url 파일 URL
 * @param customFilename 원하는 파일명 (지정하지 않으면 URL에서 자동 추출)
 * @returns File 객체
 */
export const urlToFile = (url: string, customFilename?: string): File => {
  try {
    const filename = customFilename || extractFilenameFromUrl(url)
    const mimeType = getMimeTypeFromFilename(filename)
    return new File([], filename, { type: mimeType })
  } catch (e) {
    throw e
  }
}

/**
 * URL을 File 객체로 변환 (HEAD 요청 사용)
 * HEAD 요청으로 메타데이터를 가져오며, 실패 시 동기 방식으로 폴백
 *
 * @param url 파일 URL
 * @param customFilename 원하는 파일명 (지정하지 않으면 자동 결정)
 * @returns Promise<File> - 생성된 File 객체
 */
export const urlToFileWithHead = async (url: string, customFilename?: string): Promise<File> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      return urlToFile(url, customFilename)
    }

    const contentType = response.headers.get('content-type') || ''
    const contentDisposition = response.headers.get('content-disposition')

    const filenameFromHeader = extractFilenameFromContentDisposition(contentDisposition)
    const filenameFromUrl = extractFilenameFromUrl(url)
    const filename = customFilename || filenameFromHeader || filenameFromUrl

    let mimeType = contentType
    if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = getMimeTypeFromFilename(filename)
    }

    return new File([], filename, { type: mimeType })
  } catch (error) {
    return urlToFile(url, customFilename)
  }
}

/**
 * 파일 크기를 가독성 있는 형식으로 변환
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * URL을 ExtendedFile 객체로 변환
 * 파일 크기 등 추가 정보 포함
 *
 * @param url 파일 URL
 * @param customFilename 원하는 파일명 (지정하지 않으면 자동 결정)
 * @returns Promise<ExtendedFile>
 */
export const urlToExtendedFile = async (url: string, customFilename?: string): Promise<File> => {
  try {
    // HEAD 요청으로 메타데이터 가져오기
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      return urlToFile(url, customFilename)
    }

    const contentType = response.headers.get('content-type') || ''
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition')

    const filenameFromHeader = extractFilenameFromContentDisposition(contentDisposition)
    const filenameFromUrl = extractFilenameFromUrl(url)
    const filename = customFilename || filenameFromHeader || filenameFromUrl

    let mimeType = contentType
    if (!mimeType || mimeType === 'application/octet-stream') {
      mimeType = getMimeTypeFromFilename(filename)
    }

    const file = new File([], filename, { type: mimeType })

    if (contentLength) {
      const size = parseInt(contentLength, 10)
      Object.defineProperty(file, 'size', {
        value: size,
        writable: false,
      })
    }

    return file
  } catch (error) {
    return urlToFile(url, customFilename)
  }
}
