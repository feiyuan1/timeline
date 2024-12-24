import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import OriginalTextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import OriginalSelect, {
  SelectChangeEvent,
  SelectProps
} from '@mui/material/Select'
import FormControl, { FormControlOwnProps } from '@mui/material/FormControl'
import FormControlLabel, {
  FormControlLabelProps
} from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import useRegularInput from 'utils/useRegularInput'
import { formatDate } from 'utils/date'

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
  const [{ onChange: changeValidate, ...rest }, { update }] =
    useRegularInput(props)
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
      {...rest}
      {...props}
    />
  )
}

export const Select = ({
  children,
  onChange,
  label,
  ...props
}: SelectWithControlProps) => {
  // @ts-expect-error TODO returnType
  const [{ defaultValue }, { update }] = useRegularInput(props)
  const handleChange = (
    event: SelectChangeEvent<unknown>,
    elem: React.ReactNode
  ) => {
    const { name, value } = event.target
    update({ [name]: value })
    if (onChange) {
      onChange(event, elem)
    }
  }
  return (
    <FormControl variant="standard">
      <InputLabel id="select-label">{label}</InputLabel>
      <OriginalSelect
        labelId="select-label"
        onChange={handleChange}
        label={label}
        defaultValue={defaultValue}
        {...props}
      >
        {children}
      </OriginalSelect>
    </FormControl>
  )
}

type onChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean
) => void

export const CheckBox = ({
  onChange,
  ...props
}: Omit<FormControlLabelProps, 'control'> & BaseProps) => {
  // @ts-expect-error TODO returnType
  const [{ defaultValue }, { update }] = useRegularInput(props)

  const handleChange: onChange = (event, checked) => {
    const { name } = event.target
    update({ [name]: checked })
    if (onChange) {
      onChange(event, checked)
    }
  }

  return (
    <FormControlLabel
      control={<Checkbox defaultChecked={defaultValue} />}
      onChange={handleChange}
      {...props}
    />
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
  const [_, { update }] = useRegularInput(props)
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
    <CheckBox
      key={key || index}
      onChange={handleChange}
      {...props}
      value={key || index}
      label={label}
    />
  ))
}

type RadioGroupProps = {
  list: Item[]
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void
} & Omit<FormControlLabelProps, 'control' | 'label' | 'onChange'>

export const CustomRadioGroup = ({
  list,
  onChange,
  ...props
}: RadioGroupProps & BaseProps) => {
  const [
    { onChange: changeValidate, variant, helperText, error, ...rest },
    { update }
  ] = useRegularInput(props)

  const handleChange: RadioGroupProps['onChange'] = (e, value) => {
    changeValidate(e)
    if (onChange) {
      onChange(e, value)
      return
    }
    update({ [e.target.name]: list.find(({ key }) => key === value)!.value })
  }

  return (
    <FormControl variant={variant} error={error}>
      <FormHelperText>{helperText}</FormHelperText>
      <RadioGroup name={props.name} onChange={handleChange}>
        {list.map(({ key, label }, index) => (
          <Box key={key || index}>
            <Radio {...rest} value={key || index} />
            <FormLabel>{label}</FormLabel>
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  )
}
