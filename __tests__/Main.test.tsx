import {
  fireEvent,
  render,
  screen,
  act,
  getAllByRole,
  getByRole
} from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main, { TabContent } from 'pages/main/Main'
import { mockGetAllList } from './__mocks__/apiMock/mix'
import { mockGetLog } from './__mocks__/apiMock/log'
import { TabKey, tabs } from 'pages/main/constants'

describe('main page logic', () => {
  const {
    response: { data: logs }
  } = mockGetLog()
  const {
    response: { data: lists }
  } = mockGetAllList()

  it('TabContent changed after switch tab', async () => {
    // 这里包裹 act 是因为 Main 在初始化过程中加载数据完毕后更新状态
    const { container } = await act(async () =>
      render(
        <Router>
          <Main />
        </Router>
      )
    )
    const { container: tabContentMix } = render(
      <Router>
        <TabContent current={TabKey.mix} data={[lists, logs]} />
      </Router>
    )
    const { container: tabContentLog } = render(
      <Router>
        <TabContent current={TabKey.log} data={[lists, logs]} />
      </Router>
    )
    const mainTab = screen.getAllByRole('tablist')[0]
    const firstUnactiveTab = getAllByRole(mainTab, 'tab', {
      selected: false
    })[0]
    expect(container).toContainHTML(tabContentMix.innerHTML)
    fireEvent.click(firstUnactiveTab)
    expect(container).toContainHTML(tabContentLog.innerHTML)
  })

  it('mix tab should be selected by default', async () => {
    // 这里包裹 act 是因为 Main 在初始化过程中加载数据完毕后更新状态
    await act(async () =>
      render(
        <Router>
          <Main />
        </Router>
      )
    )
    const mainTab = screen.getAllByRole('tablist')[0]
    const selectedTab = getByRole(mainTab, 'tab', { selected: true })
    const tab = tabs.find((tab) => tab.key === TabKey.mix)!
    expect(tab).toBeTruthy()
    expect(selectedTab).toHaveTextContent(tab.label)
  })
})
// TODO UI 暂时忽略
// describe('getCardContent UI', () => {
//   it('type lineGroup', () => {
//     const data = list[0]
//     const { container } = render(<Router>{getCardContent(data)}</Router>)
//     const { container: expectContainer } = render(
//       <Router>
//         <LineGroupContent data={data} />
//       </Router>
//     )
//     const group = container.querySelector<HTMLDivElement>('.MuiBox-root')
//     const expectGroup =
//       expectContainer.querySelector<HTMLDivElement>('.MuiBox-root')
//     expect(expectGroup).toBeInTheDocument()
//     if (!expectGroup) {
//       return
//     }
//     expect(group).toStrictEqual(expectGroup)
//   })

//   it('type line', () => {
//     const data = list[1]
//     const { container } = render(getCardContent(data))
//     const { container: expectContainer } = render(<LineContent data={data} />)
//     const expectContent = expectContainer.querySelector<HTMLDivElement>(
//       '.MuiCardContent-root'
//     )
//     const content = container.querySelector<HTMLDivElement>(
//       '.MuiCardContent-root'
//     )
//     expect(container).toHaveTextContent(data.name)
//     expect(content).toStrictEqual(expectContent)
//   })
// })
