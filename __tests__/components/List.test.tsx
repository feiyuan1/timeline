import { BrowserRouter as Router } from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import { LogItem } from 'components/List'
import { getLink } from 'utils/index'
import { logs } from '../__mocks__/lineList'

describe('LogItem interaction', () => {
  it('click and navigate to log page', () => {
    const data = logs[0]
    const { container } = render(
      <Router>
        <LogItem data={data} index={0} />
      </Router>
    )
    const card = container.querySelector<HTMLDivElement>('.MuiCard-root')!
    fireEvent.click(card)
    expect(window.location.pathname).toBe(getLink(data))
  })
})
