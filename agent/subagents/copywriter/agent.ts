import { defineAgent } from "eve";

export default defineAgent({
  description:
    "妙笔 · 文案写作专家。委派给它：广告语、公众号/社媒推文、产品文案、品牌 slogan、起名、文字润色改写等一切与「写字」相关的任务。",
  // AI Gateway 模型 ID：文案专家用 Claude，长于文字表达
  model: "openai/gpt-4o-mini",
});
