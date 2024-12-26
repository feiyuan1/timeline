import { FormControlOwnProps } from '@mui/material/FormControl'
import { ObjectWithString } from 'public/types'

export enum defaultType {
  normal = 'normal',
  checkbox = 'checkbox'
}

export interface ErrorInfo {
  error: FormControlOwnProps['error']
  message?: string
}

export interface Validations {
  required: boolean
}

export type CustomValidations<P extends ObjectWithString> = {
  [key in keyof P]?: {
    [Vkey in keyof Validations]?: {
      value: Validations[Vkey]
      message: ErrorInfo['message']
    }
  }
}
