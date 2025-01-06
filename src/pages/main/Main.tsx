import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PageContainer from 'components/PageContainer'
import { LogTab, MixTab } from './MainTab'
import { Line, LineGroup, Log } from 'types'
import useLoading from 'utils/useLoading'
import { getAllList } from 'api/mix'
import { getLog } from 'api/log'
import { TabKey, tabs } from './constants'

type MainData = [(Line | LineGroup)[], Log[]]

type TabContentProps = { data: MainData; current: TabKey }

export const TabContent = ({
  data: [list, logs],
  current
}: TabContentProps) => {
  if (current === TabKey.log) {
    return <LogTab data={logs} />
  }

  return <MixTab data={list} />
}

const Main = ({ data }: { data: MainData }) => {
  const [currentTab, setTab] = useState<TabKey>(TabKey.mix)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <Tabs value={currentTab} onChange={handleChange}>
        {tabs.map(({ label, key }) => (
          <Tab label={label} key={key} />
        ))}
      </Tabs>
      <TabContent data={data} current={currentTab} />
    </>
  )
}
const initData = () => Promise.all([getAllList(), getLog()])

const MainPage = () => {
  const { elem } = useLoading<MainData>(initData, {
    Component: Main
  })

  return <PageContainer>{elem}</PageContainer>
}

export default MainPage
