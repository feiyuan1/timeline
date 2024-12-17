import { useParams } from 'react-router-dom'

const useRequiredParams = <T extends Record<string, unknown>>() =>
  useParams() as T

export default useRequiredParams
