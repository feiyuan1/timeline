import { render, screen } from '@testing-library/react'
import LineContent from 'components/LineGroupContent'
import { list } from './__mocks__/lineList'
import { Line } from 'types'

describe('test LineContent UI', () => {
  const data = list[1] as Line

  it('nodes', () => {
    const { container } = render(<LineContent data={data} />)
    const stack = container.querySelector<HTMLDivElement>('.MuiStack-root')
    expect(stack).toBeTruthy()
    if (!stack) {
      return
    }
    // console.log(prettyDOM(stack))
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
    })
  })

  it('footer', () => {
    render(<LineContent data={data} />)
    expect(screen.getByText('创建时间', { exact: false })).toHaveTextContent(
      data.createTime.toString()
    )
  })
})

describe('test LineContent UI edge cases', () => {
  it('test nodes.length === 0', () => {
    const data = list[2] as Line
    const { container } = render(<LineContent data={data} />)
    expect(container).toHaveTextContent('暂无节点')
  })
})
