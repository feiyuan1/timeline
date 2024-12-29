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
  Log,
  FormLog
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

export const logStruct = function (data: FormLog): Log {
  const now = Date.now()

  return {
    createTime: now,
    id: String(now),
    type: Type.log,
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
