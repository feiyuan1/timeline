import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  MutableRefObject
} from 'react'
import { ObjectWithString } from 'types'
import { CustomValidations } from 'types/form'

export interface FormContextValue<
  P extends ObjectWithString = ObjectWithString
> {
  ref: MutableRefObject<Partial<P>>
  validateRef: MutableRefObject<CustomValidations<P> | undefined>
  update: (data: Partial<P>) => void
}

const FormContext = createContext<FormContextValue | null>(null)

export const useFormContext = () => {
  const data = useContext(FormContext)

  if (!data) {
    throw 'the component need to nested in FormProvider'
  }
  return data
}

export const FormProvider = ({ children }: PropsWithChildren) => {
  const formDataRef = useRef<ObjectWithString>({})
  const validateRef = useRef<CustomValidations<ObjectWithString>>()
  const update = (data: ObjectWithString) =>
    (formDataRef.current = {
      ...formDataRef.current,
      ...data
    })

  return (
    <FormContext.Provider value={{ ref: formDataRef, update, validateRef }}>
      {children}
    </FormContext.Provider>
  )
}

export default FormContext
