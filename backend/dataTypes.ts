// 0 线路 1 线路组 2 子线路 3 节点 4 记录
export enum Type {
  line = 0,
  lineGroup,
  childLine,
  node,
  log
}

// 0-date 1-custom 节点类型：以时间戳或者字符串作为线路骨架
export enum NodeType {
  date = 0,
  custom
}

export interface BasicInfo {
  id: string
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

export type FormLine = Pick<Line, 'nodeType' | 'name' | 'description'>

export interface LineGroup extends BasicInfo {
  lines: Line[]
  type: Type.lineGroup
}

export type FormGroup = Pick<LineGroup, 'name' | 'description'>
export type ObjectWithString = Record<string, unknown>
