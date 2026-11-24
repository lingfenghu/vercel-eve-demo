import { defineAgent } from "eve";

export default defineAgent({
  description:
    "信使 · 翻译专家。委派给它：中英互译、多语种翻译、本地化润色、术语统一与风格调整。",
  // AI Gateway 模型 ID
  model: "openai/gpt-5-mini",
});
