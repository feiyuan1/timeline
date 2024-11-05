import {
  fireEvent,
  prettyDOM,
  render,
  within,
  screen
} from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main, { getCardContent, ListItem } from 'pages/main/Main'
import { list } from './__mocks__/lineList'
import { Line, LineGroup } from 'types'
import LineContent, { LineGroupContent } from 'components/LineGroupContent'

describe('getCardContent UI', () => {
  it('type lineGroup', () => {
    const data = list[0] as LineGroup
    const { container } = render(<Router>{getCardContent(data)}</Router>)
    const { container: expectContainer } = render(
      <Router>
        <LineGroupContent data={data} />
      </Router>
    )
    const group = container.querySelector<HTMLDivElement>('.MuiBox-root')
    const expectGroup =
      expectContainer.querySelector<HTMLDivElement>('.MuiBox-root')
    expect(expectGroup).toBeInTheDocument()
    if (!expectGroup) {
      return
    }
    expect(group).toStrictEqual(expectGroup)
  })

  it('type line', () => {
    const data = list[1] as Line
    const { container } = render(getCardContent(data))
    const { container: expectContainer } = render(<LineContent data={data} />)
    const expectContent = expectContainer.querySelector<HTMLDivElement>(
      '.MuiCardContent-root'
    )
    const content = container.querySelector<HTMLDivElement>(
      '.MuiCardContent-root'
    )
    expect(container).toHaveTextContent(data.name)
    expect(content).toStrictEqual(expectContent)
  })
})

describe('ListItem interaction', () => {
  it('click Line item', () => {
    // navigate to /line/:id
    const data = list[1] as Line
    const { container } = render(
      <Router>
        <ListItem data={data} />
      </Router>
    )
    const card = container.querySelector<HTMLDivElement>('.MuiCard-root')
    expect(card).toBeInTheDocument()
    if (!card) {
      return
    }
    fireEvent.click(
      card,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    )
    expect(window.location.pathname).toBe(`/line/${data.id}`)
  })
})

describe('Main UI', () => {
  it('tab should be selected', () => {
    render(
      <Router>
        <Main />
      </Router>
    )
    const tab = screen.getByText('all')
    expect(tab).toHaveAttribute('aria-selected')
  })

  it('list length should equal to ListItem length', () => {
    // TODO data from backend
    const { container } = render(
      <Router>
        <Main />
      </Router>
    )
    const cardList = container.querySelectorAll<HTMLDivElement>('.MuiCard-root')
    expect(cardList.length).toBe(list.length)
  })
})
