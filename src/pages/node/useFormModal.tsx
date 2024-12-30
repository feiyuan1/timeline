import { useMemo } from 'react'
import FormModal, { FormModalProps } from 'components/FormModal'
import useToggle from 'utils/useToggle'

const useToggleFormModal = () => {
  const [open, toggle] = useToggle()
  const result = useMemo(() => {
    const FormModalWithoutToggle = (
      props: Omit<FormModalProps, 'open' | 'handleClose'>
    ) => <FormModal open={open} handleClose={toggle} {...props} />

    return [toggle, FormModalWithoutToggle] as const
  }, [open, toggle])

  return result
}

export default useToggleFormModal
