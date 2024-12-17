import React, { MouseEventHandler, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Alert from './Alert'

interface IconButtonProps {
  onClick: React.MouseEventHandler
}

export const AddButton = ({ onClick }: IconButtonProps) => (
  <IconButton
    sx={{ position: 'absolute', right: '20px', bottom: '60px' }}
    onClick={onClick}
  >
    <AddIcon color="primary" sx={{ fontSize: 40 }} />
  </IconButton>
)

export const DeleteButton = ({ onClick }: IconButtonProps) => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleClick: MouseEventHandler = (e) => {
    if (formRef.current && formRef.current.checkValidity()) {
      onClick(e)
      return
    }
    Alert.info('please check the checkBox around the delete button')
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        display: 'flex'
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Box component="form" ref={formRef}>
        <Checkbox required />
      </Box>
      <IconButton onClick={handleClick}>
        <DeleteOutlineOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
      </IconButton>
    </Box>
  )
}
