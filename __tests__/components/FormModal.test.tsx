import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import FormModal from 'components/FormModal'
import { TextField } from 'components/RegularInput'

const formProps = {
  title: 'title',
  validations: {
    name: { required: { value: true, message: 'name required' } }
  },
  handleSubmit: jest.fn(),
  open: true,
  handleClose: jest.fn()
}

const formData = {
  name: 'customName',
  desc: 'customDesc'
}

const TestFormModal = () => (
  <FormModal {...formProps}>
    <TextField name="name" label="name" />
    <TextField name="desc" label="desc" />
  </FormModal>
)

const getInput = async (name: string): Promise<HTMLInputElement> => {
  // 被 FormControl（from mui）包裹的表单控件会在获取时触发校验 => invalid event handler 中包含更新状态的逻辑，需要包裹在 act 中
  const input: { current: HTMLInputElement | null } = { current: null }
  await act(
    async () =>
      (input.current = screen.getByRole<HTMLInputElement>('textbox', {
        name
      }))
  )

  return input.current!
}

describe('FormModal UI', () => {
  it('title correct', async () => {
    render(<TestFormModal />)
    const titleRef: { current: HTMLElement | null } = { current: null }
    await act(
      async () => (titleRef.current = screen.getByRole('heading', { level: 2 }))
    )
    expect(titleRef.current).toHaveAttribute('id', 'form-modal-title')
  })
})

describe('FormModal interaction', () => {
  it('click submit button to call submit api', async () => {
    render(<TestFormModal />)
    const modal = screen.getByRole('presentation')
    const nameInput = await getInput('name')
    fireEvent.input(nameInput, { target: { value: formData.name } })
    const form = modal.querySelector('form')!
    await act(async () => fireEvent.submit(form))
    expect(formProps.handleSubmit).toHaveBeenCalledWith({
      name: formData.name
    })
  })
})

describe('FormModal logic', () => {
  it('click submit button and it should be disabled until submit handler finished', async () => {
    render(<TestFormModal />)
    const modal = screen.getByRole('presentation')
    const nameInput = await getInput('name')
    fireEvent.input(nameInput, { target: { value: formData.name } })
    const form = modal.querySelector('form')!
    // TODO should use a better way to get submit button
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    fireEvent.submit(form)
    expect(button).toBeDisabled()
    await waitFor(async () => expect(button).not.toBeDisabled())
  })
})
