import { useState } from 'react'
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

const LineContent = ({ data: { updateTime, nodes } }: { data: Line }) => {
  return (
    <CardContent>
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
              label={node.updateTime}
              variant="outlined"
              sx={{ width: 100 }}
            />
            <Typography>{node.name}</Typography>
          </Box>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 12 }} color="#aaa">
        创建时间:{updateTime}
      </Typography>
    </CardContent>
  )
}

export const LineGroupContent = ({
  data: { name, lines }
}: {
  data: LineGroup
}) => {
  const [curTab, setCurTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurTab(newValue)
  }

  return (
    <Box>
      <CardHeader title={'组/' + name} />
      {lines.length > 0 && (
        <Box>
          <Tabs
            value={curTab}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            {lines.map((line, index) => (
              <Tab label={line.name} key={index} />
            ))}
          </Tabs>
          <LineContent data={lines[curTab]} />
        </Box>
      )}
    </Box>
  )
}

export default LineContent
