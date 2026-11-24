import { defineAgent } from "eve";

export default defineAgent({
  description:
    "键盘侠 · 编程专家。委派给它：编写代码、Code Review、调试排错、解释代码、技术选型与架构讲解，覆盖 TypeScript/Python/Go 等主流语言。它独占一个 Vercel Sandbox 隔离环境，可以真实运行代码验证结果。",
  // AI Gateway 模型 ID：编程专家用 Claude，长于代码
  model: "openai/gpt-4o-mini",
});
