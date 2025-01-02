import { useNavigate } from 'react-router-dom'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import { LogItem } from 'components/List'
import AppendItem from './AppendItem'
import { AddButton } from 'components/CustomButton'
import { getLink } from 'utils/index'
import useToggleFormModal from 'utils/useFormModal'
import { Type } from '_constants/index'
import { logProps as getLogProps } from '_constants/form'
import { Line, LineGroup, Log } from 'types'

export { LogItem } from 'components/List'

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

const logProps = getLogProps()

export const LogTab = ({ data }: { data: Log[] }) => {
  const [toggle, FormModal] = useToggleFormModal()

  return (
    <>
      {data.map((log, index) => (
        <LogItem key={log.id} data={log} index={index} />
      ))}
      <AddButton onClick={toggle} />
      <FormModal {...logProps} />
    </>
  )
}

export const MixTab = ({ data }: { data: (Line | LineGroup)[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <MixItem data={item} key={index} />
      ))}
      <AppendItem />
    </>
  )
}
