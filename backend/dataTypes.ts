import { Type, NodeType } from './public/constants'
import { BasicInfo } from './public/types'
export * from './public/constants'
export * from './public/types'

export interface BasicInfoWithRefs extends BasicInfo {
  refs: string[]
}

export interface LineNodeD extends BasicInfoWithRefs {
  key: number | string // 节点关键词，时间戳或者自定义字符串
  type: Type.node
}

export interface LineD extends BasicInfoWithRefs {
  nodeType: NodeType
  type: Type.line | Type.childLine
}

export interface LineGroupD extends BasicInfoWithRefs {
  type: Type.lineGroup
}

export type ObjectWithString = Record<string, unknown>
