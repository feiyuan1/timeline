import { useEffect, useState } from 'react'
import OriginalTextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import OriginalSelect, {
  SelectChangeEvent,
  SelectProps
} from '@mui/material/Select'
import FormControl, { FormControlOwnProps } from '@mui/material/FormControl'
import FormControlLabel, {
  FormControlLabelProps
} from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
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

export const CheckBox = ({
  onChange,
  ...props
}: Omit<FormControlLabelProps, 'control'> & BaseProps) => {
  // @ts-expect-error TODO returnType
  const [{ defaultValue }, { update }] = useRegularInput(props)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
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
