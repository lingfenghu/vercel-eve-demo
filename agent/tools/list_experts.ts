import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * 专家市场花名册。
 * 新增一位专家（agent/subagents/<name>/）后，在这里登记一条，
 * 前台顾问就能向用户介绍它。
 */
const EXPERT_CATALOG = [
  {
    toolName: "copywriter",
    name: "妙笔 · 文案写作专家",
    specialty: "广告语、公众号推文、产品文案、品牌 slogan、润色改写",
    style: "文字讲究、富有感染力",
  },
  {
    toolName: "coder",
    name: "键盘侠 · 编程专家",
    specialty: "写代码、Code Review、调试排错、架构讲解（TypeScript/Python/Go 等）",
    style: "严谨务实、代码即文档",
    gear: "独占 Vercel Sandbox 隔离环境，可真实运行 Node.js/Python 代码验证后再交付",
  },
  {
    toolName: "data_analyst",
    name: "算盘 · 数据分析专家",
    specialty: "指标计算、数据解读、对比分析、用数字说话",
    style: "精确到小数点，绝不含糊",
  },
  {
    toolName: "translator",
    name: "信使 · 翻译专家",
    specialty: "中英互译、多语种翻译、本地化润色、术语统一",
    style: "信、达、雅",
  },
] as const;

export default defineTool({
  description:
    "List the experts available in the marketplace: their names, specialties, and the subagent tool used to hire them. Call this when the user asks what experts are available or what the marketplace can do.",
  inputSchema: z.object({}),
  label: {
    start: () => "Browse the expert marketplace",
  },
  async execute() {
    return {
      experts: EXPERT_CATALOG,
      hint: "Delegate to an expert by calling the subagent tool named in toolName.",
    };
  },
});
