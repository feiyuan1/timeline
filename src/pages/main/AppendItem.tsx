import { memo, useCallback, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import FormModal, { FormModalProps } from 'components/FormModal'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { TextField, Select } from 'components/RegularInput'
import { NodeType } from '_constants'
import useToggle from 'utils/useToggle'

export const options = [
  { label: '时间', key: 'date', value: NodeType.date },
  { label: '自定义', key: 'custom', value: NodeType.custom }
]

export const lineProps: Omit<FormModalProps, 'open' | 'handleClose'> = {
  initValue: {
    nodeType: NodeType.date
  },
  validations: {
    name: {
      required: {
        value: true,
        message: '请填写名称'
      }
    }
  },
  title: '新增线路',
  children: (
    <>
      <TextField name="name" label="名称" />
      <TextField name="description" label="描述" />
      <Select name="nodeType" label="时间轴类型" variant="standard">
        {options.map(({ label, value, key }) => (
          <MenuItem value={value} key={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </>
  ),
  handleSubmit: (value: object) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    // reload page
  }
}

export const groupProps: Omit<FormModalProps, 'open' | 'handleClose'> = {
  validations: {
    name: {
      required: {
        value: true,
        message: '请填写名称'
      }
    }
  },
  title: '新增线路组',
  children: (
    <>
      <TextField name="name" label="名称" />
      <TextField name="description" label="描述" />
    </>
  ),
  handleSubmit: (value: object) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    // reload page
  }
}

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
      <IconButton
        sx={{ position: 'absolute', right: '20px', bottom: '60px' }}
        onClick={handleAdd}
      >
        <AddIcon color="primary" sx={{ fontSize: 40 }} />
      </IconButton>
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
