import { defineSandbox } from "eve/sandbox";
import { VercelSandbox } from "eve/sandbox/vercel";

// 键盘侠专家独占的 Vercel Sandbox：每个会话一个隔离微虚拟机，
// 内置 bash / read_file / write_file 工具和 run_code 工具都跑在里面。
//
// 鉴权（eve 按顺序解析，部署到 Vercel 后自动具备，无需配置）：
//   1. VERCEL_OIDC_TOKEN（推荐本地运行 `eve link` 自动拉取）
//   2. 或手动设置 VERCEL_TOKEN + VERCEL_TEAM_ID + VERCEL_PROJECT_ID
export const environment = VercelSandbox.environment({
  // 可选：构建期准备，每个会话沙箱都从该快照启动。
  // 例如预装依赖：
  // prepare: async (sandbox) => {
  //   await sandbox.run({ command: "npm install -g tsx" });
  // },
});

export default defineSandbox(() =>
  environment.open({
    // 执行模型生成的代码，默认收紧网络出口；需要装包时可放开指定域名：
    // networkPolicy: { allow: { "registry.npmjs.org": [] } },
    networkPolicy: "deny-all",
    resources: { vcpus: 2 },
  }),
);
