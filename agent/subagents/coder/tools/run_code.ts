import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * 在本专家的 Vercel Sandbox 里真实运行一段代码。
 * 代码写入沙箱文件系统后执行，返回退出码与标准输出/错误。
 */
export default defineTool({
  description:
    "Run a code snippet in this expert's isolated Vercel Sandbox (one microVM per session) and return its exit code, stdout and stderr. Use it to actually execute and verify code before delivering it, or to debug a failing snippet. Supports Node.js and Python.",
  inputSchema: z.object({
    language: z.enum(["node", "python"]).describe("Runtime to execute the code with"),
    code: z.string().min(1).describe("Complete runnable source code"),
    filename: z
      .string()
      .optional()
      .describe("Optional file name, defaults to snippet.mjs / snippet.py"),
  }),
  label: {
    start: ({ language }) => `Run ${language} code in Vercel Sandbox`,
  },
  async execute({ language, code, filename }, ctx) {
    const sandbox = await ctx.getSandbox();
    const name = filename ?? (language === "python" ? "snippet.py" : "snippet.mjs");
    await sandbox.writeTextFile({ path: name, content: code });
    const command = language === "python" ? `python3 ${name}` : `node ${name}`;
    // run() 不会因为非零退出码抛异常，由我们把结果如实带回给模型
    const result = await sandbox.run({ command });
    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  },
});
