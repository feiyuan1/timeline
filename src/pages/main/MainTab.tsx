import { useNavigate } from 'react-router-dom'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import { LogItem } from 'components/List'
import { getLink } from 'utils/index'
import { Type } from '_constants/index'
import { Line, LineGroup, Log } from 'types'

export const getCardContent = (data: Line | LineGroup) => {
  if (data.type === Type.lineGroup) {
    return <LineGroupContent data={data} />
  }

  return (
    <>
      <CardHeader title={data.name} />
      <LineContent data={data} />
    </>
  )
}

export const MixItem = ({ data }: { data: Line | LineGroup }) => {
  const navigate = useNavigate()
  const cardContent = getCardContent(data)
  const handleHref = () => {
    navigate(getLink(data))
  }

  return (
    <Card
      sx={{ marginBottom: '20px', '&:hover': { cursor: 'pointer' } }}
      onClick={handleHref}
    >
      {cardContent}
    </Card>
  )
}

export const LogTab = ({ data }: { data: Log[] }) =>
  data.map((log, index) => <LogItem key={log.id} data={log} index={index} />)

export const MixTab = ({ data }: { data: (Line | LineGroup)[] }) =>
  data.map((item, index) => <MixItem data={item} key={index} />)

export { LogItem } from 'components/List'
