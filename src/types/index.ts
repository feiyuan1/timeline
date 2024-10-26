// 0 线路 1 线路组 2 子线路 3 节点 4 记录
export type Type = 0 | 1 | 2 | 3 | 4
// 0-date 1-custom 节点类型：以时间戳或者字符串作为线路骨架
export type NodeType = 0 | 1

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
  type: 4
}

export interface LineNode extends BasicInfo {
  logs: Log[]
  key: number | string // 节点关键词，时间戳或者自定义字符串
  type: 3
}

export interface Line extends BasicInfo {
  nodeType: NodeType
  nodes: LineNode[]
  type: 0 | 2
}

export interface LineGroup extends BasicInfo {
  lines: Line[]
  type: 1
}
