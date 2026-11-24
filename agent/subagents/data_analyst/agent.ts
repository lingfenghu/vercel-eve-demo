import { defineAgent } from "eve";

export default defineAgent({
  description:
    "算盘 · 数据分析专家。委派给它：指标计算（增长率、占比、同比环比）、数据解读、多组数据对比分析、把杂乱数字整理成结论。自带 calculator 计算工具。",
  // AI Gateway 模型 ID：数据专家用轻量模型，便宜又快
  model: "openai/gpt-4o-mini",
});
