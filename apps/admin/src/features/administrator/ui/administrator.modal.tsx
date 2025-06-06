import { Administrator } from '@/shared/services/administrator.service'
import { DataModal, DataModalCreateOrUpdate, DataModalShow } from '@ui/admin/components/data-modal'
import { Button } from '@ui/common/components/button'
import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
import * as React from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AdministratorForm } from './administrator.form'
import { AdministratorShow } from './administrator.show'

type ModalType = 'show' | 'create' | 'update'

export function AdministratorModal(props: {
  type?: ModalType
  open: boolean
  id?: number
  record?: Administrator
  onFinish?: (id: number) => void
  onChangeType?: (type: ModalType) => void
  onClose: () => void
}) {
  const { type = 'show', open, id, onClose, record, onFinish } = props

  const formId = useId()
  const alertDialog = useAlertDialog()
  const [modalType, setModalType] = useState(type)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.type) setModalType(type)
  }, [props.type])

  const title = useMemo(() => {
    const str = '관리자'
    if (modalType === 'create') return `${str} 추가`
    if (modalType === 'update') return `${str} 수정`
    return `${str} 정보`
  }, [modalType])

  function handleLoading(loading: boolean) {
    setLoading(loading)
  }

  function handleChangeType(type: ModalType) {
    setModalType(type)
    props.onChangeType?.(type)
  }

  function handleCancel() {
    if (modalType === 'create') return onClose()
    handleChangeType('show')
  }

  function handleFinish(id: number) {
    alertDialog.open({
      title: '알림',
      description: '저장되었습니다.',
      onConfirm: onClose,
    })
  }

  return (
    <DataModal
      type={modalType}
      title={title}
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      footer={
        <>
          <DataModalShow>
            <Button type="submit" variant="outline" loading={loading} onClick={() => handleChangeType('update')}>
              수정
            </Button>
            <Button variant="destructive" loading={loading}>
              삭제
            </Button>
          </DataModalShow>
          <DataModalCreateOrUpdate>
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" form={formId} loading={loading}>
              확인
            </Button>
          </DataModalCreateOrUpdate>
        </>
      }
    >
      <DataModalShow>
        <AdministratorShow record={record} />
      </DataModalShow>
      <DataModalCreateOrUpdate>
        <AdministratorForm formId={formId} record={record} onLoading={handleLoading} onFinish={handleFinish} />
      </DataModalCreateOrUpdate>
    </DataModal>
  )
}
