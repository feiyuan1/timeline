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
    const nameInput = await screen.findByRole('textbox', { name: 'name' })
    fireEvent.input(nameInput, { target: { value: formData.name } })
    const form = modal.querySelector('form')!
    fireEvent.submit(form)
    await waitFor(async () =>
      expect(formProps.handleSubmit).toHaveBeenCalledWith({
        name: formData.name
      })
    )
  })
})

describe('FormModal logic', () => {
  it('click submit button and it should be disabled until submit handler finished', async () => {
    render(<TestFormModal />)
    const modal = screen.getByRole('presentation')
    const nameInput = await screen.findByRole('textbox', { name: 'name' })
    fireEvent.input(nameInput, { target: { value: formData.name } })
    const form = modal.querySelector('form')!
    // TODO should use a explicit way to get submit button
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    fireEvent.submit(form)
    expect(button).toBeDisabled()
    await waitFor(async () => expect(button).not.toBeDisabled())
  })
})
