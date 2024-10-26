import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import { Line, LineGroup } from 'types'
import { list } from './mock'

const getCardContent = (data: Line | LineGroup) => {
  if (data.type === 1) {
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
  const cardContent = getCardContent(data)

  return <Card sx={{ marginBottom: '20px' }}>{cardContent}</Card>
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
