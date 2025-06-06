import { urlToFileWithHead } from '@data/utils/file'
import { isEqual } from 'es-toolkit'
import {
  AlertCircle,
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog'
import { Input } from './input'
import { Progress } from './progress'

interface FileObject {
  id?: number | string
  fileId: string
  file: File
  progress: number
  uploading: boolean
  uploaded?: boolean
  url?: string
  error?: string
  type: 'image' | 'file'
}

export interface LabelsType {
  placeholder?: string
  addMorePlaceholder?: string
  selected?: (count: number, max: number, type: string) => string
  dragDropText?: string
  typeDetail?: string
  sizeInfo?: (size: number, maxCount: number) => string
  dropZone?: string
  errorMaxFiles?: (maxFiles: number) => string
  errorMaxSize?: (fileName: string, maxSize: number) => string
  errorFileType?: (fileName: string) => string
}

export interface ClassNameType {
  container?: string
  dropZone?: string
  filePreview?: string
  fileItem?: string
  iconContainer?: string
  fileIcon?: string
  fileName?: string
  progressBar?: string
  progressText?: string
  addButton?: string
  removeButton?: string
  errorIcon?: string
  downloadButton?: string
  infoText?: string
}

interface InputFileProps {
  value?: string | string[] | Record<string, any> | Record<string, any>[] | FileObject[]
  onChange?: (files: any) => void
  onUpload: (file: File, onProgress: (progress: number) => void) => Promise<string>
  maxFiles?: number
  maxSize?: number // in MB
  multiple?: boolean
  preview?: boolean
  mode?: 'grid' | 'inline' | 'square'
  accept?: string // 허용할 파일 형식 (MIME 타입)
  type?: 'image' | 'file' | 'all' // 컴포넌트 타입 (이미지 전용, 파일 전용, 혼합)
  labels?: LabelsType // 커스텀 라벨
  classNames?: ClassNameType // 커스텀 className 추가
  errorHandler?: (error: Error) => void // Error 객체를 처리하는 함수
  idKey?: string // 파일 객체에서 사용할 ID 키 (기본값: 'id')
  urlKey?: string // 파일 객체에서 사용할 URL 키 (기본값: 'url')
  disabled?: boolean // 비활성화 상태 추가
}

const getFileIcon = (fileObj: FileObject) => {
  if (fileObj.type === 'image') return null

  const fileName = fileObj.file?.name || (fileObj.url ? fileObj.url.split('/').pop() || '' : '')
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return <FileText className="h-12 w-12 text-red-500" />
    case 'doc':
    case 'docx':
      return <FileText className="h-12 w-12 text-blue-500" />
    case 'xls':
    case 'xlsx':
      return <FileText className="h-12 w-12 text-green-500" />
    case 'ppt':
    case 'pptx':
      return <FileText className="h-12 w-12 text-orange-500" />
    case 'zip':
    case 'rar':
    case '7z':
      return <FileText className="h-12 w-12 text-purple-500" />
    default:
      return <FileIcon className="h-12 w-12 text-muted-foreground" />
  }
}

