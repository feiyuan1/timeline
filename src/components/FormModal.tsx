import React, { useEffect, memo } from 'react'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import { FormProvider, useFormContext } from './FormContext'
import { ObjectWithString } from 'types'

export type FormModalProps = React.PropsWithChildren<{
  open: boolean
  title: string
  isDoubleCol?: boolean
  keepMounted?: boolean
  initValue?: ObjectWithString
  actions?: React.ReactNode
  validations?: ObjectWithString
  handleSubmit: (value: object) => void
  handleClose: (event: MouseEvent, reason: string) => void
}>

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

/**
 * 配合 RegularInput 使用
 */
const FormModalInner = ({
  open,
  title,
  isDoubleCol = true,
  keepMounted = true,
  children,
  actions,
  initValue = {},
  validations,
  handleClose,
  handleSubmit
}: FormModalProps) => {
  const { ref, update, validateRef } = useFormContext()

  useEffect(() => {
    if (!validations) {
      return
    }
    validateRef.current = validations
  }, [validateRef, validations])

  useEffect(() => {
    update(initValue)
  }, [initValue, update])

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    try {
      handleSubmit(ref.current)
    } catch (e) {
      // 捕获非 promise 异常，否则会刷新页面
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="form-modal-title"
      keepMounted={keepMounted}
    >
      <Box component="form" sx={style} onSubmit={handleFormSubmit}>
        <Typography id="form-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Stack
          divider={
            isDoubleCol ? (
              <Divider orientation="vertical" sx={{ height: '50px' }} />
            ) : null
          }
          spacing={2}
          direction={isDoubleCol ? 'row' : 'column'}
          sx={{ alignItems: 'center' }}
        >
          <Stack direction="column" sx={{ flex: 2 }} spacing={2}>
            {children}
          </Stack>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {actions || (
              <IconButton type="submit" sx={{ height: 56 }}>
                <CheckIcon color="primary" sx={{ fontSize: 40 }} />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const FormModal = (props: FormModalProps) => (
  <FormProvider>
    <FormModalInner {...props} />
  </FormProvider>
)

export default memo(FormModal)
