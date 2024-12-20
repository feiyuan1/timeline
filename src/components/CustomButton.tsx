import { MouseEventHandler, ChangeEvent, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Alert from './Alert'

interface IconButtonProps {
  onClick: MouseEventHandler
}

export const AddButton = ({ onClick }: IconButtonProps) => (
  <IconButton
    sx={{ position: 'absolute', right: '20px', bottom: '60px' }}
    onClick={onClick}
  >
    <AddIcon color="primary" sx={{ fontSize: 40 }} />
  </IconButton>
)

export const LinkButton = ({ onClick }: IconButtonProps) => (
  <IconButton
    sx={{ position: 'absolute', right: '20px', bottom: '100px' }}
    onClick={onClick}
  >
    <AddLinkOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
  </IconButton>
)

interface DeleteButtonProps extends IconButtonProps {
  customConfirm?: boolean
}
export const DeleteButton = ({ onClick, customConfirm }: DeleteButtonProps) => {
  const [confirm, setConfirm] = useState(false)

  const handleClick: MouseEventHandler = (e) => {
    if (customConfirm) {
      onClick(e)
      return
    }
    if (confirm) {
      onClick(e)
      return
    }
    Alert.info('please check the checkBox around the delete button')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, value: boolean) =>
    setConfirm(value)

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
      {!customConfirm && <Checkbox required onChange={handleChange} />}
      <IconButton onClick={handleClick}>
        <DeleteOutlineOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
      </IconButton>
    </Box>
  )
}
