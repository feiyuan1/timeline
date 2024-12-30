import { useMemo } from 'react'
import Alert from 'components/Alert'
import { DeleteButton } from 'components/CustomButton'
import { CustomCheckbox } from 'components/RegularInput'
import { LineNode } from 'types'
import { deleteNode } from 'api/node'
import { redirectToIndex } from 'utils/index'
import useToggleFormModal from 'utils/useFormModal'

const labelProps = { label: '确认删除节点' }

const DeleteForm = ({ data: { name, id } }: { data: LineNode }) => {
  const [toggle, FormModal] = useToggleFormModal()
  const delProps = useMemo(
    () => ({
      title: '即将删除线路节点：' + name,
      validations: {
        check: {
          required: {
            value: true,
            message: '勾选选框'
          }
        }
      },
      keepMounted: false,
      children: <CustomCheckbox name="check" labelProps={labelProps} />,
      handleSubmit: () =>
        deleteNode(id).then(() => {
          Alert.success('删除成功')
          redirectToIndex()
        })
    }),
    [id, name]
  )

  return (
    <>
      <DeleteButton onClick={toggle} customConfirm />
      <FormModal {...delProps} />
    </>
  )
}

export default DeleteForm
