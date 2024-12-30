import { useCallback, useMemo } from 'react'
import Stack from '@mui/material/Stack'
import { AddButton } from 'components/CustomButton'
import FormModal from 'components/FormModal'
import CustomList, { Content, customListItem, Item } from 'components/List'
import PageContainer from 'components/PageContainer'
import DeleteForm from './DeleteForm'
import LinkForm from './LinkForm'
import { formatDate } from 'utils/date'
import useLoading from 'utils/useLoading'
import useRequiredParams from 'utils/useRequiredParams'
import useToggle from 'utils/useToggle'
import { logProps as getLogProps } from '_constants/form'
import { getNode } from 'api/node'
import { LineNode, Log } from 'types'

const Content: Content<Log> = ({ data }) => (
  <Stack
    dangerouslySetInnerHTML={{ __html: data.content }}
    component="p"
    sx={{ whiteSpace: 'pre-wrap' }}
  />
)

const Item: Item<Log> = customListItem({ Content })

const Node = ({
  data: { id, name, logs, key: originalKey },
  data
}: {
  data: LineNode
}) => {
  const [open, toggle] = useToggle()
  const logProps = useMemo(() => getLogProps({ nodeId: id }), [id])
  const key = useMemo(() => {
    if (typeof originalKey === 'string') {
      return originalKey
    }
    return formatDate(originalKey)
  }, [originalKey])

  return (
    <>
      key:{key}
      <CustomList<Log> Item={Item} list={logs} label={name} />
      <AddButton onClick={toggle} />
      <FormModal open={open} handleClose={toggle} {...logProps} />
      <DeleteForm data={data} />
      <LinkForm id={id} />
    </>
  )
}

const NodePage = () => {
  const { id } = useRequiredParams<{ id: string }>()
  const initData = useCallback(
    () => getNode({ id }).then((data) => data[0]),
    [id]
  )
  const { elem } = useLoading<LineNode>(initData, { Component: Node })

  return <PageContainer>{elem}</PageContainer>
}

export default NodePage
