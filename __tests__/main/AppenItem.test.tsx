import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import AppendItem from 'pages/main/AppendItem'
import { matchInputName, renderWithRoot } from '../utils'
import { lineProps } from '_constants/form'
import { mockAddLine } from '../__mocks__/apiMock/line'

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

const showModal = (index: number) => {
  const { container } = renderWithRoot(<AppendItem />)
  showMenu(container)
  const button = screen.getAllByRole('menuitem')[index]
  fireEvent.click(button)
  return screen.queryByRole('presentation')
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
    showMenu(container)!
    const menuList = screen.getAllByRole('menuitem')
    expect(menuList).toHaveLength(2)
    expect(screen.getByText('线路')).toBeInTheDocument()
    expect(screen.getByText('线路组')).toBeInTheDocument()
  })
  it('LineModal UI', async () => {
    // TODO 因为存在 test case：click add line button in menu => 这里是否需要再次确认 modal 不是 menu 呢？
    const modal = showModal(0)!
    const { title } = lineProps
    expect(modal).toHaveTextContent(title)
    const form = await screen.findByRole('form')
    // TODO 因为 FormModal 组件实现的问题，无法很好的定位 form 的 输入区&操作区，这里也无法更精细的保存 snapshot
    expect(form).toMatchSnapshot('form part')
    expect(modal).toMatchSnapshot()
  })

  // it('TODO LineGroupModal UI', () => {})
})

describe('AppendItem interaction', () => {
  it('click IconButton and Menu should be shouwn', () => {
    const { container } = render(<AppendItem />)
    const menu = showMenu(container)
    expect(menu).toHaveClass('MuiMenu-root')
  })

  it('click add line button in menu', () => {
    const modal = showModal(0)
    expect(modal).toBeTruthy()
    expect(modal).not.toHaveClass('MuiMenu-root')
    // TODO 是否需要&如何区分 lineModal & groupModal?
  })

  it('click add lineGroup button in menu', () => {
    const modal = showModal(1)
    expect(modal).toBeTruthy()
    expect(modal).not.toHaveClass('MuiMenu-root')
  })
})

describe('AppendItem logic', () => {
  it('Menu&LineModal&LineGroupModal is hidden by default', () => {
    render(<AppendItem />)
    const presentation = screen.queryByRole('presentation')
    expect(presentation).toBe(null)
  })
})

describe('LineModal logic', () => {
  const { name } = mockAddLine()
  it('submit to fetch addLine api', async () => {
    // TODO location.reload =>> navigation not implemented
    // TODO 是我的测试用例有问题吗？这里我希望触发 promise.then 回调的执行，并且不报错
    // TODO 如何捕获回调中的异步错误
    const modal = showModal(0)!
    const button = modal.querySelector('button')!
    const nameInput = await screen.findByRole('textbox', {
      name: matchInputName('name')
    })
    fireEvent.change(nameInput, { target: { value: 'testName' } })
    fireEvent.submit(button)
    await waitFor(() => expect(fetchMock.callHistory.called(name)).toBeTruthy())
  })
})
