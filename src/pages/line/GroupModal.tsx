import Link from '@mui/material/Link'
import { GroupButton } from 'components/CustomButton'
import { getGroup, linkList } from 'api/lineGroup'
import useLoading from 'utils/useLoading'
import { CustomRadioGroup, Item } from 'components/RegularInput'
import { getLink } from 'utils/index'
import useToggleFormModal from 'utils/useFormModal'

const name = 'add-group'

const initData = (): Promise<Item[]> =>
  getGroup().then((data) => {
    return data.map((group) => {
      const { id, name } = group
      return {
        value: id,
        label: (
          <Link
            href={getLink(group)}
            underline="always"
            component="a"
            target="_blank"
          >
            {name}
          </Link>
        ),
        key: id
      }
    })
  })

const Component = ({ data }: { data: Item[] }) => (
  <CustomRadioGroup name={name} list={data} />
)

const emptyUI = (
  <>
    暂无分组，去创建一个吧
    <Link component="a" href="/" target="_blank">
      创建分组
    </Link>
  </>
)

const groupProps = {
  title: '选择加入的分组：',
  keepMounted: false,
  validations: {
    [name]: {
      required: {
        value: true,
        message: '请选择一个分组'
      }
    }
  }
}

const GroupModal = ({ id }: { id: string }) => {
  const [toggle, FormModal] = useToggleFormModal()
  const { elem, reload } = useLoading(initData, {
    Component,
    emptyUI
  })

  const handleSubmit = async (data: { [name]: string }) =>
    linkList(data[name], [id]).then(toggle)

  const handleClick = () => {
    reload()
    toggle()
  }

  return (
    <>
      <GroupButton onClick={handleClick} />
      <FormModal {...groupProps} handleSubmit={handleSubmit}>
        {elem}
      </FormModal>
    </>
  )
}

export default GroupModal
