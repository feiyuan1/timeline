import { useNavigate } from 'react-router-dom'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AddButton, DeleteButton } from 'components/CustomButton'
import FormModal from 'components/FormModal'
import Alert from 'components/Alert'
import useRequiredParams from 'utils/useRequiredParams'
import useToggle from 'utils/useToggle'
import { nodeProps as getNodeProps } from '_constants/form'
import { deleteLine, getLine } from 'api/line'
import { Line } from 'types'
import { formatDate } from 'utils/date'
import { getLink } from 'utils/index'
import useLoading from '../../utils/useLoading'

const Line = ({ data: line }: { data: Line }) => {
  const [open, toggle] = useToggle()
  const navigate = useNavigate()
  const nodeProps = getNodeProps({ lineId: line.id, nodeType: line.nodeType })
  const { nodes, name, description } = line
  const del = () => {
    deleteLine(line.id).then(() => {
      Alert.success('删除成功')
      location.pathname = ''
    })
  }

  return (
    <Box>
      <Typography>{name}</Typography>
      {description && <Typography>{description}</Typography>}
      {nodes.length ? (
        nodes.map((node) => (
          <CardContent
            sx={{
              border: '1px solid #aaa',
              display: 'inline-block',
              marginRight: '10px'
            }}
            key={node.id}
            onClick={() => navigate(getLink(node))}
          >
            <Typography>{node.name}</Typography>
            {typeof node.key === 'string' ? node.key : formatDate(node.key)}
          </CardContent>
        ))
      ) : (
        <CardContent>时间线为空</CardContent>
      )}
      <DeleteButton onClick={del} />
      <AddButton onClick={toggle} />
      <FormModal open={open} handleClose={toggle} {...nodeProps} />
    </Box>
  )
}

const LinePage = () => {
  const { id } = useRequiredParams<{ id: string }>()
  const initData = () => getLine({ id }).then((data) => data[0])
  const elem = useLoading<Line>(initData, { Component: Line })

  return elem
}

export default LinePage
