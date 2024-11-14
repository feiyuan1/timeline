import { useNavigate } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import LineContent from 'components/LineGroupContent'
import { LineGroup } from 'types'
import { getLink } from 'utils/index'
import { list } from '../../../__tests__/__mocks__/lineList'

const LineGroup = () => {
  const data = list[0] as LineGroup
  const { name, lines } = data
  const navigate = useNavigate()

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
