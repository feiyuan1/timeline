import { InputBaseProps } from '@mui/material/InputBase'
import { FormControlOwnProps } from '@mui/material/FormControl'
import { useFormContext, FormContextValue } from 'components/FormContext'
import { useState, useMemo, ChangeEventHandler } from 'react'

interface ErrorInfo {
  error: boolean
  message?: string
}

type InputProps = Pick<InputBaseProps, 'name' | 'id' | 'error' | 'onChange'>

interface RegularInput {
  (
    props: InputProps & Required<Pick<InputProps, 'name'>>
  ): [
    InputProps &
      FormControlOwnProps &
      Required<Pick<InputProps, 'onChange'>> & { helperText?: string },
    FormContextValue
  ]
}

/**
 * TODO validateRef stucture
 * TODO returnType
 *
 */
const useRegularInput: RegularInput = ({ name }) => {
  const formContextValue = useFormContext()
  const { ref, validateRef } = formContextValue
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({ error: false })
  const defaultValue = ref.current[name]
  const validations = useMemo(() => {
    if (!validateRef.current || !validateRef.current[name]) {
      return {}
    }

    const validations = validateRef.current[name]
    return Object.keys(validations).reduce(
      // @ts-expect-error TODO validateRef stucture
      (result, key) => ({ ...result, [key]: validations[key].value }),
      {}
    )
  }, [name, validateRef])

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const {
      name,
      validity: { valid, valueMissing }
    } = event.target as HTMLInputElement
    if (!valid) {
      if (valueMissing) {
        setErrorInfo({
          error: true,
          // @ts-expect-error TODO validateRef stucture
          message: validateRef.current[name]['required'].message
        })
      }
    } else {
      setErrorInfo({ error: false })
    }
  }

  const handleInvalid: React.FormEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault()
    const {
      name,
      validity: { valueMissing }
    } = event.target as HTMLInputElement
    if (valueMissing) {
      setErrorInfo({
        error: true,
        // @ts-expect-error TODO validateRef stucture
        message: validateRef.current[name]['required'].message
      })
    }
  }

  return [
    {
      variant: 'standard',
      ...(defaultValue != null && { defaultValue }),
      error: errorInfo.error,
      helperText: errorInfo.message,
      onChange: handleChange,
      onInvalid: handleInvalid,
      ...validations
    },
    formContextValue
  ]
}

export default useRegularInput
