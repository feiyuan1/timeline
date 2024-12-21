import { NodeType, Type } from '../constants'

export type ObjectWithString = Record<string, unknown>

export interface BasicInfo {
  id: string
  type: Type
  createTime: number
  updateTime: number
  name: string
  description?: string
}

// TODO FormLog
export interface Log extends BasicInfo {
  content: string // 记录内容
  type: Type.log
}

export interface LineNode extends BasicInfo {
  logs: Log[]
  key: number | string // 节点关键词，时间戳或者自定义字符串
  type: Type.node
}

export type FormNode = Pick<LineNode, 'key' | 'name' | 'description'>

export interface Line extends BasicInfo {
  nodeType: NodeType
  nodes: LineNode[]
  type: Type.line | Type.childLine
}

export type FormLine = Pick<Line, 'nodeType' | 'name' | 'description'>

export interface LineGroup extends BasicInfo {
  lines: Line[]
  type: Type.lineGroup
}

export type FormGroup = Pick<LineGroup, 'name' | 'description'>