const FilePreview = ({
  fileObj,
  onRemove,
  showPreview = true,
  showProgress = true,
  classNames = {},
}: {
  fileObj: FileObject
  onRemove: (id: string) => void
  showPreview?: boolean
  showProgress?: boolean
  classNames?: ClassNameType
}) => {
  const fileName = fileObj.file?.name || (fileObj.url ? fileObj.url.split('/').pop() || '파일' : '파일')

  if (fileObj.type === 'file') {
    return (
      <div
        className={cn('relative flex h-full w-full flex-col items-center justify-center p-2', classNames.filePreview)}
      >
        <div className={cn('flex items-center justify-center', classNames.iconContainer)}>{getFileIcon(fileObj)}</div>
        <p className={cn('mt-2 line-clamp-2 w-full text-center text-xs', classNames.fileName)}>{fileName}</p>

        {fileObj.uploading && showProgress && (
          <div className={cn('absolute inset-x-0 bottom-0 bg-background/80 p-1', classNames.progressBar)}>
            <Progress value={fileObj.progress} className="h-1" />
            <div className={cn('text-center text-[10px]', classNames.progressText)}>{fileObj.progress}%</div>
          </div>
        )}

        <Button
          variant="destructive"
          size="icon"
          className={cn('absolute top-1 right-1 h-6 w-6', classNames.removeButton)}
          onClick={() => onRemove(fileObj.fileId)}
          disabled={fileObj.uploading}
        >
          <X size={12} />
        </Button>

        {fileObj.error && (
          <div
            className={cn(
              'absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20',
              classNames.errorIcon
            )}
            title={fileObj.error}
          >
            <AlertCircle className="h-4 w-4 text-destructive" aria-label={fileObj.error} />
          </div>
        )}

        {!fileObj.uploading && !fileObj.error && fileObj.url && (
          <a
            href={fileObj.url}
            download={fileName}
            className={cn('absolute top-1 left-1 rounded-md bg-muted p-1 hover:bg-muted/80', classNames.downloadButton)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={14} />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full', classNames.filePreview)}>
      <Dialog>
        {showPreview && !fileObj.error && fileObj.url && (
          <DialogTrigger asChild>
            <div className="h-full w-full cursor-pointer">
              <img src={fileObj.url} alt={fileName} className="h-full w-full object-cover" />
              {fileObj.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                  <Loader2 className="h-6 w-6 animate-spin text-background" />
                </div>
              )}
              {!fileObj.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-colors hover:bg-foreground/30 hover:opacity-100">
                  <ZoomIn className="h-8 w-8 text-background" />
                </div>
              )}
            </div>
          </DialogTrigger>
        )}

        {(!showPreview || fileObj.error) && fileObj.url && (
          <div className="h-full w-full">
            <img src={fileObj.url} alt={fileName} className="h-full w-full object-cover" />
            {fileObj.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                <Loader2 className="h-6 w-6 animate-spin text-background" />
              </div>
            )}
          </div>
        )}

        {fileObj.url && (
          <>
            <DialogTitle />
            <DialogDescription />
            <DialogContent className="max-w-3xl">
              <img src={fileObj.url} alt={fileName} className="max-h-[70vh] max-w-full object-contain" />
            </DialogContent>
          </>
        )}
      </Dialog>

      <Button
        variant="destructive"
        size="icon"
        className={cn('absolute top-1 right-1 h-6 w-6', classNames.removeButton)}
        onClick={() => onRemove(fileObj.fileId)}
        disabled={fileObj.uploading}
      >
        <X size={12} />
      </Button>

      {fileObj.error && (
        <div
          className={cn(
            'absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20',
            classNames.errorIcon
          )}
          title={fileObj.error}
        >
          <AlertCircle className="h-4 w-4 text-destructive" aria-label={fileObj.error} />
        </div>
      )}

      {fileObj.uploading && showProgress && (
        <div className={cn('absolute inset-x-0 bottom-0 py-1 text-background/80', classNames.progressBar)}>
          <Progress value={fileObj.progress} className="h-1" />
          <div className={cn('text-center text-[10px]', classNames.progressText)}>{fileObj.progress}%</div>
        </div>
      )}
    </div>
  )
}

const defaultLabels: LabelsType = {
  placeholder: '추가',
  addMorePlaceholder: '',
  selected: (count, max, type) => `${count}/${max}개의 ${type}이(가) 선택됨`,
  dragDropText: '업로드하려면 클릭하거나 파일을 끌어다 놓으세요',
  typeDetail: '',
  sizeInfo: (size, maxCount) => `파일 크기 제한: ${size}MB, 최대 ${maxCount}개`,
  dropZone: '파일을 여기에 끌어다 놓으세요',
  errorMaxFiles: (maxFiles) => `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`,
  errorMaxSize: (fileName, maxSize) => `${fileName}의 크기가 ${maxSize}MB를 초과합니다.`,
  errorFileType: (fileName) => `지원하지 않는 파일 형식입니다: ${fileName}`,
}

export function InputFile({
  value,
  onChange,
  onUpload,
  maxFiles = 1,
  maxSize = 2,
  multiple = false,
  preview = true,
  mode = 'square',
  accept = '*',
  type = 'all',
  labels = {},
  classNames = {},
  errorHandler,
  idKey,
  urlKey,
  disabled = false,
}: InputFileProps) {
  const [files, setFiles] = useState<FileObject[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const prevValueRef = useRef<any>(null)

  const mergedLabels = { ...defaultLabels, ...labels }

  useEffect(() => {
    if (value) {
      try {
        transformValue(files, { value, multiple, idKey, urlKey }).then(setFiles)
      } catch (error) {
        setFiles([])
      }
    } else {
      setFiles([])
    }
  }, [value, idKey, urlKey])

  useEffect(() => {
    if (onChange && files) {
      const output = transformOutput(files, { multiple, idKey, urlKey })
      if (isEqual(prevValueRef.current, output)) {
        return
      }
      prevValueRef.current = output
      onChange(output)
    }
  }, [files, onChange, multiple, idKey, urlKey])

  const getAcceptType = () => {
    if (accept !== '*') return accept

    switch (type) {
      case 'image':
        return 'image/*'
      case 'file':
        return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,text/plain'
      default:
        return '*'
    }
  }

  const handleError = (error: Error) => {
    if (errorHandler) {
      errorHandler(error)
    } else {
      alert(error.message)
    }
  }

  const uploadFile = async (fileObj: FileObject) => {
    if (!fileObj.file) return

    try {
      const updateFileProgress = (progress: number) => {
        setFiles((prev) => prev.map((f) => (f.fileId === fileObj.fileId ? { ...f, progress } : f)))
      }
      setFiles((prev) => prev.map((f) => (f.fileId === fileObj.fileId ? { ...f, uploading: true, progress: 0 } : f)))
      const url = await onUpload(fileObj.file, updateFileProgress)

      setFiles((prev) =>
        prev.map((f) =>
          f.fileId === fileObj.fileId
            ? {
                ...f,
                uploading: false,
                progress: 100,
                uploaded: true,
                url,
              }
            : f
        )
      )
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.fileId === fileObj.fileId
            ? {
                ...f,
                uploading: false,
                error: error instanceof Error ? error.message : '업로드 실패',
              }
            : f
        )
      )

      const e = new Error(error instanceof Error ? error.message : '업로드 실패')
      e.name = 'UploadFailedError'
      handleError(e)
    }
  }

  const processFiles = useCallback(
    (fileList: FileList) => {
      if (!fileList.length) return

      const actuallyMultiple = multiple && maxFiles > 1

      const actualFileCount = files ? files.filter((f) => f && f.file).length : 0

      if (actualFileCount + fileList.length > maxFiles) {
        const errorMessage = mergedLabels.errorMaxFiles
          ? mergedLabels.errorMaxFiles(maxFiles)
          : `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`

        const error = new Error(errorMessage)
        error.name = 'MaxFilesExceededError'
        handleError(error)
        return
      }

      if (!actuallyMultiple && actualFileCount > 0) {
        setFiles((prevFiles) => {
          prevFiles.forEach((file) => {
            if (file.file && file.url && !file.uploaded) {
              URL.revokeObjectURL(file.url)
            }
          })

          return prevFiles.filter((file) => !file.file)
        })
      }

      const newFiles: FileObject[] = []

      Array.from(fileList).forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          const errorMessage = mergedLabels.errorMaxSize
            ? mergedLabels.errorMaxSize(file.name, maxSize)
            : `${file.name}의 크기가 ${maxSize}MB를 초과합니다.`

          const error = new Error(errorMessage)
          error.name = 'FileSizeExceededError'
          handleError(error)
          return
        }

        const fileType = file.type.startsWith('image/') ? 'image' : 'file'

        if ((type === 'image' && fileType !== 'image') || (type === 'file' && fileType !== 'file')) {
          const errorMessage = mergedLabels.errorFileType
            ? mergedLabels.errorFileType(file.name)
            : `지원하지 않는 파일 형식입니다: ${file.name}`

          const error = new Error(errorMessage)
          error.name = 'UnsupportedFileTypeError'
          handleError(error)
          return
        }

        const newFile: FileObject = {
          fileId: `${file.name}-${Date.now()}`,
          file,
          progress: 0,
          uploading: true,
          type: fileType,
        }

        if (fileType === 'image') {
          newFile.url = URL.createObjectURL(file)
        }

        newFiles.push(newFile)
      })

      const updatedFiles = actuallyMultiple ? [...files, ...newFiles] : [...files.filter((f) => !f.file), ...newFiles]
      setFiles(updatedFiles)

      newFiles.forEach((file) => {
        uploadFile(file)
      })
    },
    [files, maxFiles, maxSize, onUpload, type, multiple, handleError]
  )

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files

      if (!fileList) return

      processFiles(fileList)

      e.target.value = ''
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-primary')
      dropZoneRef.current.classList.add('bg-primary/5')
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-primary')
      dropZoneRef.current.classList.remove('bg-primary/5')
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (dropZoneRef.current) {
        dropZoneRef.current.classList.remove('border-primary')
        dropZoneRef.current.classList.remove('bg-primary/5')
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const openFileSelector = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click()
    }
  }

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((file) => file.fileId !== fileId)

      const fileToRemove = prev.find((file) => file.fileId === fileId)
      if (fileToRemove && fileToRemove.url && fileToRemove.file && !fileToRemove.uploaded) {
        URL.revokeObjectURL(fileToRemove.url)
      }

      return filtered
    })
  }, [])

  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url && file.file && !file.uploaded) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [files])

  const getTypeText = () => {
    switch (type) {
      case 'image':
        return {
          icon: <ImageIcon className={cn('h-8 w-8 text-muted-foreground', classNames.fileIcon)} />,
          text: '이미지',
          detail: mergedLabels.typeDetail || '(PNG, JPG, GIF)',
        }
      case 'file':
        return {
          icon: <FileText className={cn('h-8 w-8 text-muted-foreground', classNames.fileIcon)} />,
          text: '파일',
          detail: mergedLabels.typeDetail || '(PDF, DOC, XLS, ZIP 등)',
        }
      default:
        return {
          icon: <Upload className={cn('h-8 w-8 text-muted-foreground', classNames.fileIcon)} />,
          text: '파일',
          detail: mergedLabels.typeDetail || '(이미지 및 일반 파일)',
        }
    }
  }

  const typeInfo = getTypeText()

  if (mode === 'square') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2 rounded-md', classNames.container)}>
        {files.map((file) => (
          <div
            key={file.fileId}
            className={cn('relative h-24 w-24 overflow-hidden rounded-md border border-border', classNames.fileItem)}
          >
            <FilePreview fileObj={file} onRemove={removeFile} classNames={classNames} showPreview={preview} />
          </div>
        ))}

        {files.length < maxFiles && !disabled && (
          <div
            className={cn(
              'flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25',
              classNames.addButton,
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={openFileSelector}
          >
            {files.length === 0 ? (
              <>
                {typeInfo.icon}
                <p className={cn('mt-1 text-xs text-muted-foreground', classNames.infoText)}>
                  {typeInfo.text} {mergedLabels.placeholder}
                </p>
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 text-muted-foreground" />
                {mergedLabels.addMorePlaceholder && (
                  <p className={cn('mt-1 text-xs text-muted-foreground', classNames.infoText)}>
                    {mergedLabels.addMorePlaceholder}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptType()}
          multiple={multiple && maxFiles > 1}
          className="hidden"
          onChange={handleFileUpload}
          disabled={disabled || files.length >= maxFiles}
        />
      </div>
    )
  }

  if (mode === 'inline') {
    return (
      <div className={cn('w-full', classNames.container)}>
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 p-4 transition-colors',
            classNames.dropZone,
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          ref={dropZoneRef}
        >
          {files.map((file) => {
            return (
              <div
                key={file.fileId}
                className={cn(
                  'relative h-24 w-24 overflow-hidden rounded-md border border-border',
                  classNames.fileItem
                )}
              >
                <FilePreview fileObj={file} onRemove={removeFile} classNames={classNames} showPreview={preview} />
              </div>
            )
          })}

          {files.length < maxFiles && !disabled && (
            <div
              className={cn(
                'flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25',
                classNames.addButton
              )}
              onClick={openFileSelector}
            >
              {files.length === 0 ? (
                <>
                  {typeInfo.icon}
                  <p className={cn('mt-1 text-xs text-muted-foreground', classNames.infoText)}>
                    {typeInfo.text} {mergedLabels.placeholder}
                  </p>
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  {mergedLabels.addMorePlaceholder && (
                    <p className={cn('mt-1 text-xs text-muted-foreground', classNames.infoText)}>
                      {mergedLabels.addMorePlaceholder}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptType()}
          multiple={multiple && maxFiles > 1}
          className="hidden"
          onChange={handleFileUpload}
          disabled={disabled || files.length >= maxFiles}
        />

        <p className={cn('mt-2 text-xs text-muted-foreground', classNames.infoText)}>
          {files.length > 0
            ? mergedLabels.selected
              ? mergedLabels.selected(files.length, maxFiles, typeInfo.text)
              : `${files.length}/${maxFiles}개의 ${typeInfo.text}이(가) 선택됨`
            : `${typeInfo.text}을(를) ${mergedLabels.placeholder}하세요 ${typeInfo.detail} ${mergedLabels.sizeInfo ? mergedLabels.sizeInfo(maxSize, maxFiles) : `파일 크기 제한: ${maxSize}MB, 최대 ${maxFiles}개`}`}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', classNames.container)}>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={openFileSelector}
          className={cn('gap-2', classNames.addButton)}
          disabled={disabled || files.length >= maxFiles}
        >
          <Upload size={16} />
          {typeInfo.text} {mergedLabels.placeholder}
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptType()}
          multiple={multiple && maxFiles > 1}
          className="hidden"
          onChange={handleFileUpload}
          disabled={disabled || files.length >= maxFiles}
        />

        <div className={cn('text-sm text-muted-foreground', classNames.infoText)}>
          {files.length > 0
            ? mergedLabels.selected
              ? mergedLabels.selected(files.length, maxFiles, typeInfo.text)
              : `${files.length}/${maxFiles}개의 ${typeInfo.text}이(가) 선택됨`
            : `선택된 ${typeInfo.text} 없음`}
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {files.map((file) => (
            <Card key={file.fileId} className={cn('overflow-hidden py-3', classNames.fileItem)}>
              <CardContent className="p-2">
                <div className="relative aspect-square w-30 overflow-hidden rounded-md">
                  <FilePreview
                    fileObj={file}
                    onRemove={removeFile}
                    showProgress={false}
                    showPreview={preview}
                    classNames={classNames}
                  />
                </div>
                {file.uploading && (
                  <div className="mt-2">
                    <Progress value={file.progress} className={cn('h-2', classNames.progressBar)} />
                    <div className={cn('mt-1 text-right text-xs', classNames.progressText)}>{file.progress}%</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div
          className={cn(
            'cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center',
            classNames.dropZone,
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={!disabled ? openFileSelector : undefined}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          ref={dropZoneRef}
        >
          {typeInfo.icon}
          <p className={cn('mt-2 text-sm text-muted-foreground', classNames.infoText)}>
            {typeInfo.text}을(를) {mergedLabels.dragDropText}
          </p>
          <p className={cn('mt-1 text-xs text-muted-foreground/70', classNames.infoText)}>{typeInfo.detail}</p>
          <p className={cn('mt-1 text-xs text-muted-foreground/70', classNames.infoText)}>
            {mergedLabels.sizeInfo
              ? mergedLabels.sizeInfo(maxSize, maxFiles)
              : `파일 크기 제한: ${maxSize}MB, 최대 ${maxFiles}개`}
          </p>
        </div>
      )}
    </div>
  )
}

function getFileType(url: string) {
  return url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? 'image' : 'file'
}

async function transformValue(
  fileObjects: FileObject[],
  options: {
    value: any
    multiple?: boolean
    idKey?: string
    urlKey?: string
  }
): Promise<FileObject[]> {
  const { value, multiple, idKey, urlKey } = options

  if (!value) return []

  if (multiple) {
    if (idKey || urlKey) {
      const { idKey = 'id', urlKey = 'url' } = options
      return Promise.all(
        value.map(async (item: Record<string | number, any>) => {
          const itemUrl = item[urlKey]
          const file = fileObjects.find((f) => f.url === itemUrl)
          if (file) return file

          const fileId = `obj-${Date.now()}`
          return {
            id: item[idKey],
            fileId,
            type: getFileType(itemUrl),
            file: await urlToFileWithHead(itemUrl),
            url: itemUrl,
            progress: 100,
            uploading: false,
            uploaded: true,
          }
        })
      )
    }
    return Promise.all(
      value.map(async (url: string, index: number) => {
        const file = fileObjects.find((f) => f.url === url)
        if (file) return file
        const fileId = `url-${index}-${Date.now()}`
        return {
          fileId,
          type: getFileType(url),
          file: await urlToFileWithHead(url),
          url,
          progress: 100,
          uploading: false,
          uploaded: true,
        }
      })
    )
  }
  if (idKey || urlKey) {
    const { idKey = 'id', urlKey = 'url' } = options
    const itemUrl = value[urlKey]
    const file = fileObjects.find((f) => f.url === itemUrl)
    if (file) return [file]

    const fileId = `obj-${Date.now()}`
    return [
      {
        id: value[idKey],
        fileId,
        type: getFileType(itemUrl),
        file: await urlToFileWithHead(itemUrl),
        url: itemUrl,
        progress: 100,
        uploading: false,
        uploaded: true,
      },
    ]
  }
  const file = fileObjects.find((f) => f.url === value)
  if (file) return [file]
  const fileId = `url-${Date.now()}`
  return [
    {
      fileId,
      type: getFileType(value),
      file: await urlToFileWithHead(value),
      url: value,
      progress: 100,
      uploading: false,
      uploaded: true,
    },
  ]
}

function transformOutput(
  fileObjects: FileObject[],
  options: {
    multiple?: boolean
    idKey?: string
    urlKey?: string
  }
): any {
  const { multiple, idKey, urlKey } = options
  const items = fileObjects.filter((f) => f.uploaded)
  if (!items || items.length === 0) {
    return multiple ? [] : ''
  }
  if (multiple) {
    if (idKey || urlKey) {
      const { idKey = 'id', urlKey = 'url' } = options
      return items.map((f) => ({ [idKey]: f[idKey], [urlKey]: f.url }))
    }
    return items.map((file) => file.url)
  }
  if (idKey || urlKey) {
    const { idKey = 'id', urlKey = 'url' } = options
    return { [idKey]: items[0]![idKey], [urlKey]: items[0]!.url }
  }
  return items[0]!.url
}
