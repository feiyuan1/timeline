import {
  useState,
  useMemo,
  ChangeEventHandler,
  InvalidEvent,
  useCallback
} from 'react'
import { FormControlOwnProps } from '@mui/material/FormControl'
import { useFormContext, FormContextValue } from 'components/FormContext'
import { isEmpty } from 'public/utils'
import { defaultType, ErrorInfo, Validations } from 'types/form'

interface RegularProps {
  variant: FormControlOwnProps['variant']
}

type ReturnRegular = [
  RegularProps & Partial<Validate> & Partial<Validations>,
  FormContextValue
]

/**
 * support：
 * 1. defaultValue ×
 * 2. validator √
 * 3. formContext √
 * 4. varient √
 */

const regularProps: RegularProps = {
  variant: 'standard'
}

const useRegularInput = ({ name }: { name: string }): ReturnRegular => {
  const formContextValue = useFormContext()
  const validations = useInputValidations(name)
  const validate = useInputValidate()

  if (isEmpty(validations)) {
    return [regularProps, formContextValue]
  }
  return [
    {
      ...regularProps,
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

  const changeValidate: Validate['changeValidate'] = useCallback(
    (event) => {
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
    },
    [current]
  )

  const handleInvalid: Validate['onInvalid'] = useCallback(
    (event) => {
      event.preventDefault()
      const validations = current?.[event.target.name]

      if (!validations) {
        return
      }

      const {
        validity: { valueMissing }
      } = event.target
      if (
        valueMissing &&
        errorInfo.message !== validations['required']!.message
      ) {
        setErrorInfo({
          error: true,
          message: validations['required']!.message
        })
      }
    },
    [current, errorInfo]
  )

  const validate = useMemo(
    () => ({
      error: errorInfo.error,
      helperText: errorInfo.message,
      changeValidate,
      onInvalid: handleInvalid
    }),
    [errorInfo, changeValidate, handleInvalid]
  )

  return validate
}
export default useRegularInput
