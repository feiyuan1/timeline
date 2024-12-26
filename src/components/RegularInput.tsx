import {
  ChangeEvent,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import OriginalTextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import OriginalSelect, { SelectProps } from '@mui/material/Select'
import FormControl, { FormControlOwnProps } from '@mui/material/FormControl'
import FormControlLabel, {
  FormControlLabelProps
} from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup'
import useRegularInput, {
  useDefaultValue,
  useInputValidate,
  useInputValidations,
  Validate
} from 'utils/useRegularInput'
import { useFormContext } from './FormContext'
import { formatDate } from 'utils/date'
import { defaultType } from 'types/form'

type BaseProps = {
  name: string
}
type OriginalTextFieldProps = Parameters<typeof OriginalTextField>[0] &
  BaseProps

type SelectWithControlProps = SelectProps & FormControlOwnProps & BaseProps

export const TextField = ({
  onChange,
  type,
  ...props
}: OriginalTextFieldProps) => {
  const [{ changeValidate, ...rest }, { update }] = useRegularInput({
    name: props.name
  })
  const defaultValue = useDefaultValue(props.name)
  const [defaultDate, setDefaultDate] = useState('')

  useEffect(() => {
    if (type === 'date') {
      setDefaultDate(formatDate(Date.now()))
    }
  }, [type])

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target

    update({
      [name]:
        type === 'date'
          ? (event.target as HTMLInputElement).valueAsNumber
          : value
    })
    changeValidate(event)

    if (onChange) {
      onChange(event)
    }
  }

  return (
    <OriginalTextField
      onChange={handleChange}
      type={type}
      {...(type === 'date' && { defaultValue: defaultDate })}
      {...defaultValue}
      {...rest}
      {...props}
    />
  )
}

interface ControlErrorHelper {
  (
    props: FormControlOwnProps & Omit<Validate, 'error' | 'changeValidate'>
  ): ReactNode
}
export const ControlErrorHelper: ControlErrorHelper = ({
  error,
  helperText,
  children,
  ...props
}) => {
  return (
    <FormControl error={error} {...props}>
      {children}
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

export const Select = ({
  children,
  onChange,
  label,
  name,
  ...props
}: SelectWithControlProps) => {
  const [{ changeValidate, helperText, error, ...rest }, { update }] =
    useRegularInput({ name })
  const defaultValue = useDefaultValue(name)
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    elem: React.ReactNode
  ) => {
    const { name, value } = event.target
    update({ [name]: value })
    changeValidate(event)
    if (onChange) {
      onChange(event, elem)
    }
  }

  return (
    <FormControl variant="standard" error={error}>
      <InputLabel id="select-label">{label}</InputLabel>
      <OriginalSelect
        labelId="select-label"
        onChange={handleChange}
        label={label}
        {...defaultValue}
        {...props}
        {...rest}
      >
        {children}
      </OriginalSelect>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

type onChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean
) => void

export type CustomCheckboxProps = CheckboxProps &
  BaseProps & { labelProps: Omit<FormControlLabelProps, 'control'> }

export const CustomCheckbox = (
  { onChange, labelProps, ...props }: CustomCheckboxProps,
  control: FormControlOwnProps
) => {
  const [{ changeValidate, ...rest }, { update }] = useRegularInput({
    name: props.name
  })
  const defaultChecked = useDefaultValue(props.name, defaultType.checkbox)

  const handleChange: onChange = (event, checked) => {
    const { name } = event.target
    update({ [name]: checked })
    changeValidate(event)
    if (onChange) {
      onChange(event, checked)
    }
  }

  return (
    <ControlErrorHelper {...rest} {...control}>
      <FormControlLabel
        control={
          <Checkbox {...defaultChecked} {...props} onChange={handleChange} />
        }
        {...labelProps}
      />
    </ControlErrorHelper>
  )
}

export interface Item {
  label: ReactNode
  value: unknown
  key: string
}

interface CheckBoxGroupProps
  extends Omit<FormControlLabelProps, 'control' | 'onChange' | 'label'> {
  list: Item[]
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    ref: MutableRefObject<unknown[]>
  ) => void
  label?: ReactNode
}

export const CheckBoxGroup = ({
  list,
  onChange,
  ...props
}: CheckBoxGroupProps & BaseProps) => {
  const valueRef = useRef<unknown[]>([])
  const { update } = useFormContext()
  const processValue: onChange = (e, checked) => {
    if (onChange) {
      onChange(e, checked, valueRef)
      return
    }
    const value = list.find((i) => i.key === e.target.value)!.value

    if (checked) {
      valueRef.current.push(value)
      return
    }

    valueRef.current = valueRef.current.filter((v) => v !== value)
  }

  const handleChange: onChange = (e, checked) => {
    processValue(e, checked)
    update({ [e.target.name]: valueRef.current })
  }

  return list.map(({ label, key }, index) => (
    <FormControlLabel
      key={key || index}
      control={<Checkbox value={key || index} />}
      onChange={handleChange}
      label={label}
      {...props}
    />
  ))
}

type CustomRadioGroupProps = {
  list: Item[]
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void
} & RadioGroupProps

export const CustomRadioGroup = (
  { list, onChange, ...props }: CustomRadioGroupProps & BaseProps,
  controls?: FormControlOwnProps
) => {
  const { changeValidate, ...rest } = useInputValidate()
  const validations = useInputValidations(props.name)
  const { update } = useFormContext()

  const handleChange: CustomRadioGroupProps['onChange'] = (e, value) => {
    changeValidate(e)
    if (onChange) {
      onChange(e, value)
      return
    }
    update({ [e.target.name]: list.find(({ key }) => key === value)!.value })
  }

  return (
    <ControlErrorHelper {...rest} {...controls}>
      <RadioGroup onChange={handleChange} {...props}>
        {list.map(({ key, label }, index) => (
          <Box key={key || index}>
            <Radio {...validations} value={key || index} />
            <FormLabel>{label}</FormLabel>
          </Box>
        ))}
      </RadioGroup>
    </ControlErrorHelper>
  )
}
