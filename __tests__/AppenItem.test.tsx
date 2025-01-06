import {
  fireEvent,
  getAllByRole,
  getByText,
  render,
  screen
} from '@testing-library/react'
import AppendItem from 'pages/main/AppendItem'

const showMenu = (container: HTMLElement) => {
  // TODO 因为存在 test case: AddButton is visible in initial state => 这里还需要再次校验吗？
  const button = container.querySelector<HTMLButtonElement>(
    '.MuiIconButton-root'
  )!
  fireEvent.click(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  )
  // TODO 因为存在 test case：click IconButton and Menu should be shouwn => 这里还需要再次校验吗？
  return screen.getByRole('presentation')
}

describe('AppendItem UI', () => {
  // TODO getByRole 会引发 type="submit" button 某个事件，导致表单触发提交验证
  it('AddButton is visible in initial state', () => {
    const { container } = render(<AppendItem />)
    const button = container.querySelector<HTMLButtonElement>(
      '.MuiIconButton-root'
    )
    expect(button).toBeInTheDocument()
    if (!button) {
      return
    }
    const addIcon = screen.getByTestId('AddIcon')
    expect(addIcon).toBeVisible()
    expect(button).toContainElement(addIcon)
  })

  it('Menu UI', () => {
    const { container } = render(<AppendItem />)
    const menu = showMenu(container)!
    const menuList = getAllByRole(menu, 'menuitem')
    expect(menuList.length).toBe(2)
    expect(getByText(menu, '线路')).toBeInTheDocument()
    expect(getByText(menu, '线路组')).toBeInTheDocument()
  })
  it('LineModal', () => {})
  it('LineGroupModal', () => {})
})

describe('AppendItem interaction', () => {
  it('click IconButton and Menu should be shouwn', () => {
    const { container } = render(<AppendItem />)
    const menu = showMenu(container)
    expect(menu).toHaveClass('MuiMenu-root')
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
    const menu = screen.queryByRole('presentation')
    expect(menu).toBe(null)
  })

  it('LineModal is hidden by default', () => {})
  it('LineGroupModal is hidden by default', () => {})
})
