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
