import { useState } from "react";
import { Check, Code2, Copy, Play, Terminal } from "lucide-react";
import { NumberExpr, OperatorExpr, type Operator } from "../pattern/expression";

type Lang = "typescript" | "java" | "csharp" | "python" | "cpp";

const codeSnippets: Record<Lang, { title: string; component: string; leaf: string; composite: string; client: string }> = {
  typescript: {
    title: "TypeScript / JavaScript",
    component: `// 1. Component (Interface) — defines the Operation() contract
export interface Expression {
  evaluate(): number;
  toInfix(): string;
}`,
    leaf: `// 2. Leaf — primitive object with no children
export class NumberExpr implements Expression {
  constructor(private value: number) {}

  evaluate(): number {
    return this.value; // Operation() returns local value
  }

  toInfix(): string {
    return String(this.value);
  }
}`,
    composite: `// 3. Composite — aggregates child Components (the ◇ diamond)
export class OperatorExpr implements Expression {
  constructor(
    private operator: "+" | "-" | "*" | "/",
    private children: Expression[] // Aggregates Component interfaces
  ) {}

  evaluate(): number {
    if (this.children.length === 0) return 0;
    const [first, ...rest] = this.children;
    // Uses child.operation() on each child!
    return rest.reduce((acc, child) => {
      const value = child.evaluate(); // Recursive delegation
      switch (this.operator) {
        case "+": return acc + value;
        case "-": return acc - value;
        case "*": return acc * value;
        case "/": return acc / value;
      }
    }, first.evaluate());
  }

  toInfix(): string {
    const inner = this.children.map(c => c.toInfix()).join(\` \${this.operator} \`);
    return \`(\${inner})\`;
  }
}`,
    client: `// 4. Client — interacts ONLY through Component interface
const ten = new NumberExpr(10);
const two = new NumberExpr(2);
const mul = new OperatorExpr("*", [ten, two]); // (10 * 2) = 20

const five = new NumberExpr(5);
const root: Expression = new OperatorExpr("+", [five, mul]); // 5 + (10 * 2)

console.log(root.toInfix());  // "(5 + (10 * 2))"
console.log(root.evaluate()); // 25`,
  },

  java: {
    title: "Java",
    component: `// 1. Component Interface
public interface Expression {
    double evaluate();
    String toInfix();
}`,
    leaf: `// 2. Leaf Implementation
public class NumberExpr implements Expression {
    private final double value;

    public NumberExpr(double value) {
        this.value = value;
    }

    @Override
    public double evaluate() {
        return this.value;
    }

    @Override
    public String toInfix() {
        return String.valueOf(this.value);
    }
}`,
    composite: `// 3. Composite Implementation
import java.util.List;

public class OperatorExpr implements Expression {
    private final char operator;
    private final List<Expression> children; // Aggregates Component

    public OperatorExpr(char operator, List<Expression> children) {
        this.operator = operator;
        this.children = children;
    }

    @Override
    public double evaluate() {
        if (children.isEmpty()) return 0;
        double acc = children.get(0).evaluate(); // child.evaluate()
        for (int i = 1; i < children.size(); i++) {
            double val = children.get(i).evaluate();
            switch (operator) {
                case '+': acc += val; break;
                case '-': acc -= val; break;
                case '*': acc *= val; break;
                case '/': acc /= val; break;
            }
        }
        return acc;
    }

    @Override
    public String toInfix() {
        StringBuilder sb = new StringBuilder("(");
        for (int i = 0; i < children.size(); i++) {
            if (i > 0) sb.append(" ").append(operator).append(" ");
            sb.append(children.get(i).toInfix());
        }
        return sb.append(")").toString();
    }
}`,
    client: `// 4. Client Code
public class Main {
    public static void main(String[] args) {
        Expression ten = new NumberExpr(10);
        Expression two = new NumberExpr(2);
        Expression mul = new OperatorExpr('*', List.of(ten, two));

        Expression five = new NumberExpr(5);
        Expression root = new OperatorExpr('+', List.of(five, mul));

        System.out.println(root.toInfix());  // (5 + (10 * 2))
        System.out.println(root.evaluate()); // 25.0
    }
}`,
  },

  csharp: {
    title: "C#",
    component: `// 1. Component Interface
public interface IExpression {
    double Evaluate();
    string ToInfix();
}`,
    leaf: `// 2. Leaf Implementation
public class NumberExpr : IExpression {
    private readonly double _value;

    public NumberExpr(double value) => _value = value;

    public double Evaluate() => _value;
    public string ToInfix() => _value.ToString();
}`,
    composite: `// 3. Composite Implementation
public class OperatorExpr : IExpression {
    private readonly char _operator;
    private readonly IEnumerable<IExpression> _children;

    public OperatorExpr(char op, IEnumerable<IExpression> children) {
        _operator = op;
        _children = children;
    }

    public double Evaluate() {
        using var enumerator = _children.GetEnumerator();
        if (!enumerator.MoveNext()) return 0;
        double acc = enumerator.Current.Evaluate();
        while (enumerator.MoveNext()) {
            double val = enumerator.Current.Evaluate();
            acc = _operator switch {
                '+' => acc + val,
                '-' => acc - val,
                '*' => acc * val,
                '/' => acc / val,
                _ => acc
            };
        }
        return acc;
    }

    public string ToInfix() => $"({string.Join($" {_operator} ", _children.Select(c => c.ToInfix()))})";
}`,
    client: `// 4. Client Execution
var ten = new NumberExpr(10);
var two = new NumberExpr(2);
var mul = new OperatorExpr('*', new IExpression[] { ten, two });

var five = new NumberExpr(5);
IExpression root = new OperatorExpr('+', new IExpression[] { five, mul });

Console.WriteLine(root.ToInfix());  // (5 + (10 * 2))
Console.WriteLine(root.Evaluate()); // 25`,
  },

  python: {
    title: "Python 3",
    component: `from abc import ABC, abstractmethod

# 1. Component Interface
class Expression(ABC):
    @abstractmethod
    def evaluate(self) -> float:
        pass

    @abstractmethod
    def to_infix(self) -> str:
        pass`,
    leaf: `# 2. Leaf Implementation
class NumberExpr(Expression):
    def __init__(self, value: float):
        self.value = value

    def evaluate(self) -> float:
        return self.value

    def to_infix(self) -> str:
        return str(self.value)`,
    composite: `# 3. Composite Implementation
class OperatorExpr(Expression):
    def __init__(self, operator: str, children: list[Expression]):
        self.operator = operator
        self.children = children  # Aggregates Component

    def evaluate(self) -> float:
        if not self.children:
            return 0.0
        acc = self.children[0].evaluate()
        for child in self.children[1:]:
            val = child.evaluate()
            if self.operator == "+": acc += val
            elif self.operator == "-": acc -= val
            elif self.operator == "*": acc *= val
            elif self.operator == "/": acc /= val
        return acc

    def to_infix(self) -> str:
        inner = f" {self.operator} ".join(c.to_infix() for c in self.children)
        return f"({inner})"` ,
    client: `# 4. Client Code
ten = NumberExpr(10)
two = NumberExpr(2)
mul = OperatorExpr("*", [ten, two])

five = NumberExpr(5)
root: Expression = OperatorExpr("+", [five, mul])

print(root.to_infix())  # (5 + (10 * 2))
print(root.evaluate()) # 25.0`,
  },

  cpp: {
    title: "C++ 20",
    component: `// 1. Component Abstract Base Class
#include <iostream>
#include <vector>
#include <memory>
#include <string>

class Expression {
public:
    virtual ~Expression() = default;
    virtual double evaluate() const = 0;
    virtual std::string toInfix() const = 0;
};`,
    leaf: `// 2. Leaf Implementation
class NumberExpr : public Expression {
    double value;
public:
    explicit NumberExpr(double val) : value(val) {}
    double evaluate() const override { return value; }
    std::string toInfix() const override { return std::to_string(value); }
};`,
    composite: `// 3. Composite Implementation
class OperatorExpr : public Expression {
    char op;
    std::vector<std::shared_ptr<Expression>> children; // Aggregation
public:
    OperatorExpr(char op, std::vector<std::shared_ptr<Expression>> children)
        : op(op), children(std::move(children)) {}

    double evaluate() const override {
        if (children.empty()) return 0;
        double acc = children[0]->evaluate(); // child->evaluate()
        for (size_t i = 1; i < children.size(); ++i) {
            double val = children[i]->evaluate();
            if (op == '+') acc += val;
            else if (op == '-') acc -= val;
            else if (op == '*') acc *= val;
            else if (op == '/') acc /= val;
        }
        return acc;
    }

    std::string toInfix() const override {
        std::string res = "(";
        for (size_t i = 0; i < children.size(); ++i) {
            if (i > 0) { res += " "; res += op; res += " "; }
            res += children[i]->toInfix();
        }
        return res + ")";
    }
};`,
    client: `// 4. Client Execution
int main() {
    auto ten = std::make_shared<NumberExpr>(10);
    auto two = std::make_shared<NumberExpr>(2);
    auto mul = std::make_shared<OperatorExpr>('*', std::vector<std::shared_ptr<Expression>>{ten, two});

    auto five = std::make_shared<NumberExpr>(5);
    auto root = std::make_shared<OperatorExpr>('+', std::vector<std::shared_ptr<Expression>>{five, mul});

    std::cout << root->toInfix() << " = " << root->evaluate() << std::endl; // (5 + (10 * 2)) = 25
    return 0;
}`,
  },
};

