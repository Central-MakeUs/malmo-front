// 애착유형 enum 정의
export enum AttachmentType {
  STABLE = 'STABLE_TYPE',
  ANXIETY = 'ANXIETY_TYPE',
  AVOIDANCE = 'AVOIDANCE_TYPE',
  CONFUSION = 'CONFUSION_TYPE',
}

// 애착유형 데이터 타입 정의
export interface AttachmentTypeData {
  type: AttachmentType
  character: string
  subtype: string
  characterImage: string
  color: string
  anxietyThreshold: string
  avoidanceThreshold: string
  description: string
  relationshipAttitudes: string[]
  conflictSolvingAttitudes: string[]
  emotionalExpressions: string[]
}
