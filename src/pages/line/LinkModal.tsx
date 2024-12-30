import { memo, useCallback, useMemo } from 'react'
import Link from '@mui/material/Link'
import { CheckBoxGroup, Item } from 'components/RegularInput'
import { LinkButton } from 'components/CustomButton'
import { LineWithinGroup } from 'types'
import { getAggregateLine, linkList } from 'api/lineGroup'
import { getLink } from 'utils/index'
import useRequiredParams from 'utils/useRequiredParams'
import useLoading from 'utils/useLoading'
import useToggleFormModal from 'utils/useFormModal'

const initData = (id: string) =>
  getAggregateLine(id).then((response) => {
    return response.map(
      ({ include: defaultSelect, ...line }: LineWithinGroup): Item => ({
        key: line.id,
        value: line.id,
        label: (
          <Link href={getLink(line)} component="a" target="_blank">
            {line.name}
          </Link>
        ),
        ...(defaultSelect && { defaultSelect })
      })
    )
  })

const Component = memo(({ data: list }: { data: Item[] }) => (
  <CheckBoxGroup name="link" list={list} />
))

const Components = {
  Component,
  emptyUI: '暂无可引用的线路'
}

const LinkModal = () => {
  const [toggle, FormModal] = useToggleFormModal()
  const { id } = useRequiredParams<{ id: string }>()
  const getLines = useCallback(() => initData(id), [id])
  const { elem, reload } = useLoading(getLines, Components)
  const linkLineProps = useMemo(
    () => ({
      title: '引用线路',
      children: elem,
      handleSubmit: async ({ link }: { link: string[] }) =>
        linkList(id, link).then(() => {
          toggle()
          location.reload()
        })
    }),
    [id, toggle, elem]
  )
  const handleClick = () => {
    reload()
    toggle()
  }

  return (
    <>
      <LinkButton onClick={handleClick} />
      <FormModal {...linkLineProps} />
    </>
  )
}

export default LinkModal
