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

type NameMatcher = (content: string, element: Element | null) => boolean
/**
 * usage: query input by name attribute
 * reason：query name option is different with input attribut name vlaue
 */
export const matchInputName = (name: string): NameMatcher => {
  return (_, element) => element?.getAttribute('name') === name
}
