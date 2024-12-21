import {
  FormGroup,
  FormLine,
  FormNode,
  LineD,
  LineGroupD,
  LineNodeD,
  Type,
  Code,
  ErrorStructProps,
  Line
} from '../dataTypes'

const defaultMsg: Partial<Record<Code, string>> = {
  [Code.requiredError]: 'miss required data',
  [Code.dataSourceError]: 'data assigned to wrong place'
}

export const errorStruct = function (err: ErrorStructProps | Code | string) {
  if (typeof err === 'object') {
    return err
  }

  if (typeof err === 'number') {
    return {
      code: err,
      msg: defaultMsg[err]
    }
  }

  return {
    code: Code.error,
    err
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

export const lineStruct = function (data: FormLine & Partial<LineD>): LineD {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.line,
    refs: [],
    ...data,
    updateTime: now
  }
}

type Source<T extends object> = {
  [key in keyof T]?: string
}

type Rule<T extends object> = {
  [key in findNonString<T>]: (v: string) => T[key]
}

type findNonString<
  T extends object,
  U extends keyof T = keyof T
> = U extends keyof T ? (T[U] extends string ? never : U) : never

const isOtherKey = <T extends object>(
  key: keyof T,
  rule: object
): key is findNonString<T> => {
  return key in rule
}

// 如果 rule 没有必要传，该方法没有必要被调用
export const format = <T extends object>(
  source: Source<T>,
  rule: Rule<T>
): Partial<T> => {
  const result: Partial<T> = {}
  const keys = Object.keys(source) as (keyof T)[]
  keys.forEach((key) => {
    const value = source[key]
    if (isOtherKey(key, rule)) {
      const processor = rule[key]
      result[key] = processor(value)
      return
    }
    result[key] = value as T[typeof key]
  })

  return result
}

const lineRule = {
  type: Number,
  nodeType: Number
}

export const formatLine = (line: Partial<Record<keyof Line, string>>) =>
  format<Omit<Line, 'createTime' | 'updateTime' | 'nodes'>>(line, lineRule)

export const groupStruct = function (data: FormGroup): LineGroupD {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.lineGroup,
    refs: [],
    ...data,
    updateTime: now
  }
}

export const nodeStruct = function (data: FormNode): LineNodeD {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.node,
    refs: [],
    ...data,
    updateTime: now
  }
}

export const nodeStage = {
  $lookup: {
    from: 'log',
    localField: 'refs',
    foreignField: 'id',
    as: 'logs'
  }
}

export const lineStage = {
  $lookup: {
    from: 'node',
    localField: 'refs',
    foreignField: 'id',
    as: 'nodes',
    pipeline: [nodeStage]
  }
}

export const groupStage = {
  $lookup: {
    from: 'line',
    localField: 'refs',
    foreignField: 'id',
    pipeline: [lineStage],
    as: 'lines'
  }
}
