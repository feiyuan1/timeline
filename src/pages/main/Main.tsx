import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import PageContainer from 'components/PageContainer'
import AppendItem from './AppendItem'
import { Line, LineGroup } from 'types'
import { Type } from '_constants/index'
import { getLink } from 'utils/index'
import useLoading from 'utils/useLoading'
import { getAllList } from 'api/mix'

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

export const ListItem = ({ data }: { data: Line | LineGroup }) => {
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

const Main = ({ data: list }: { data: (Line | LineGroup)[] }) => {
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
      <AppendItem />
    </>
  )
}

const MainPage = () => {
  const { elem } = useLoading<(Line | LineGroup)[]>(getAllList, {
    Component: Main
  })

  return <PageContainer>{elem}</PageContainer>
}

export default MainPage
