import MenuItem from '@mui/material/MenuItem'
import { FormModalProps } from 'components/FormModal'
import { TextField, Select } from 'components/RegularInput'
import Alert from 'components/Alert'
import { addLine } from 'api/line'
import { addGroup } from 'api/lineGroup'
import { addNode } from 'api/node'
import { NodeType } from '_constants/index'
import { FormGroup, FormLine, FormLog, FormNode } from 'types'
import { addLog } from 'api/log'

export const options = [
  { label: '时间', key: 'date', value: NodeType.date },
  { label: '自定义', key: 'custom', value: NodeType.custom }
]

type FormPropsOmitToggle = Omit<FormModalProps, 'open' | 'handleClose'>

export const lineProps: FormPropsOmitToggle = {
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

export const groupProps: FormPropsOmitToggle = {
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

export const nodeProps: (props: {
  lineId: string
  nodeType: NodeType
  otherProps?: Partial<FormModalProps>
}) => FormPropsOmitToggle = ({ nodeType, lineId, otherProps }) => ({
  validations: {
    name: {
      required: {
        value: true,
        message: '请填写名称'
      }
    },
    key: {
      required: {
        value: true,
        message: '请填写 key'
      }
    }
  },
  title: '新增节点',
  children: (
    <>
      <TextField name="name" label="名称" />
      <TextField name="description" label="描述" />
      <TextField
        {...(nodeType === NodeType.date && { type: 'date' })}
        name="key"
        label="key"
      />
    </>
  ),
  handleSubmit: (value: FormNode) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    addNode(lineId, value).then(() => {
      Alert.success('添加成功')
      location.reload()
    })
  },
  ...otherProps
})

export const logProps: (props: {
  nodeId: string
  otherProps?: Partial<FormModalProps>
}) => FormPropsOmitToggle = ({ nodeId, otherProps }) => ({
  validations: {
    name: {
      required: {
        value: true,
        message: '请填写名称'
      }
    },
    content: {
      required: {
        value: true,
        message: '请填写内容'
      }
    }
  },
  title: '新增记录',
  children: (
    <>
      <TextField name="name" label="名称" />
      <TextField name="description" label="描述" />
      <TextField name="content" label="内容" multiline />
    </>
  ),
  handleSubmit: (value: FormLog) => {
    // eslint-disable-next-line no-console
    console.log('submit: ', value)
    addLog(nodeId, value).then(() => {
      Alert.success('添加成功')
      location.reload()
    })
  },
  ...otherProps
})
