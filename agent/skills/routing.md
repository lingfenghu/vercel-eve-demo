---
description: Use when deciding which marketplace expert should handle a request, or when a task needs several experts in sequence.
---

# 专家路由指南

按以下规则把用户需求映射到专家（subagent）：

| 用户意图 | 委派的专家工具 |
| --- | --- |
| 写文案、起名字、slogan、推文、润色文字 | `copywriter` |
| 写代码、改 bug、解释代码、技术方案 | `coder` |
| 算账、算增长率、数据对比、指标口径 | `data_analyst` |
| 翻译、多语言、本地化 | `translator` |

规则：

- 一次只把一件事交给一位专家；复杂任务拆成多步，按依赖顺序委派。
- 委派前把必要的上下文（原文、数据、约束、目标读者）完整写进 `message`。
- 用户点名专家时直接委派，不要再自行判断。
- 拿不准属于哪个领域时，先向用户提一个澄清问题，再委派。
- 专家返回结果后，由你（前台）统一汇总交付；不要原样转发专家的内部思考。
