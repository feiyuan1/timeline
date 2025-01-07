# principle

最重要的原则：**不测过程，只确认结果**

## 新增组件、hook

最好与测试用例一同 commit

## review

client 端代码更新后，会重新执行代码影响到的测试用例，**出现异常，即使纠正**

## 其他

- 暂时没有 UI 上的 test cases
- 每个组件都有一个独立的测试文件（hook 同理）
- 组件的**逻辑**和**交互**都需要测试
- hook 的**逻辑**需要测试

# 框架

- jest 执行用例 + 提供断言 + 提供测试环境（比如 jsdom 模拟浏览器环境）
- @testing-library/react 补充组件断言 + 提供 react component/hook render API + 提供 user actions

# directory

- `__mocks__ // sth mock for test`
  - `apiMock // mock for fetch, 对应到 src/api directory`
  - `styleMock // mock for css files`
  - `lineList // constant data used in test cases`
- **snapshots**
- `components // test cases of components, 对应到 src/components`
- `main // test cases of main components, 对应到 src/main`
- `${Component|Hook}.test.tsx // test cases of page component or hook`
- `utils // 公用工具函数`

# 执行测试用例

`npx jest fileName`
