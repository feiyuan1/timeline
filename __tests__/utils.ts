import { ReactElement } from 'react'
import { render, act, screen } from '@testing-library/react'

export const renderWithRoot = (children: ReactElement) => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  return render(children, {
    container: root
  })
}

export const getInput = async (name: string): Promise<HTMLInputElement> => {
  // 被 FormControl（from mui）包裹的表单控件会在获取时触发校验 => invalid event handler 中包含更新状态的逻辑，需要包裹在 act 中
  const input: { current: HTMLInputElement | null } = { current: null }
  await act(
    async () =>
      (input.current = screen.getByRole<HTMLInputElement>('textbox', {
        name
      }))
  )

  return input.current!
}
