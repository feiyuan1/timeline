import { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import FormModal from 'components/FormModal'
import LineContent from 'components/LineGroupContent'
import Alert from 'components/Alert'
import { AddButton } from 'components/CustomButton'
import DeleteGroupModal from 'components/DeleteGroupModal'
import PageContainer from 'components/PageContainer'
import CustomList, { customListItem } from 'components/List'
import LinkModal, { UnlinkModal } from './LinkModal'
import useToggle from 'utils/useToggle'
import useRequiredParams from 'utils/useRequiredParams'
import useLoading from 'utils/useLoading'
import { isEmpty } from 'public/utils'
import { LineGroup, FormLine, Line } from 'types'
import { getGroup, addChildLine } from 'api/lineGroup'
import { lineProps as formProps } from '_constants/form'

const Item = customListItem({ Content: LineContent })

const LineGroup = ({ data: { name, lines }, data }: { data: LineGroup }) => {
  const [openLine, toggleLine] = useToggle()
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
      <CustomList<Line> list={lines} label={name} Item={Item} />
      <FormModal open={openLine} handleClose={toggleLine} {...lineProps} />
      <AddButton onClick={() => toggleLine()} />
      <DeleteGroupModal data={data} />
      <LinkModal />
      {!isEmpty(lines) && <UnlinkModal lines={lines} />}
    </Box>
  )
}

const LineGroupPage = () => {
  const { id } = useRequiredParams<{ id: string }>()
  const initData = useCallback(
    () => getGroup({ id }).then((data) => data[0]),
    [id]
  )
  const { elem } = useLoading<LineGroup>(initData, { Component: LineGroup })

  return <PageContainer>{elem}</PageContainer>
}

export default LineGroupPage
