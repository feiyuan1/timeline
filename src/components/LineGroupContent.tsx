import { MouseEventHandler, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import { Line, LineGroup } from 'types'
import { formatDate } from 'utils/date'
import { DeleteButton } from './CustomButton'
import { deleteLine } from 'api/line'
import Alert from './Alert'
import DeleteGroupModal from './DeleteGroupModal'

const LineContent = ({
  data: { updateTime, nodes, id },
  showDel = true,
  handleClick
}: {
  data: Line
  showDel?: boolean
  handleClick?: MouseEventHandler<HTMLDivElement>
}) => {
  const cardPoprs = {
    ...(handleClick && { onClick: handleClick }),
    component: 'div'
  }

  const del = () => {
    deleteLine(id).then(() => {
      Alert.success('删除成功')
      location.reload()
    })
  }

  return (
    <CardContent {...cardPoprs} sx={{ position: 'relative' }}>
      {nodes.length ? (
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginBottom: '20px', alignItems: 'center' }}
            divider={<Divider sx={{ width: 30, borderColor: 'black' }} />}
          >
            {nodes.map((node) => (
              <Box
                sx={{
                  width: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '10px',
                  alignItems: 'center'
                }}
                key={node.id}
              >
                <Chip
                  label={formatDate(node.updateTime)}
                  variant="outlined"
                  sx={{ width: 100 }}
                />
                <Typography>{node.name}</Typography>
              </Box>
            ))}
          </Stack>
          <Typography sx={{ fontSize: 12 }} color="#aaa">
            创建时间:{formatDate(updateTime)}
          </Typography>
        </Box>
      ) : (
        '暂无节点'
      )}
      {showDel && <DeleteButton onClick={del} />}
    </CardContent>
  )
}

export const LineGroupContent = ({
  data: { name, lines },
  data
}: {
  data: LineGroup
}) => {
  const [curTab, setCurTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurTab(newValue)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <CardHeader title={'组/' + name} />
      {lines.length > 0 ? (
        <Box>
          <Tabs
            value={curTab}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            {lines.map((line, index) => (
              <Tab
                label={line.name}
                key={index}
                onClick={(event) => event.stopPropagation()}
              />
            ))}
          </Tabs>
          <LineContent data={lines[curTab]} showDel={false} />
        </Box>
      ) : (
        <CardContent>暂未添加时间线</CardContent>
      )}
      <DeleteGroupModal data={data} />
    </Box>
  )
}

export default LineContent
