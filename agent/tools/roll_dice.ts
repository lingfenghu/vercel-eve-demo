import { defineTool } from "eve/tools";
import { z } from "zod";

// 单独导出执行逻辑，单元测试无需构造 eve 的运行上下文。
export async function rollDice() {
  return { num: Math.floor(Math.random() * 6) + 1 };
}

export default defineTool({
  description: "Roll a six-sided die and return a number from 1 to 6.",
  inputSchema: z.object({}),
  execute: rollDice,
});
