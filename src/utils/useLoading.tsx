import { FC, ReactElement, useCallback, useEffect, useState } from 'react'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    initData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [initData])

  const reload = useCallback(() => {
    if (loading) {
      return
    }
    load()
  }, [loading, load])

  const getElem = () => {
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

  useEffect(load, [load])

  return {
    elem: getElem(),
    reload
  }
}

export default useLoading
