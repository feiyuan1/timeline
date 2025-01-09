import { fireEvent, render, screen, act, within } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main, { TabContent } from 'pages/main/Main'
import { mockGetAllList } from './__mocks__/apiMock/mix'
import { mockGetLog } from './__mocks__/apiMock/log'
import { TabKey, tabs } from 'pages/main/constants'

const renderMain = async () => {
  const promise = Promise.resolve()
  const view = render(
    <Router>
      <Main />
    </Router>
  )
  // Main 在初始化过程中加载数据完毕后更新状态, 这里是在等待状态更新完毕
  await act(async () => {
    await promise
  })

  return view
}
describe('main page logic', () => {
  const {
    response: { data: logs }
  } = mockGetLog()
  const {
    response: { data: lists }
  } = mockGetAllList()

  it('TabContent changed after switch tab', async () => {
    const { container } = await renderMain()
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
    const firstUnactiveTab = within(mainTab).getAllByRole('tab', {
      selected: false
    })[0]
    expect(container).toContainHTML(tabContentMix.innerHTML)
    fireEvent.click(firstUnactiveTab)
    expect(container).toContainHTML(tabContentLog.innerHTML)
  })

  it('mix tab should be selected by default', async () => {
    await renderMain()
    const mainTab = screen.getAllByRole('tablist')[0]
    const selectedTab = within(mainTab).getByRole('tab', { selected: true })
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
