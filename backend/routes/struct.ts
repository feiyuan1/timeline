import { FormGroup, FormLine, Line, LineGroup, Type } from '../dataTypes'

enum Code {
  success = 0,
  error
}

interface ErrorStructProps {
  code?: Code
  msg: string
}
export const errorStruct = function ({
  code = Code.error,
  msg
}: ErrorStructProps) {
  return {
    code,
    msg
  }
}

export type DataStructProps<T> =
  | {
      code?: Code
      data: T | string
    }
  | string

export const dataStruct = function <T = 'string'>(struct?: DataStructProps<T>) {
  if (typeof struct === 'string' || !struct) {
    return {
      code: Code.success,
      data: struct || 'OK'
    }
  }
  const { code = Code.success, data } = struct
  return {
    code,
    data
  }
}

export const lineStruct = function (data: FormLine & Partial<Line>): Line {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.line,
    nodes: [],
    ...data,
    updateTime: now
  }
}

export const groupStruct = function (
  data: FormGroup & Partial<LineGroup>
): LineGroup {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.lineGroup,
    lines: [],
    ...data,
    updateTime: now
  }
}
