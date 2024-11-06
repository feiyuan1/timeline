import { fireEvent, render, screen, within } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'
import { list } from './__mocks__/lineList'
import { Line, LineGroup } from 'types'
import { MouseEventHandler } from 'react'

const renderLineContent = (props: {
  data: Line
  handleClick?: MouseEventHandler<HTMLDivElement>
}) => {
  return render(<LineContent {...props} />)
}

describe('test LineContent UI', () => {
  const data = list[1] as Line

  it('nodes', () => {
    const { container } = renderLineContent({ data })
    const stack = container.querySelector<HTMLDivElement>('.MuiStack-root')
    expect(stack).toBeTruthy()
    if (!stack) {
      return
    }
    const nodes = stack.querySelectorAll<HTMLDivElement>('.MuiBox-root')
    expect(nodes.length).toBe(data.nodes.length)
    nodes.forEach((node, index) => {
      const item = data.nodes[index]
      const label = node.querySelector<HTMLDivElement>('.MuiChip-root')
      const name = node.querySelector<HTMLDivElement>('.MuiTypography-root')
      expect(label).toBeInTheDocument()
      expect(name).toBeInTheDocument()
      if (!label || !name) {
        return
      }
      expect(label).toHaveTextContent(item.key.toString())
      expect(name).toHaveTextContent(item.name)
    })
  })

  it('footer', () => {
    renderLineContent({ data })
    expect(screen.getByText('创建时间', { exact: false })).toHaveTextContent(
      data.createTime.toString()
    )
  })
})

describe('test LineContent UI edge cases', () => {
  it('test nodes.length === 0', () => {
    const data = list[2] as Line
    const { container } = renderLineContent({ data })
    expect(container).toHaveTextContent('暂无节点')
  })
})

describe('test LineContent interaction', () => {
  it('call click handler', () => {
    const data = list[1] as Line
    const handleClick = jest.fn()
    const { container } = renderLineContent({ data, handleClick })
    const content = container.querySelector<HTMLDivElement>(
      '.MuiCardContent-root'
    )
    expect(content).toBeInTheDocument()
    if (!content) {
      return
    }

    fireEvent.click(
      content,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    )

    expect(handleClick).toHaveBeenCalled()
  })
})

const renderLineGroup = (data: LineGroup) => {
  return render(
    <Router>
      <LineGroupContent data={data} />
    </Router>
  )
}

describe('test LineGroupContent UI', () => {
  const data = list[0] as LineGroup
  it('header', () => {
    const { container } = renderLineGroup(data)
    const header = container.querySelector<HTMLDivElement>(
      '.MuiCardHeader-root'
    )
    expect(header).toHaveTextContent(data.name)
  })

  it('tabs', () => {
    renderLineGroup(data)
    const tabs = screen.getByRole('tablist')
    expect(tabs).toBeInTheDocument()
    if (!tabs) {
      return
    }
    const { lines } = data
    const tablist = within(tabs).getAllByRole('tab')
    expect(tablist.length).toBe(lines.length)
    tablist.forEach((tab, index) => {
      const { name } = lines[index]
      expect(tab).toHaveTextContent(name)
    })
  })
})

// 点击 container 中第 index 个 tab
const changeTab = (container: HTMLElement, index: number) => {
  const tabList = within(container).getAllByRole('tab')
  fireEvent.click(
    tabList[index],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  )
}

// 从 container 中找到 LineContent，并测试是否使用 contentData 来渲染
const matchContent = (contentData: Line, container: HTMLElement) => {
  const { container: lineContainer } = renderLineContent({
    data: contentData
  })
  const content = container.querySelector<HTMLDivElement>(
    '.MuiCardContent-root'
  )
  const lineContent = lineContainer.querySelector<HTMLDivElement>(
    '.MuiCardContent-root'
  )
  expect(lineContent).toBeInTheDocument()
  expect(lineContainer).toBeInTheDocument()
  if (!content || !lineContent) {
    return
  }
  expect(content).toStrictEqual(lineContent)
}

describe('test LineGroupContent with logic', () => {
  const data = list[0] as LineGroup
  const targetIndex = 1
  it('tab selected default state', () => {
    // the first tab was selected
    renderLineGroup(data)
    const tab = screen.getByRole('tab', { selected: true })
    expect(tab).toHaveTextContent(data.lines[0].name)
  })

  it('tab selected after click event(update state)', () => {
    // after click second tab, the tab was selected, and only the one tab was selected
    const { container } = renderLineGroup(data)
    changeTab(container, targetIndex)
    const tab = screen.getByRole('tab', { selected: true })
    expect(tab).toHaveTextContent(data.lines[targetIndex].name)
    const selectedTabList = screen.getAllByRole('tab', { selected: true })
    expect(selectedTabList.length).toBe(1)
  })

  it('lines in default state', () => {
    // the first line was shown
    const { container } = renderLineGroup(data)
    matchContent(data.lines[0], container)
  })

  it('lines after click event(update state)', () => {
    // the second line was shown
    const { container } = renderLineGroup(data)
    changeTab(container, targetIndex)
    matchContent(data.lines[targetIndex], container)
  })
})

describe('LineGroupContent edge cases', () => {
  it('list length equal to 0', () => {
    // the tabs should not be in the doucment
    const data = list[3] as LineGroup
    const { queryByRole } = renderLineGroup(data)
    expect(queryByRole('tablist')).toBeFalsy()
  })
})
