import { useMemo } from 'react'
import FormModal from './FormModal'
import Alert from './Alert'
import { DeleteButton } from './CustomButton'
import { CheckBox } from './RegularInput'
import useToggle from 'utils/useToggle'
import { redirectToIndex } from 'utils/index'
import { deleteGroup } from 'api/lineGroup'
import { LineGroup } from 'types'

const DeleteGroupModal = ({ data: { id, name } }: { data: LineGroup }) => {
  const [openDel, toggleDel] = useToggle()
  const confirmProps = useMemo(
    () => ({
      title: '即将删除线路组：' + name,
      keepMounted: false,
      children: (
        <CheckBox name="check" label="删除组包含的线路" labelPlacement="end" />
      ),
      handleSubmit: (value: { check: boolean }) => {
        deleteGroup(id, value.check).then(() => {
          Alert.success('删除成功')
          redirectToIndex()
        })
      }
    }),
    [id, name]
  )

  return (
    <>
      <DeleteButton onClick={toggleDel} customConfirm />
      <FormModal open={openDel} handleClose={toggleDel} {...confirmProps} />
    </>
  )
}

export default DeleteGroupModal
