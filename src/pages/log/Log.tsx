import useRequiredParams from 'utils/useRequiredParams'

const Log = () => {
  const { id } = useRequiredParams<{ id: string }>()
  return <>{id}</>
}

const LogPage = () => {
  return <Log />
}

export default LogPage
