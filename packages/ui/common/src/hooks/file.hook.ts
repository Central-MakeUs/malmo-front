import { getImageDimension } from '@data/utils/image'
import axios, { AxiosRequestConfig } from 'axios'

interface UploadUrlResponse {
  url: string
  path: string
  fields: Record<string, any>
}

export function useFileUpload(options: {
  maximumFileSize?: number
  method?: AxiosRequestConfig['method']
  pre: (file: {
    type: 'image' | 'file'
    fileName: string
    mimeType: string
    width?: number
    height?: number
  }) => Promise<UploadUrlResponse>
  post: (file: { type: 'image' | 'file'; path: string }) => Promise<string>
}) {
  const { maximumFileSize = 1024 * 1024 * 2, method = 'post', pre, post } = options

  const preUpload = async (fileType: 'image' | 'file', file: File): Promise<UploadUrlResponse> => {
    let width: number | undefined
    let height: number | undefined

    if (fileType === 'image') {
      const dimension = await getImageDimension(file)
      width = dimension.width
      height = dimension.height
    }

    if (file.size !== undefined) {
      if (file.size > maximumFileSize) {
        throw new Error(`invalid_file_size: ${file.size} / ${maximumFileSize}`)
      }
    } else {
      throw new Error('check_file_size_failed')
    }

    return await pre({
      type: fileType,
      fileName: file.name,
      mimeType: file.type,
      width,
      height,
    })
  }

  const upload = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
    try {
      const fileType = file.type.startsWith('image/') ? 'image' : 'file'
      const uploadInfo = await preUpload(fileType, file)

      const formData = new FormData()
      for (const key in uploadInfo.fields) {
        formData.append(key, uploadInfo.fields[key])
      }
      formData.append('Content-Type', file.type)
      formData.append('file', file)

      const axiosInstance = axios.create()
      await axiosInstance.request({
        url: uploadInfo.url,
        method: method,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent
          if (total) {
            const percentCompleted = Math.round((loaded * 100) / total)
            onProgress?.(percentCompleted)
          } else {
            onProgress?.(0)
          }
        },
      })
      return post({ type: fileType, path: uploadInfo.path })
    } catch (e: any) {
      throw new Error(e.message || 'upload_failed')
    }
  }

  return { upload }
}
