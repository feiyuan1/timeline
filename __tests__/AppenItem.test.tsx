import { fireEvent, render, screen, within } from '@testing-library/react'
import AppendItem from 'pages/main/AppendItem'

const showMenu = (container: HTMLElement) => {
  // TODO getByRole 会引发 type="submit" button 某个事件，导致表单触发提交验证
  const button = container.querySelector<HTMLButtonElement>(
    '.MuiIconButton-root'
  )
  expect(button).toBeInTheDocument()
  if (!button) {
    return
  }
  const addIcon = screen.getByTestId('AddIcon')
  expect(button).toContainElement(addIcon)
  fireEvent.click(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  )
  const menu = document.body.querySelector<HTMLDivElement>('.MuiMenu-root')
  return menu
}

describe('AppendItem UI', () => {
  it('AddIcon is visible', () => {
    render(<AppendItem />)
    const addIcon = screen.getByTestId('AddIcon')
    expect(addIcon).toBeVisible()
  })

  it('Menu', () => {
    const { container } = render(<AppendItem />)
    const menu = showMenu(container)
    if (!menu) {
      return
    }
    const menuList = within(menu).getAllByRole('menuitem')
    expect(menuList.length).toBe(2)
    expect(within(menu).getByText('线路')).toBeInTheDocument()
    expect(within(menu).getByText('线路组')).toBeInTheDocument()
  })
  it('LineModal', () => {})
  it('LineGroupModal', () => {})
})

describe('AppendItem interaction', () => {
  it('click IconButton and Menu should be shouwn', () => {
    const { container } = render(<AppendItem />)
    const menu = showMenu(container)
    if (!menu) {
      return
    }
    expect(menu).toHaveAttribute('role', 'presentation')
    expect(menu).toBeVisible()
  })
  it('click add line button in menu', () => {
    //  Menu should be closed; LineModal is visible
  })
  it('click add lineGroup button in menu', () => {
    //  Menu should be closed; LineGroupModal is visible
  })
})

describe('AppendItem logic', () => {
  it('Menu is hidden by default', () => {
    render(<AppendItem />)
    const menu = document.body.querySelector<HTMLDivElement>('.MuiMenu-root')
    expect(menu).toBe(null)
  })
  it('LineModal is hidden by default', () => {})
  it('LineGroupModal is hidden by default', () => {})
})
