import { fireEvent, render, screen } from '@testing-library/react'
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
  name: 'customName'
}

const TestFormModal = () => (
  <FormModal {...formProps}>
    <TextField name="name" label="name" />
  </FormModal>
)

describe('TextField UI', () => {
  it('label correct', async () => {
    render(<TestFormModal />)
    const label = screen.getByLabelText('name', { exact: false })
    expect(label).toBeInTheDocument()
  })

  it('input correct', async () => {
    render(<TestFormModal />)
    expect(
      await screen.findByRole('textbox', { name: 'name' })
    ).toBeInTheDocument()
  })
})

describe('TextField interaction', () => {
  it('input value correct', async () => {
    render(<TestFormModal />)
    const nameInput = await screen.findByRole('textbox', { name: 'name' })
    fireEvent.input(nameInput, { target: { value: formData.name } })
    expect(nameInput).toHaveValue(formData.name)
  })
})

describe('TextField logic', () => {
  it('miss required input should give an error to user when submit', async () => {
    render(<TestFormModal />)
    const modal = screen.getByRole('presentation')
    const form = modal.querySelector('form')!
    fireEvent.submit(form)
    expect(await screen.findByRole('textbox', { name: 'name' })).toBeInvalid()
  })

  it('miss required input should give an error to user when change input', async () => {
    render(<TestFormModal />)
    const nameInput = await screen.findByRole('textbox', { name: 'name' })
    fireEvent.input(nameInput, { target: { value: formData.name } })
    expect(nameInput).not.toBeInvalid()
    fireEvent.input(nameInput, { target: { value: '' } })
    expect(nameInput).toBeInvalid()
  })
})
