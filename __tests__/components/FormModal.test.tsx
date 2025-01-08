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
    await act(async () => render(<TestFormModal />))
    const title = screen.getByRole('heading', { level: 2 })
    expect(title).toHaveAttribute('id', 'form-modal-title')
  })
})

describe('FormModal interaction', () => {
  it('click submit button to call submit api', async () => {
    await act(async () => render(<TestFormModal />))
    const modal = screen.getByRole('presentation')
    const nameInput = screen.getByRole('textbox', {
      name: 'name'
    })
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
    await act(async () => render(<TestFormModal />))
    const modal = screen.getByRole('presentation')
    const nameInput = screen.getByRole('textbox', {
      name: 'name'
    })
    fireEvent.input(nameInput, { target: { value: formData.name } })
    const form = modal.querySelector('form')!
    // TODO should use a better way to get submit button
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    fireEvent.submit(form)
    expect(button).toBeDisabled()
    waitFor(() => expect(button).not.toBeDisabled())
  })
})
