import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { getLink } from 'utils/index'
import { Contents, Log } from 'types'

export interface Item<T> {
  (props: { index: number; data: T }): ReactNode
}

const CustomList = <T extends Contents>({
  list,
  label,
  Item
}: {
  list: T[]
  label: string
  Item: Item<T>
}) => {
  return (
    <List
      aria-labelledby={label}
      subheader={<ListSubheader component="p">{label}</ListSubheader>}
    >
      {list.map((data, index) => (
        <Item index={index} data={data} key={index} />
      ))}
    </List>
  )
}

export interface Content<T extends Contents> {
  (props: { data: T }): ReactNode
}

export const customListItem =
  <T extends Contents>({
    shouldNavigate = true,
    Content
  }: {
    shouldNavigate?: boolean
    Content: Content<T>
  }): Item<T> =>
  ({ data, index }) => {
    const navigate = useNavigate()
    const handleClick = () => {
      if (shouldNavigate) {
        navigate(getLink(data))
      }
    }

    return (
      <ListItem key={index}>
        <Card
          sx={{ width: '100%', '&:hover': { cursor: 'pointer' } }}
          onClick={handleClick}
        >
          <CardHeader title={data.name} />
          <CardContent>
            <Content data={data} />
          </CardContent>
        </Card>
      </ListItem>
    )
  }

const Content: Content<Log> = ({ data }) => (
  <Stack component="p" sx={{ whiteSpace: 'pre-wrap' }}>
    {data.content}
  </Stack>
)

export const LogItem: Item<Log> = customListItem({ Content })

export default CustomList
