import { MemberDataLoveTypeCategoryEnum, PartnerMemberDataLoveTypeCategoryEnum } from '@data/user-api-axios/api'

import { ATTACHMENT_TYPE_DATA } from '../models/attachment-data'

export const getAttachmentType = (
  loveTypeCategory: MemberDataLoveTypeCategoryEnum | PartnerMemberDataLoveTypeCategoryEnum | undefined
) => {
  if (!loveTypeCategory) return null
  return ATTACHMENT_TYPE_DATA[loveTypeCategory]
}
