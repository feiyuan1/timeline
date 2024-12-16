import { useNavigate, useParams } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent from 'components/LineGroupContent'
import { LineGroup } from 'types'
import { getLink } from 'utils/index'
import { useEffect, useState } from 'react'
import { getGroup } from 'api/lineGroup'

const LineGroup = () => {
  const [group, setGroup] = useState<LineGroup | null>(null)
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getGroup({ id })
      .then((data) => {
        setGroup(data[0])
      })
      .finally(() => setLoading(false))
  }, [id])

  if (isLoading) {
    return <div>loading..</div>
  }

  if (!group) {
    return <div>error</div>
  }

  const { name, lines } = group

  return (
    <List
      aria-labelledby={name}
      subheader={<ListSubheader component="p">{name}</ListSubheader>}
    >
      {lines.map((line, index) => {
        const handleClick = () => {
          navigate(getLink(line))
        }
        return (
          <ListItem key={index}>
            <Card
              sx={{ width: '100%', '&:hover': { cursor: 'pointer' } }}
              onClick={handleClick}
            >
              <CardHeader title={line.name} />
              <LineContent data={line} />
            </Card>
          </ListItem>
        )
      })}
    </List>
  )
}

export default LineGroup
