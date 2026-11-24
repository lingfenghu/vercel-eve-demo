import { defineAgent } from "eve";

// 所有 agent 的模型字符串都是 Vercel AI Gateway 的模型 ID（"provider/model" 格式），
// 400+ 模型统一出口、自动故障转移，换模型只需改这一行。
// 前台顾问负责路由与汇总，用快速模型；各位专家在各自 agent.ts 里可配不同模型。
export default defineAgent({
  model: "alibaba/qwen3.7-flash",
  reasoning: "medium",
});
