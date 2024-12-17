import { memo, useCallback, useMemo, useState } from 'react'
import FormModal from 'components/FormModal'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import useToggle from 'utils/useToggle'
import { lineProps, groupProps } from '_constants/form'
import AddButton from 'components/AddButton'

const AppendItem = memo(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [openLine, toggleLine] = useToggle()
  const [openGroup, toggleGroup] = useToggle()
  const handleOpenLine = useCallback(() => {
    handleClose()
    toggleLine()
  }, [toggleLine])

  const handleOpenGroup = useCallback(() => {
    handleClose()
    toggleGroup()
  }, [toggleGroup])

  const menuList = useMemo(
    () => [
      {
        label: '线路',
        key: 'line-add',
        clickHandler: handleOpenLine
      },
      {
        label: '线路组',
        key: 'line-group-add',
        clickHandler: handleOpenGroup
      }
    ],
    [handleOpenLine, handleOpenGroup]
  )

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <AddButton onClick={handleAdd} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        {menuList.map((item) => (
          <MenuItem onClick={item.clickHandler} key={item.key}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
      <FormModal open={openLine} handleClose={toggleLine} {...lineProps} />
      <FormModal open={openGroup} handleClose={toggleGroup} {...groupProps} />
    </Box>
  )
})

export default AppendItem
