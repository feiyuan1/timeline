interface MainTab {
  key: number
  label: string
}

export const tabs: MainTab[] = [
  { label: 'line/group', key: 0 },
  { label: 'log', key: 1 }
]

export enum TabKey {
  mix = 0,
  log
}
