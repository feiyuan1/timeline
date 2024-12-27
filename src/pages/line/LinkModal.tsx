import { memo, useMemo } from 'react'
import Link from '@mui/material/Link'
import { CheckBoxGroup, Item } from 'components/RegularInput'
import { LinkButton, UnlinkButton } from 'components/CustomButton'
import Alert from 'components/Alert'
import FormModal from 'components/FormModal'
import { Line } from 'types'
import { linkList, unlinkList } from 'api/lineGroup'
import { getLine } from 'api/line'
import { Type } from 'public/constants'
import { getLink, redirectToIndex } from 'utils/index'
import useToggle from 'utils/useToggle'
import useRequiredParams from 'utils/useRequiredParams'
import useLoading from 'utils/useLoading'

const initData = () =>
  getLine({ type: Type.line }).then((response) => {
    return response.map(
      (line: Line): Item => ({
        key: line.id,
        value: line.id,
        label: (
          <Link
            href={getLink(line)}
            underline="always"
            component="a"
            target="_blank"
          >
            {line.name}
          </Link>
        )
      })
    )
  })

const Component = memo(({ data: list }: { data: Item[] }) => (
  <CheckBoxGroup name="link" list={list} />
))

const LinkModal = () => {
  const [openLink, toggleLink] = useToggle()
  const { id } = useRequiredParams<{ id: string }>()
  const { elem, reload } = useLoading(initData, {
    Component,
    emptyUI: '暂无可引用的线路'
  })
  const linkLineProps = useMemo(
    () => ({
      title: '引用线路',
      children: elem,
      handleSubmit: ({ link }: { link: string[] }) => {
        if (!link?.length) {
          Alert.info('nothing to checked')
          return
        }
        linkList(id, link).then(() => {
          toggleLink()
          redirectToIndex()
        })
      }
    }),
    [id, toggleLink, elem]
  )
  const handleClick = () => {
    reload()
    toggleLink()
  }

  return (
    <>
      <LinkButton onClick={handleClick} />
      <FormModal open={openLink} handleClose={toggleLink} {...linkLineProps} />
    </>
  )
}

export const UnlinkModal = ({ lines }: { lines: Line[] }) => {
  const [openLink, toggleLink] = useToggle()
  const { id } = useRequiredParams<{ id: string }>()
  const list = useMemo(() => {
    return lines.map(({ id, name }) => ({ key: id, value: id, label: name }))
  }, [lines])

  const unlinkProps = useMemo(
    () => ({
      title: '解绑线路',
      children: <CheckBoxGroup name="unlink" list={list} />,
      handleSubmit: ({ unlink }: { unlink: string[] }) => {
        if (!unlink?.length) {
          Alert.info('nothing to checked')
          return
        }
        unlinkList(id, unlink).then(() => {
          toggleLink()
          redirectToIndex()
        })
      }
    }),
    [id, toggleLink, list]
  )

  return (
    <>
      <UnlinkButton onClick={toggleLink} />
      <FormModal open={openLink} handleClose={toggleLink} {...unlinkProps} />
    </>
  )
}

export default LinkModal
