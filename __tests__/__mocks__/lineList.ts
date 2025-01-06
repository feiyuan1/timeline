import { Line, LineGroup, Log } from 'types'

type ListType = [LineGroup, Line, Line, LineGroup]
export const list: ListType = [
  {
    id: '0',
    type: 1, // 0 线路 1 线路组 2 子线路 3 节点 4 记录
    createTime: 123,
    updateTime: 123,
    name: '历史',
    description: '梳理历史线',
    lines: [
      {
        id: '0',
        type: 0,
        createTime: 123,
        updateTime: 123,
        name: '西晋历史',
        description: 'default to create',
        nodeType: 0, // 0-date 1-custom
        nodes: [
          {
            id: '0',
            type: 3,
            updateTime: 123,
            createTime: 123,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          },
          {
            id: '2',
            type: 3,
            updateTime: 123,
            createTime: 123,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          },
          {
            id: '1',
            updateTime: 123,
            type: 3,
            createTime: 123,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          }
        ]
      },
      {
        id: '0',
        type: 0,
        createTime: 123,
        updateTime: 1233,
        name: '清代史',
        description: 'default to create',
        nodeType: 0, // 0-date 1-custom
        nodes: [
          {
            id: '0',
            type: 3,
            updateTime: 123,
            createTime: 123,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          }
        ]
      },
      {
        id: '0',
        type: 0,
        createTime: 123,
        updateTime: 1234,
        name: '明史',
        description: 'default to create',
        nodeType: 0, // 0-date 1-custom
        nodes: [
          {
            id: '2',
            updateTime: 123,
            createTime: 123,
            type: 3,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          },
          {
            id: '1',
            updateTime: 123,
            type: 3,
            createTime: 123,
            name: 'day1',
            description: 'start...',
            logs: [],
            key: 123 // number or string
          }
        ]
      }
    ]
  },
  {
    id: '0',
    type: 0,
    createTime: 123,
    updateTime: 123,
    name: '我的日程',
    description: 'default to create',
    nodeType: 0, // 0-date 1-custom
    nodes: [
      {
        id: '0',
        updateTime: 123,
        type: 3,
        createTime: 123,
        name: 'day1',
        description: 'start...',
        logs: [],
        key: 123 // number or string
      }
    ]
  },
  {
    id: '0',
    type: 0,
    createTime: 123,
    updateTime: 123,
    name: '无节点',
    description: 'no nodes',
    nodeType: 0,
    nodes: []
  },
  {
    id: '0',
    type: 1, // 0 线路 1 线路组 2 子线路 3 节点 4 记录
    createTime: 123,
    updateTime: 123,
    name: '其他组',
    description: '测试列表为空',
    lines: []
  }
]

export const logs: Log[] = [
  {
    createTime: 1735460819801,
    id: '1735460819801',
    type: 4,
    name: 'buzhidao',
    content: 'buzhidao',
    updateTime: 1735460819801
  },
  {
    createTime: 1735524681569,
    id: '1735524681569',
    type: 4,
    name: '2',
    content: 'bala\nba\ns',
    updateTime: 1735704405598
  },
  {
    createTime: 1735549044310,
    id: '1735549044310',
    type: 4,
    name: 'nam',
    content: 'baoalabaola\nadji',
    updateTime: 1735549044310
  },
  {
    createTime: 1735781284211,
    id: '1735781284211',
    type: 4,
    name: 'test-add',
    content: 'test-add-log-in-nodepage',
    updateTime: 1735781284211
  }
]
