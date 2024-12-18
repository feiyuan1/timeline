import { FC, ReactElement, useEffect, useState } from 'react'

const useLoading = <T,>(
  initData: () => Promise<T>,
  {
    Component,
    loadingUI,
    errorUI,
    emptyUI
  }: {
    Component: FC<{ data: T }>
    loadingUI?: ReactElement
    errorUI?: ReactElement
    emptyUI?: ReactElement
  }
) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    if (!loading) {
      return
    }
    initData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [initData, loading])

  if (loading) {
    return loadingUI || 'loading'
  }

  if (error) {
    return errorUI || 'error'
  }

  if (!data) {
    return emptyUI || 'empty'
  }

  return <Component data={data} />
}

export default useLoading
