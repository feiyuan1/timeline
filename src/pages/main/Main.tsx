import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import { Line, LineGroup } from 'types'
import { list } from './mock'
import { typeMap } from '_constants'

const getCardContent = (data: Line | LineGroup) => {
  if (data.type === typeMap.lineGroup) {
    return <LineGroupContent data={data} />
  }

  return (
    <>
      <CardHeader title={data.name} />
      <LineContent data={data} />
    </>
  )
}

const ListItem = ({ data }: { data: Line | LineGroup }) => {
  const navigate = useNavigate()
  const cardContent = getCardContent(data)
  const handleHref = () => {
    const { type, id } = data
    if (type === typeMap.lineGroup) {
      return
    }
    navigate('/line/' + id)
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

const Main = () => {
  const [currentTab, setTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <Tabs value={currentTab} onChange={handleChange}>
        <Tab label="all" />
      </Tabs>
      {list.map((item, index) => (
        <ListItem data={item} key={index} />
      ))}
    </>
  )
}

export default Main
