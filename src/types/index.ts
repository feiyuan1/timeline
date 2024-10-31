import { NodeType, Type } from '_constants'
export interface BasicInfo {
  id: number
  type: Type
  createTime: number
  updateTime: number
  name: string
  description: string
}

export interface Log extends BasicInfo {
  content: string // 记录内容
  type: Type.log
}

export interface LineNode extends BasicInfo {
  logs: Log[]
  key: number | string // 节点关键词，时间戳或者自定义字符串
  type: Type.node
}

export interface Line extends BasicInfo {
  nodeType: NodeType
  nodes: LineNode[]
  type: Type.line | Type.childLine
}

export interface LineGroup extends BasicInfo {
  lines: Line[]
  type: Type.lineGroup
}

export type ObjectWithString = Record<string, unknown>
