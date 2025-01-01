import { useCallback, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PageContainer from 'components/PageContainer'
import Alert from 'components/Alert'
import { EditButton } from 'components/CustomButton'
import useToggleFormModal from 'utils/useFormModal'
import useLoading from 'utils/useLoading'
import useRequiredParams from 'utils/useRequiredParams'
import { formatDate } from 'utils/date'
import { logProps as getLogProps } from '_constants/form'
import { getLog, updateLog } from 'api/log'
import { Log } from 'types'

const handleSubmit = (value: Log) => {
  updateLog(value.id, value).then(() => {
    Alert.success('修改成功')
    location.reload()
  })
}

const Log = ({ data: { name, content, updateTime }, data }: { data: Log }) => {
  const [toggle, FormModal] = useToggleFormModal()
  const logProps = useMemo(
    () =>
      getLogProps({
        nodeId: '',
        otherProps: {
          initValue: data,
          handleSubmit
        }
      }),
    [data]
  )

  return (
    <Box>
      {name}
      <Box sx={{ whiteSpace: 'pre-wrap' }} component="p">
        {content}
      </Box>
      <Typography sx={{ fontSize: 12 }} color="#aaa">
        更新时间：{formatDate(updateTime)}
      </Typography>
      <EditButton onClick={toggle} />
      <FormModal {...logProps} />
    </Box>
  )
}

const LogPage = () => {
  const { id } = useRequiredParams<{ id: string }>()
  const initData = useCallback(
    () => getLog({ id }).then((data) => data[0]),
    [id]
  )
  const { elem } = useLoading(initData, { Component: Log })

  return <PageContainer container={{ maxWidth: '800px' }}>{elem}</PageContainer>
}

export default LogPage
