/**
 * Composite pattern core used throughout the course.
 *
 * Component  → Expression.evaluate()
 * Leaf       → NumberExpr
 * Composite  → OperatorExpr  (calls child.evaluate() on each child)
 */

export type Operator = "+" | "-" | "*" | "/";

export interface Expression {
  readonly id: string;
  evaluate(): number;
  toInfix(): string;
}

export class NumberExpr implements Expression {
  readonly id: string;
  readonly value: number;

  constructor(id: string, value: number) {
    this.id = id;
    this.value = value;
  }

  evaluate(): number {
    return this.value;
  }

  toInfix(): string {
    return String(this.value);
  }
}

export class OperatorExpr implements Expression {
  readonly id: string;
  readonly operator: Operator;
  readonly children: Expression[];

  constructor(id: string, operator: Operator, children: Expression[]) {
    this.id = id;
    this.operator = operator;
    this.children = children;
  }

  evaluate(): number {
    if (this.children.length === 0) return 0;
    return this.children
      .slice(1)
      .reduce((acc, child) => applyOp(acc, this.operator, child.evaluate()), this.children[0].evaluate());
  }

  toInfix(): string {
    if (this.children.length === 0) return "∅";
    const inner = this.children.map((c) => c.toInfix()).join(` ${this.operator} `);
    return `(${inner})`;
  }
}

export function applyOp(left: number, op: Operator, right: number): number {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? Number.NaN : left / right;
  }
}

export type ExprNode =
  | { id: string; kind: "leaf"; value: number }
  | { id: string; kind: "composite"; operator: Operator; children: ExprNode[] };

let seq = 0;
export function nextId(prefix = "n"): string {
  seq += 1;
  return `${prefix}${seq}`;
}

export function leaf(value: number, id?: string): ExprNode {
  return { id: id ?? nextId("leaf"), kind: "leaf", value };
}

export function op(operator: Operator, children: ExprNode[], id?: string): ExprNode {
  return { id: id ?? nextId("op"), kind: "composite", operator, children };
}

/** Canonical course example: 5 + (10 * 2) = 25 */
export function classicExample(): ExprNode {
  seq = 0;
  return op("+", [leaf(5, "n5"), op("*", [leaf(10, "n10"), leaf(2, "n2")], "mul")], "add");
}

export function toExpression(node: ExprNode): Expression {
  if (node.kind === "leaf") return new NumberExpr(node.id, node.value);
  return new OperatorExpr(node.id, node.operator, node.children.map(toExpression));
}

export function evaluateNode(node: ExprNode): number {
  return toExpression(node).evaluate();
}

export function toInfix(node: ExprNode, wrapRoot = false): string {
  if (node.kind === "leaf") return String(node.value);
  const inner = node.children.map((c) => toInfix(c, true)).join(` ${node.operator} `);
  return wrapRoot ? `(${inner})` : inner;
}

export type EvalStep = {
  index: number;
  nodeId: string;
  label: string;
  detail: string;
  value: number;
  kind: "leaf" | "composite";
};

export function evaluationTrace(node: ExprNode): EvalStep[] {
  const steps: EvalStep[] = [];

  const walk = (n: ExprNode): number => {
    if (n.kind === "leaf") {
      steps.push({
        index: steps.length + 1,
        nodeId: n.id,
        label: `Leaf Number(${n.value})`,
        detail: `evaluate() returns the stored value ${n.value}. No children — this is a Leaf.`,
        value: n.value,
        kind: "leaf",
      });
      return n.value;
    }

    const values = n.children.map(walk);
    const value = values.slice(1).reduce((acc, v) => applyOp(acc, n.operator, v), values[0] ?? 0);
    const childList = values.join(` ${n.operator} `);
    steps.push({
      index: steps.length + 1,
      nodeId: n.id,
      label: `Composite Operator(${n.operator})`,
      detail: `Uses child.evaluate() on each child, then combines results: ${childList} = ${value}.`,
      value,
      kind: "composite",
    });
    return value;
  };

  walk(node);
  return steps;
}

export function countNodes(node: ExprNode): { leaves: number; composites: number } {
  if (node.kind === "leaf") return { leaves: 1, composites: 0 };
  return node.children.reduce(
    (acc, child) => {
      const c = countNodes(child);
      return { leaves: acc.leaves + c.leaves, composites: acc.composites + c.composites };
    },
    { leaves: 0, composites: 1 },
  );
}

export function findNode(node: ExprNode, id: string): ExprNode | null {
  if (node.id === id) return node;
  if (node.kind === "composite") {
    for (const child of node.children) {
      const hit = findNode(child, id);
      if (hit) return hit;
    }
  }
  return null;
}

export function mapNode(node: ExprNode, id: string, fn: (n: ExprNode) => ExprNode): ExprNode {
  if (node.id === id) return fn(node);
  if (node.kind === "leaf") return node;
  return { ...node, children: node.children.map((c) => mapNode(c, id, fn)) };
}

export function addChild(root: ExprNode, parentId: string, child: ExprNode): ExprNode {
  return mapNode(root, parentId, (n) => {
    if (n.kind !== "composite") return n;
    return { ...n, children: [...n.children, child] };
  });
}

