import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import FormModal from 'components/FormModal'
import LineContent from 'components/LineGroupContent'
import Alert from 'components/Alert'
import { AddButton } from 'components/CustomButton'
import { LineGroup, FormLine } from 'types'
import { getLink } from 'utils/index'
import { getGroup, addChildLine } from 'api/lineGroup'
import { lineProps as formProps } from '_constants/form'
import useToggle from 'utils/useToggle'
import useRequiredParams from 'utils/useRequiredParams'

const LineGroup = () => {
  const [openLine, toggleLine] = useToggle()
  const [group, setGroup] = useState<LineGroup | null>(null)
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useRequiredParams<{ id: string }>()

  useEffect(() => {
    getGroup({ id })
      .then((data) => {
        setGroup(data[0])
      })
      .finally(() => setLoading(false))
  }, [id])

  const lineProps = useMemo(
    () => ({
      ...formProps,
      handleSubmit: (value: FormLine) => {
        // eslint-disable-next-line no-console
        console.log('submit: ', value)
        addChildLine(id, value).then(() => {
          Alert.success('保存成功')
          location.reload()
        })
      }
    }),
    [id]
  )

  if (isLoading) {
    return <div>loading..</div>
  }

  if (!group) {
    return <div>error</div>
  }

  const { name, lines } = group

  return (
    <Box>
      <AddButton onClick={() => toggleLine()} />
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
      <FormModal open={openLine} handleClose={toggleLine} {...lineProps} />
    </Box>
  )
}

export default LineGroup
