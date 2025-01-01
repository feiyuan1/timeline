import { Contents, Line, LineNode, Log } from './dataTypes'

export * from './public/utils/log'
export * from './public/utils/index'

type Source<T extends object> = {
  [key in keyof T]?: string
}

type Rule<T extends object> = {
  [key in findNonString<T>]: (v: string) => T[key]
}

type findNonString<
  T extends object,
  U extends keyof T = keyof T
> = U extends keyof T
  ? T[U] extends string
    ? string extends T[U]
      ? never
      : U
    : U
  : never

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

type omitGeneral<T extends Contents> = Omit<T, 'createTime' | 'updateTime'>

const generalRule = {
  type: Number
}

const lineRule = {
  ...generalRule,
  nodeType: Number
}

const nodeRule = {
  ...generalRule,
  key: Number // TODO 是否将 nodeType 补充到 LineNode 上
}

export const formatLine = (line: Partial<Record<keyof Line, string>>) =>
  format<Omit<omitGeneral<Line>, 'nodes'>>(line, lineRule)

export const formatNode = (node: Partial<Record<keyof LineNode, string>>) =>
  format<Omit<omitGeneral<LineNode>, 'logs'>>(node, nodeRule)

export const formatLog = (node: Partial<Record<keyof LineNode, string>>) =>
  format<omitGeneral<Log>>(node, generalRule)

export const diffRefs = <T>(olds: T[], news: T[]): [T[], T[]] => {
  if (!olds.length || !news.length) {
    return [olds, news]
  }

  const dels = olds.filter((item) => !news.includes(item))
  const adds = news.filter((item) => !olds.includes(item))

  return [dels, adds]
}

/**
 * 目的：从 data 中挑选出用户可更改的字段，避免非预期的更新其他字段
 */
export const pick = <T extends object, K extends keyof T>(
  data: T,
  keys: K[]
): Partial<Pick<T, K>> => {
  const result: Partial<Pick<T, K>> = {}

  return keys.reduce((result, key) => {
    if (data[key] != null) {
      result[key] = data[key]
    }
    return result
  }, result)
}