export function removeNode(root: ExprNode, id: string): ExprNode {
  if (root.id === id) return root;
  if (root.kind === "leaf") return root;
  return {
    ...root,
    children: root.children.filter((c) => c.id !== id).map((c) => removeNode(c, id)),
  };
}

// ==================== INFIX PARSER ====================

type Token =
  | { type: "num"; val: number }
  | { type: "op"; op: Operator }
  | { type: "lparen" }
  | { type: "rparen" };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let numStr = "";
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: "num", val: parseFloat(numStr) });
      continue;
    }
    if (["+", "-", "*", "/"].includes(ch)) {
      tokens.push({ type: "op", op: ch as Operator });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    throw new Error(`Unexpected character '${ch}' at index ${i}`);
  }
  return tokens;
}

export function parseExpression(input: string): ExprNode {
  const tokens = tokenize(input);
  let index = 0;

  function parseExpr(): ExprNode {
    let left = parseTerm();
    while (index < tokens.length) {
      const tok = tokens[index];
      if (tok.type === "op" && (tok.op === "+" || tok.op === "-")) {
        index++;
        const right = parseTerm();
        left = op(tok.op, [left, right]);
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm(): ExprNode {
    let left = parseFactor();
    while (index < tokens.length) {
      const tok = tokens[index];
      if (tok.type === "op" && (tok.op === "*" || tok.op === "/")) {
        index++;
        const right = parseFactor();
        left = op(tok.op, [left, right]);
      } else {
        break;
      }
    }
    return left;
  }

  function parseFactor(): ExprNode {
    if (index >= tokens.length) {
      throw new Error("Unexpected end of expression");
    }
    const tok = tokens[index];
    if (tok.type === "num") {
      index++;
      return leaf(tok.val);
    }
    if (tok.type === "lparen") {
      index++;
      const node = parseExpr();
      if (index >= tokens.length || tokens[index].type !== "rparen") {
        throw new Error("Missing closing parenthesis ')'");
      }
      index++;
      return node;
    }
    if (tok.type === "op" && tok.op === "-") {
      index++;
      const val = parseFactor();
      return op("*", [leaf(-1), val]);
    }
    throw new Error(`Unexpected token at position ${index}`);
  }

  const res = parseExpr();
  if (index < tokens.length) {
    throw new Error(`Unexpected trailing characters near token '${JSON.stringify(tokens[index])}'`);
  }
  return res;
}

// ==================== MULTI-LANGUAGE CODE GENERATOR ====================

export function generateCode(
  node: ExprNode,
  lang: "typescript" | "java" | "csharp" | "python" = "typescript",
): string {
  const declarations: string[] = [];

  function walk(n: ExprNode): string {
    if (n.kind === "leaf") {
      const name = `leaf_${n.value < 0 ? "neg_" + Math.abs(n.value) : n.value}_${n.id}`;
      if (lang === "typescript") {
        declarations.push(`const ${name}: Expression = new NumberExpr(${n.value});`);
      } else if (lang === "java") {
        declarations.push(`Expression ${name} = new NumberExpr(${n.value});`);
      } else if (lang === "csharp") {
        declarations.push(`var ${name} = new NumberExpr(${n.value});`);
      } else if (lang === "python") {
        declarations.push(`${name} = NumberExpr(${n.value})`);
      }
      return name;
    }

    const childVars = n.children.map(walk);
    const varName = `op_${n.operator === "+" ? "add" : n.operator === "-" ? "sub" : n.operator === "*" ? "mul" : "div"}_${n.id}`;

    if (lang === "typescript") {
      declarations.push(
        `const ${varName}: Expression = new OperatorExpr("${n.operator}", [${childVars.join(", ")}]);`,
      );
    } else if (lang === "java") {
      declarations.push(
        `Expression ${varName} = new OperatorExpr("${n.operator}", Arrays.asList(${childVars.join(", ")}));`,
      );
    } else if (lang === "csharp") {
      declarations.push(
        `var ${varName} = new OperatorExpr('${n.operator}', new Expression[] { ${childVars.join(", ")} });`,
      );
    } else if (lang === "python") {
      declarations.push(`${varName} = OperatorExpr("${n.operator}", [${childVars.join(", ")}])`);
    }
    return varName;
  }

  const rootVar = walk(node);
  const comment = `// Composite Pattern Structure for: ${toInfix(node)}\n`;

  let runCode = "";
  if (lang === "typescript") {
    runCode = `\nconst result = ${rootVar}.evaluate(); // Returns ${evaluateNode(node)}`;
  } else if (lang === "java") {
    runCode = `\ndouble result = ${rootVar}.evaluate(); // Returns ${evaluateNode(node)}`;
  } else if (lang === "csharp") {
    runCode = `\ndouble result = ${rootVar}.evaluate(); // Returns ${evaluateNode(node)}`;
  } else if (lang === "python") {
    runCode = `\nresult = ${rootVar}.evaluate() # Returns ${evaluateNode(node)}`;
  }

  return comment + declarations.join("\n") + runCode;
}
