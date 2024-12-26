import { useState, useMemo, ChangeEventHandler, InvalidEvent } from 'react'
import { FormControlOwnProps } from '@mui/material/FormControl'
import { useFormContext, FormContextValue } from 'components/FormContext'
import { isEmpty } from 'public/utils'
import { defaultType, ErrorInfo, Validations } from 'types/form'

type ReturnRegular = [
  {
    variant: FormControlOwnProps['variant']
  } & Validate &
    Partial<Validations>,
  FormContextValue
]

/**
 * support：
 * 1. defaultValue ×
 * 2. validator √
 * 3. formContext √
 * 4. varient √
 */

const useRegularInput = ({ name }: { name: string }): ReturnRegular => {
  const formContextValue = useFormContext()
  const validations = useInputValidations(name)
  const validate = useInputValidate()

  return [
    {
      variant: 'standard',
      ...validate,
      ...validations
    },
    formContextValue
  ]
}

type ReturnDefaultValue<T extends defaultType = defaultType.normal> =
  T extends defaultType.checkbox
    ? { defaultChecked?: boolean }
    : { defaultValue?: unknown }

const isCheck = (type?: defaultType): type is defaultType.checkbox =>
  Boolean(type && type === defaultType.checkbox)

interface DefaultValue {
  (
    name: string,
    type: defaultType.checkbox
  ): ReturnDefaultValue<defaultType.checkbox>
  (
    name: string,
    type?: defaultType.normal
  ): ReturnDefaultValue<defaultType.normal>
}

export const useDefaultValue: DefaultValue = (name, type) => {
  const { ref } = useFormContext()
  const defaultValue = ref.current[name]

  if (defaultValue == null) {
    return {}
  }

  if (isCheck(type)) {
    return { defaultChecked: defaultValue as boolean }
  }

  return { defaultValue }
}

export const useInputValidations = (name: string): Partial<Validations> => {
  const { validateRef } = useFormContext()
  const validations = useMemo(() => {
    if (!validateRef.current || !validateRef.current[name]) {
      return {}
    }

    const validations = validateRef.current[name]
    return (Object.keys(validations) as (keyof Validations)[]).reduce(
      (result, key) => ({ ...result, [key]: validations[key]!.value }),
      {}
    )
  }, [name, validateRef])

  return validations
}
export interface Validate {
  changeValidate: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onInvalid: (event: InvalidEvent<HTMLInputElement>) => void
  error: ErrorInfo['error']
  helperText?: ErrorInfo['message']
}

export const useInputValidate = (): Validate => {
  const {
    validateRef: { current }
  } = useFormContext()
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({ error: false })

  const changeValidate: Validate['changeValidate'] = (event) => {
    const validations = current?.[event.target.name]
    if (!event.target.validity || isEmpty(current) || isEmpty(validations)) {
      return
    }

    const {
      validity: { valid, valueMissing }
    } = event.target

    if (!valid) {
      if (valueMissing) {
        setErrorInfo({
          error: true,
          message: validations['required']!.message
        })
      }
    } else {
      setErrorInfo({ error: false })
    }
  }

  const handleInvalid: Validate['onInvalid'] = (event) => {
    event.preventDefault()
    const validations = current?.[event.target.name]

    if (!validations) {
      return
    }

    const {
      validity: { valueMissing }
    } = event.target
    if (valueMissing) {
      setErrorInfo({
        error: true,
        message: validations['required']!.message
      })
    }
  }

  return {
    error: errorInfo.error,
    helperText: errorInfo.message,
    changeValidate,
    onInvalid: handleInvalid
  }
}
export default useRegularInput
