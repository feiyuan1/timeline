import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { TabContent } from 'pages/main/Main'
import { TabKey } from 'pages/main/constants'
import { LogTab, MixItem, MixTab } from 'pages/main/MainTab'
import { getLink } from 'utils/index'
import { Line, LineGroup, Log } from 'types'
import { list, logs } from '../__mocks__/lineList'

describe('TabContent render tab correctly', () => {
  const tabDatas: [(Line | LineGroup)[], Log[]] = [list, logs]
  it('render LogTab when current equal to TabKey.log', () => {
    const { container } = render(
      <Router>
        <TabContent data={tabDatas} current={TabKey.log} />
      </Router>
    )
    const { container: logTab } = render(
      <Router>
        <LogTab data={tabDatas[1]} />
      </Router>
    )
    expect(container).toContainHTML(logTab.innerHTML)
  })
  it('render MixTab when current equal to TabKey.mix', () => {
    const { container } = render(
      <Router>
        <TabContent data={tabDatas} current={TabKey.mix} />
      </Router>
    )
    const { container: mixTab } = render(
      <Router>
        <MixTab data={tabDatas[0]} />
      </Router>
    )
    expect(container).toContainHTML(mixTab.innerHTML)
  })
})

describe('LogTab logic', () => {
  it('logs length should equal to render list length', () => {
    const { container } = render(
      <Router>
        <LogTab data={logs} />
      </Router>
    )
    const cardList = container.querySelectorAll<HTMLDivElement>('.MuiCard-root')
    expect(cardList).toHaveLength(logs.length)
  })

  it('TODO click submit button fire mock fetch add log api', () => {})
})

describe('LogTab interaction', () => {
  it('TODO click add button to show modal', () => {})
})

describe('MixTab interaction', () => {
  it('click node in item and navigate to node page', () => {
    render(
      <Router>
        <MixItem data={list[1]} />
      </Router>
    )
    const nodes = screen.getAllByRole('button')!
    expect(nodes).toBeTruthy()
    fireEvent.click(nodes[0])
    expect(location.pathname).toBe(getLink(list[1].nodes[0]))
  })

  it('click tab in group item and have no navigation', () => {
    render(
      <Router>
        <MixItem data={list[0]} />
      </Router>
    )
    const tabs = screen.getAllByRole('tab', { selected: false })
    expect(tabs).toBeTruthy()
    const originalPath = location.pathname
    fireEvent.click(tabs[0])
    expect(location.pathname).toBe(originalPath)
  })
})
