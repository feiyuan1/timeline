import React from 'react'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'

interface AddButtonProps {
  onClick: React.MouseEventHandler
}

const AddButton = ({ onClick }: AddButtonProps) => (
  <IconButton
    sx={{ position: 'absolute', right: '20px', bottom: '60px' }}
    onClick={onClick}
  >
    <AddIcon color="primary" sx={{ fontSize: 40 }} />
  </IconButton>
)

export default AddButton
