import { act, fireEvent, render, screen } from '@testing-library/react'
import FormModal from 'components/FormModal'
import { TextField } from 'components/RegularInput'
import { getInput } from '../utils'

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
    const nameInput = await getInput('name')
    expect(nameInput).toBeInTheDocument()
  })
})

describe('TextField interaction', () => {
  it('input value correct', async () => {
    render(<TestFormModal />)
    const nameInput = await getInput('name')
    fireEvent.input(nameInput, { target: { value: formData.name } })
    expect(nameInput).toHaveValue(formData.name)
  })
})

describe('TextField logic', () => {
  it('miss required input should give an error to user when submit', async () => {
    render(<TestFormModal />)
    const modal = screen.getByRole('presentation')
    const form = modal.querySelector('form')!
    const nameInput = await getInput('name')
    await act(async () => fireEvent.submit(form))
    expect(nameInput).toBeInvalid()
  })

  it('miss required input should give an error to user when change input', async () => {
    render(<TestFormModal />)
    const nameInput = await getInput('name')
    fireEvent.input(nameInput, { target: { value: formData.name } })
    expect(nameInput).not.toBeInvalid()
    fireEvent.input(nameInput, { target: { value: '' } })
    expect(nameInput).toBeInvalid()
  })
})
