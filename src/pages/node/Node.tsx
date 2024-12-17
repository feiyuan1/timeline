import useRequiredParams from 'utils/useRequiredParams'

const Node = () => {
  const { id } = useRequiredParams<{ id: string }>()

  return <>{id}</>
}

export default Node
