import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * 一个安全的四则运算计算器。
 * 只接受数字、+ - * / %、括号、小数点与空格，用递归下降解析求值，不使用 eval。
 */
function evaluate(expression: string): number {
  const tokens = expression.match(/\d+\.?\d*|[+\-*/%()]/g);
  if (!tokens || tokens.join("").replace(/\s/g, "") !== expression.replace(/\s/g, "")) {
    throw new Error("表达式含有不支持的字符，仅支持数字和 + - * / % ( )");
  }

  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr(): number {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      value = next() === "+" ? value + parseTerm() : value - parseTerm();
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = next();
      const rhs = parseFactor();
      if (op === "*") value *= rhs;
      else if (op === "/") {
        if (rhs === 0) throw new Error("除数不能为 0");
        value /= rhs;
      } else value %= rhs;
    }
    return value;
  }

  function parseFactor(): number {
    const token = next();
    if (token === "-") return -parseFactor();
    if (token === "(") {
      const value = parseExpr();
      if (next() !== ")") throw new Error("括号不匹配");
      return value;
    }
    const value = Number(token);
    if (Number.isNaN(value)) throw new Error(`无法解析: ${token}`);
    return value;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error("表达式格式不正确");
  return result;
}

export default defineTool({
  description:
    "Evaluate an arithmetic expression with +, -, *, /, % and parentheses. Use it for every calculation instead of mental math.",
  inputSchema: z.object({
    expression: z
      .string()
      .min(1)
      .describe("Arithmetic expression, e.g. (1200 - 950) / 950 * 100"),
  }),
  label: {
    start: ({ expression }) => `Calculate ${expression}`,
  },
  async execute({ expression }) {
    const result = evaluate(expression);
    return { expression, result };
  },
});
