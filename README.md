# vercel-eve-demo · 专家市场（Expert Marketplace）

一个用 [eve](https://eve.dev)（Vercel 的开源 agent 框架）搭建的「专家市场」demo：
一个前台顾问 agent 坐镇入口，市场里入驻多位专家 subagent，
根据用户需求（或用户点名）把任务委派给对应专家完成。

## 市场结构

```text
agent/
├── agent.ts                 # 前台顾问：模型配置（defineAgent）
├── instructions.md          # 前台顾问的人设与分诊/路由规则
├── tools/
│   └── list_experts.ts      # 工具：专家花名册（用户问"都有什么专家"时调用）
├── skills/
│   └── routing.md           # 技能：按需加载的路由指南（意图 → 专家映射）
└── subagents/               # 市场里入驻的专家们（每个目录 = 一位专家）
    ├── copywriter/          # 妙笔 · 文案写作专家（anthropic/claude-opus-5.5）
    ├── coder/               # 键盘侠 · 编程专家（anthropic/claude-opus-5.5）
    │   ├── sandbox.ts       # 独占 Vercel Sandbox 隔离执行环境
    │   └── tools/
    │       └── run_code.ts  # 在沙箱里真实运行 Node.js/Python 代码
    ├── data_analyst/        # 算盘 · 数据分析专家（openai/gpt-5.4-mini）
    │   └── tools/
    │       └── calculator.ts  # 专家专属工具（演示 subagent 的隔离性）
    └── translator/          # 信使 · 翻译专家（openai/gpt-5.4-mini）
```

每位专家由 `agent/subagents/<name>/` 下一个目录独立定义：

- `agent.ts`（必需）：`description`（供前台模型判断何时委派）+ `model`
- `instructions.md`（可选）：专家的人设与专业规范
- `tools/`（可选）：专家**专属**工具——subagent 不继承根 agent 的任何工具，
  例如只有 `data_analyst` 能用 `calculator`

## 模型：统一走 Vercel AI Gateway

所有 agent 的 `model` 字段都是 AI Gateway 模型 ID（`provider/model` 格式），
请求统一经 Gateway 路由：一个出口访问 400+ 模型、自动故障转移、按 token 统一计费。
本项目故意给不同专家配了不同模型，演示「一行切换大脑」：

| Agent | 模型 |
| --- | --- |
| 前台顾问（根 agent） | `openai/gpt-6-luna-fast` |
| 妙笔 · 文案 | `anthropic/claude-opus-5.5` |
| 键盘侠 · 编程 | `anthropic/claude-opus-5.5` |
| 算盘 · 数据 | `openai/gpt-5.4-mini` |
| 信使 · 翻译 | `openai/gpt-5.4-mini` |

**鉴权**：部署到 Vercel 后自动使用项目 OIDC 凭证，零配置。
本地开发在 `.env.local` 填入 `AI_GATEWAY_API_KEY`（到 vercel.com/~/ai-gateway 创建），
或运行 `eve link` 自动拉取项目凭证。

## 代码专家：Vercel Sandbox

`coder` 专家通过 `agent/subagents/coder/sandbox.ts` 接入
[Vercel Sandbox](https://vercel.com/docs/sandbox)：每个会话一个隔离微虚拟机，
文件在会话内持久，默认 `deny-all` 网络策略（跑模型生成的代码更安全）。

- 内置的 `bash` / `write_file` / `read_file` 工具自动跑在沙箱里
- 专属 `run_code` 工具直接执行 Node.js / Python 片段并回传结果
- 沙箱鉴权同样来自 Vercel 凭证（`eve link` 或 `VERCEL_TOKEN` 三件套）；本地没有凭证时，专家会降级为纯静态分析并在回答中说明

## 运行

> 需要 Node.js 24+。本工作区的 `.tools/node24` 已内置一份独立 Node 24：
>
> ```bash
> export PATH=/Users/lingfenghu/PycharmProjects/.tools/node24/bin:$PATH
> ```

```bash
cd vercel-eve-demo
npm run dev        # Next.js Web Chat（ http://localhost:3000 ）
# 或
npm run dev:eve    # eve dev：终端 TUI + HTTP API
```

HTTP API（`eve dev` 或部署后）：

```bash
# 创建会话
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"你们市场都有什么专家？"}'
# 用响应头里的 x-eve-session-id 挂到流上
curl http://127.0.0.1:3000/eve/v1/session/<sessionId>/stream
```

## 试试这些

- 「你们都有什么专家？」→ 前台调用 `list_experts` 展示花名册
- 「帮我写一句咖啡品牌的 slogan」→ 委派给 `copywriter`
- 「上月 950 单，这月 1200 单，增长率多少？」→ 委派给 `data_analyst`（它会用 `calculator`）
- 「把这段中文翻译成地道的英文」→ 委派给 `translator`
- 「用 TypeScript 写一个防抖函数」→ 委派给 `coder`
- 也可以点名：「让翻译专家来翻这句话」

## 如何新增一位专家

1. 新建目录 `agent/subagents/<expert_name>/`
2. 写 `agent.ts`（`description` + `model`）和 `instructions.md`
3. 在 `agent/tools/list_experts.ts` 的花名册里登记一条
4. （可选）给它自己的 `tools/`、`skills/`，与其他专家完全隔离

想给某位专家换个「大脑」？改它 `agent.ts` 里的一行 `model` 即可，
模型字符串经 Vercel AI Gateway 解析，可指向数百个模型。

## Deploy on Vercel

```bash
eve deploy
```

eve agent 就是一个普通的 Vercel 项目，`eve deploy` 原样把它发到生产：
Durable execution（Workflows）、沙箱计算、Human-in-the-loop 审批、
子代理、Evals 全部内置。详见 [eve 文档](https://eve.dev/docs)。

## 工具单元测试

工具实现放在 `agent/tools/`；单元测试统一放在根目录的 `tests/`，按源码目录组织：

```text
agent/tools/roll_dice.ts              # eve 工具定义与执行逻辑
tests/agent/tools/roll_dice.test.ts    # 对应的单元测试
```

`agent/tools/` 是 eve 的工具发现目录，测试文件放在外部，避免被当作 agent 工具加载。
当前使用 Node.js 24 内置的测试运行器，无需额外安装测试依赖：

```bash
npm test                 # 运行工具单元测试
npm run typecheck        # TypeScript 类型检查
```

丢骰子测试会固定 `Math.random()`，验证六个点数及上下边界；每个用例结束后自动恢复随机函数。
这些测试直接验证工具执行逻辑，无需启动服务或调用模型。