export default function CodePage() {
  const [lang, setLang] = useState<Lang>("typescript");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Interactive Sandbox State
  const [val1, setVal1] = useState<number>(5);
  const [val2, setVal2] = useState<number>(10);
  const [val3, setVal3] = useState<number>(2);
  const [opInner, setOpInner] = useState<Operator>("*");
  const [opOuter, setOpOuter] = useState<Operator>("+");
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const activeSnippet = codeSnippets[lang];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const runSandbox = () => {
    const leaf1 = new NumberExpr("n1", val1);
    const leaf2 = new NumberExpr("n2", val2);
    const leaf3 = new NumberExpr("n3", val3);

    const inner = new OperatorExpr("opInner", opInner, [leaf2, leaf3]);
    const root = new OperatorExpr("opOuter", opOuter, [leaf1, inner]);

    const infix = root.toInfix();
    const result = root.evaluate();

    setConsoleOutput(`[COMPOSITE EXECUTION]
> root.toInfix()  => "${infix}"
> root.evaluate() => ${result}
[SUCCESS] Client evaluated the object tree without downcasting.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Implementation
      </p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Code for Composite pattern</h1>
      <p className="mt-4 max-w-3xl leading-8 text-mist">
        Study the Composite design pattern in your preferred programming language.<code className="text-gold">Component</code> interface,{" "}
        <code className="text-gold">Leaf</code> primitive, and <code className="text-gold">Composite</code> aggregation.
      </p>

      {/* Language Tab Switcher */}
      <div className="mt-8 flex flex-wrap gap-2">
        {(["typescript", "java", "csharp", "python", "cpp"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={[
              "rounded-full px-5 py-2 text-sm font-mono font-medium transition",
              lang === l ? "bg-sage-deep text-paper" : "border border-line bg-panel text-mist hover:text-paper",
            ].join(" ")}
          >
            {codeSnippets[l].title}
          </button>
        ))}
      </div>

      {/* Code Blocks Grid */}
      <div className="mt-10 grid gap-6">
        {[
          { key: "component", title: "1. Component Interface", code: activeSnippet.component, note: "Component participant" },
          { key: "leaf", title: "2. Leaf Implementation (NumberExpr)", code: activeSnippet.leaf, note: "Leaf participant (no children)" },
          { key: "composite", title: "3. Composite Implementation (OperatorExpr)", code: activeSnippet.composite, note: "Composite participant (child.evaluate() loop)" },
          { key: "client", title: "4. Client Usage", code: activeSnippet.client, note: "Client participant" },
        ].map((block) => (
          <article key={block.key} className="overflow-hidden rounded-2xl border border-line bg-panel shadow-lg">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ink-soft/80 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-sage" />
                <h2 className="font-serif text-lg text-paper">{block.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gold">{block.note}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(block.code, block.key)}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-ink px-2.5 py-1 text-xs text-mist hover:text-paper"
                >
                  {copiedSection === block.key ? <Check size={13} className="text-sage" /> : <Copy size={13} />}
                  {copiedSection === block.key ? "Copied" : "Copy"}
                </button>
              </div>
            </header>
            <pre className="overflow-x-auto bg-ink-soft p-5 font-mono text-xs leading-6 text-paper/90">
              {block.code}
            </pre>
          </article>
        ))}
      </div>

      {/* Interactive Sandbox Section */}
      <section className="mt-14 rounded-3xl border border-line bg-panel p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <Terminal className="text-sage" size={24} />
          <div>
            <h2 className="font-serif text-2xl text-paper">Interactive In-Browser execution</h2>
            <p className="text-xs text-mist">
              Instantiate real TypeScript <code className="text-gold">NumberExpr</code> and <code className="text-gold">OperatorExpr</code> classes live in your browser!
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-4 rounded-2xl border border-line bg-ink-soft p-5">
            <h3 className="font-serif text-lg text-paper">Configure Expression Graph</h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-mist mb-1">Leaf 1 (val1)</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(Number(e.target.value))}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-xs text-paper"
                />
              </div>

              <div>
                <label className="block text-xs text-mist mb-1">Outer Op</label>
                <select
                  value={opOuter}
                  onChange={(e) => setOpOuter(e.target.value as Operator)}
                  className="w-full rounded-lg border border-line bg-ink px-2 py-1.5 font-mono text-xs text-paper"
                >
                  {["+", "-", "*", "/"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-mist mb-1">Inner Op</label>
                <select
                  value={opInner}
                  onChange={(e) => setOpInner(e.target.value as Operator)}
                  className="w-full rounded-lg border border-line bg-ink px-2 py-1.5 font-mono text-xs text-paper"
                >
                  {["+", "-", "*", "/"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-mist mb-1">Leaf 2 (val2)</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(Number(e.target.value))}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-xs text-paper"
                />
              </div>
              <div>
                <label className="block text-xs text-mist mb-1">Leaf 3 (val3)</label>
                <input
                  type="number"
                  value={val3}
                  onChange={(e) => setVal3(Number(e.target.value))}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-xs text-paper"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={runSandbox}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sage-deep py-2.5 text-sm font-semibold text-paper hover:bg-sage-deep/80 transition"
            >
              <Play size={16} /> Execute root.evaluate()
            </button>
          </div>

          {/* Console Output */}
          <div className="flex flex-col rounded-2xl border border-line bg-ink p-5">
            <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
              <span className="font-mono text-xs font-semibold text-mist uppercase tracking-wider">
                Execution Console
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-sage animate-pulse" />
            </div>
            {consoleOutput ? (
              <pre className="flex-1 overflow-x-auto font-mono text-xs leading-6 text-sage">
                {consoleOutput}
              </pre>
            ) : (
              <p className="my-auto text-center font-mono text-xs text-mist/40 italic">
                Click "Execute root.evaluate()" to run the Composite pattern in real-time.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
