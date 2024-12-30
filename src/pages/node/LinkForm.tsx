import { useCallback } from 'react'
import Alert from 'components/Alert'
import { LinkButton } from 'components/CustomButton'
import { CheckBoxGroup, Item } from 'components/RegularInput'
import useLoading from 'utils/useLoading'
import { getAggreateLogs, linkLogs } from 'api/node'
import useToggleFormModal from './useFormModal'

const initData = (id: string): Promise<Item[]> =>
  getAggreateLogs(id).then((data) =>
    data.map(({ id, name, include: defaultSelect }) => ({
      key: id,
      value: id,
      label: name,
      ...(defaultSelect && { defaultSelect })
    }))
  )

const props = {
  title: '选择关联的记录：',
  keepMounted: false
}

const emptyUI = '暂无记录，去创建一个吧'

const Component = ({ data }: { data: Item[] }) => (
  <CheckBoxGroup list={data} name="selectedLogs" />
)

const LinkForm = ({ id }: { id: string }) => {
  const [toggle, FormModal] = useToggleFormModal()
  const getLogList = useCallback(() => initData(id), [id])
  const { elem, reload } = useLoading(getLogList, {
    Component,
    emptyUI
  })
  const handleSubmit = useCallback(
    ({ selectedLogs }: { selectedLogs: string[] }) => {
      linkLogs(id, selectedLogs).then(() => {
        Alert.success('修改成功')
        reload()
      })
    },
    [id, reload]
  )

  const handleClick = () => {
    reload()
    toggle()
  }

  return (
    <>
      <LinkButton onClick={handleClick} />
      <FormModal handleSubmit={handleSubmit} {...props}>
        {elem}
      </FormModal>
    </>
  )
}

export default LinkForm
