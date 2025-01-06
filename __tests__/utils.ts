import { ReactElement } from 'react'
import { render } from '@testing-library/react'

export const renderWithRoot = (children: ReactElement) => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  return render(children, {
    container: root
  })
}
