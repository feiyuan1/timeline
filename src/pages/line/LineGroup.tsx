import { useMemo } from 'react'
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
import { getLink } from 'utils/index'
import useToggle from 'utils/useToggle'
import useRequiredParams from 'utils/useRequiredParams'
import useLoading from 'utils/useLoading'
import { LineGroup, FormLine } from 'types'
import { getGroup, addChildLine } from 'api/lineGroup'
import { lineProps as formProps } from '_constants/form'

const LineGroup = ({ data: { name, lines } }: { data: LineGroup }) => {
  const [openLine, toggleLine] = useToggle()
  const navigate = useNavigate()
  const { id } = useRequiredParams<{ id: string }>()
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

const LineGroupPage = () => {
  const { id } = useRequiredParams<{ id: string }>()
  const initData = () => getGroup({ id }).then((data) => data[0])
  const elem = useLoading<LineGroup>(initData, { Component: LineGroup })

  return elem
}

export default LineGroupPage
