import { useMemo } from 'react'
import Alert from './Alert'
import { DeleteButton } from './CustomButton'
import { CustomCheckbox, CustomCheckboxProps } from './RegularInput'
import { redirectToIndex } from 'utils/index'
import useToggleFormModal from 'utils/useFormModal'
import { deleteGroup } from 'api/lineGroup'
import { LineGroup } from 'types'

const labelProps: CustomCheckboxProps['labelProps'] = {
  label: '删除组包含的线路',
  labelPlacement: 'end'
}

const DeleteGroupModal = ({ data: { id, name } }: { data: LineGroup }) => {
  const [toggle, FormModal] = useToggleFormModal()
  const confirmProps = useMemo(
    () => ({
      title: '即将删除线路组：' + name,
      keepMounted: false,
      children: <CustomCheckbox name="check" labelProps={labelProps} />,
      handleSubmit: async (value: { check: boolean }) =>
        deleteGroup(id, value.check).then(() => {
          Alert.success('删除成功')
          redirectToIndex()
        })
    }),
    [id, name]
  )

  return (
    <>
      <DeleteButton onClick={toggle} customConfirm />
      <FormModal {...confirmProps} />
    </>
  )
}

export default DeleteGroupModal
