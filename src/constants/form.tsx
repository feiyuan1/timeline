import MenuItem from '@mui/material/MenuItem'
import { FormModalProps } from 'components/FormModal'
import { TextField, Select } from 'components/RegularInput'
import Alert from 'components/Alert'
import { addLine } from 'api/line'
import { addGroup } from 'api/lineGroup'
import { NodeType } from '_constants/index'
import { FormGroup, FormLine } from 'types'
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
  handleSubmit: (value: FormLine) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    addLine(value).then(() => {
      Alert.success('保存成功')
      location.reload()
    })
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
  handleSubmit: (value: FormGroup) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    addGroup(value).then(() => {
      Alert.success('添加成功')
      location.reload()
    })
  }
}
