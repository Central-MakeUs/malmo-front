import { ATTACHMENT_TYPE_DATA } from '../models/attachment-data'
import { MemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

export const getAttachmentType = (loveTypeCategory: MemberDataLoveTypeCategoryEnum | undefined) => {
  if (!loveTypeCategory) return null
  return ATTACHMENT_TYPE_DATA[loveTypeCategory]
}
