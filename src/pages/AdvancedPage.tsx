import { useState } from "react";
import {
  Boxes,
  CheckCircle2,
  GitBranch,
  Layers,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AdvancedPage() {
  // Transparency vs Safety Toggle
  const [designStyle, setDesignStyle] = useState<"safe" | "transparent">("safe");

  // Memoization Simulator State
  const [leafVal, setLeafVal] = useState<number>(10);
  const [cachedVal, setCachedVal] = useState<number | null>(25);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const updateLeaf = (newVal: number) => {
    setLeafVal(newVal);
    setIsDirty(true);
  };

  const reevaluate = () => {
    setCachedVal(5 + (leafVal * 2));
    setIsDirty(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Advanced Design Engineering
      </p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Advanced Composite Pattern</h1>
      <p className="mt-4 max-w-3xl leading-8 text-mist">
        Mastering the Composite pattern involves navigating architectural trade-offs: selecting between
        transparency vs safety, implementing tree memoization/caching, and combining Composite with other
        GoF design patterns.
      </p>

      {/* 1. Transparency vs Safety Interactive Comparison */}
      <section className="mt-12 rounded-3xl border border-line bg-panel p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-gold">
              Architectural Trade-off
            </span>
            <h2 className="font-serif text-2xl text-paper">Transparency vs. Safety</h2>
          </div>

          <div className="flex rounded-full border border-line bg-ink-soft p-1 text-xs">
            <button
              type="button"
              onClick={() => setDesignStyle("safe")}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition",
                designStyle === "safe" ? "bg-sage-deep text-paper" : "text-mist hover:text-paper",
              ].join(" ")}
            >
              <ShieldCheck size={14} /> Safe Composite (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setDesignStyle("transparent")}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition",
                designStyle === "transparent" ? "bg-sage-deep text-paper" : "text-mist hover:text-paper",
              ].join(" ")}
            >
              <Zap size={14} /> Transparent Composite
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {designStyle === "safe" ? (
            <>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-sage">Safe Interface Design</h3>
                <p className="text-sm leading-7 text-mist">
                  Child-management operations (<code className="text-gold">add()</code>,{" "}
                  <code className="text-gold">remove()</code>, <code className="text-gold">getChild()</code>) are declared
                  <strong> ONLY on the Composite class</strong> (`OperatorExpr`), NOT on `Component`.
                </p>
                <div className="rounded-xl bg-ink-soft p-4 font-mono text-xs text-paper/90 leading-6">
                  {`// Component interface stays minimal & safe
interface Expression {
  evaluate(): number;
}

// Leaf has NO child methods — type-safe at compile time!
class NumberExpr implements Expression { ... }

// Composite has add/remove children methods
class OperatorExpr implements Expression {
  add(child: Expression): void;
}`}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-ink-soft p-5">
                <h4 className="font-serif text-lg text-paper">Trade-off Evaluation</h4>
                <ul className="mt-3 space-y-2 text-xs leading-6 text-mist">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-sage mt-0.5 shrink-0" />
                    <span><strong>High Safety:</strong> Impossible to accidentally call `add()` on a `NumberExpr` Leaf.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-sage mt-0.5 shrink-0" />
                    <span><strong>Compile-time checking:</strong> TypeScript/Java enforces type safety statically.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">!</span>
                    <span><strong>Slightly lower uniformity:</strong> Client must downcast to `OperatorExpr` if it wants to add children through a generic reference.</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-gold">Transparent Interface Design</h3>
                <p className="text-sm leading-7 text-mist">
                  Child-management operations are declared directly on the <strong>Component interface</strong> (`Expression`), giving total uniformity.
                </p>
                <div className="rounded-xl bg-ink-soft p-4 font-mono text-xs text-paper/90 leading-6">
                  {`// Component declares child methods for maximum uniformity
interface Expression {
  evaluate(): number;
  add(child: Expression): void; // Mandatory for all!
}

class NumberExpr implements Expression {
  add(child: Expression) {
    throw new Error("Leaf cannot have children!");
  }
}`}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-ink-soft p-5">
                <h4 className="font-serif text-lg text-paper">Trade-off Evaluation</h4>
                <ul className="mt-3 space-y-2 text-xs leading-6 text-mist">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-sage mt-0.5 shrink-0" />
                    <span><strong>Maximum Uniformity:</strong> Client treats every node identically, calling `add()` anywhere.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-coral font-bold">✕</span>
                    <span><strong>Loss of Type Safety:</strong> Calling `leaf.add()` throws a runtime exception.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. Interactive Caching & Dirty Flag Simulation */}
      <section className="mt-12 rounded-3xl border border-line bg-panel p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <Zap className="text-gold" size={24} />
          <div>
            <h2 className="font-serif text-2xl text-paper">Caching & Dirty Flag Propagation</h2>
            <p className="text-xs text-mist">
              In large expression trees, re-evaluating unchanged subtrees is wasteful. Composites cache results until a Leaf mutates!
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-ink-soft p-5">
            <h3 className="font-serif text-lg text-paper mb-3">Live Cache Simulation</h3>
            <p className="text-xs text-mist leading-6">
              Expression: <code className="text-gold">5 + (Leaf * 2)</code>
            </p>

            <div className="mt-4 space-y-3">
              <label className="block text-xs text-mist">Mutate Leaf Value (10 * 2):</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={leafVal}
                  onChange={(e) => updateLeaf(Number(e.target.value))}
                  className="w-28 rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-xs text-paper"
                />
                <button
                  type="button"
                  onClick={reevaluate}
                  disabled={!isDirty}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sage-deep px-4 py-1.5 text-xs font-semibold text-paper disabled:opacity-40"
                >
                  <RefreshCw size={14} /> Re-evaluate Root
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-line bg-ink p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-mist">Tree Cache Status:</span>
                <span className={isDirty ? "text-coral font-bold" : "text-sage font-bold"}>
                  {isDirty ? "DIRTY (Needs Recalculation)" : "CLEAN (Memoized)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist">Cached root.evaluate() result:</span>
                <span className="font-mono text-gold font-bold">{cachedVal}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-ink-soft p-5 font-mono text-xs leading-6 text-mist">
            <p className="text-sage font-semibold">// How Caching works in Composite</p>
            {`class OperatorExpr implements Expression {
  private cachedResult: number | null = null;
  private isDirty: boolean = true;

  invalidate() {
    this.isDirty = true;
    this.parent?.invalidate(); // Propagate up tree!
  }

  evaluate(): number {
    if (this.isDirty) {
      this.cachedResult = this.compute();
      this.isDirty = false;
    }
    return this.cachedResult!;
  }`}
          </div>
        </div>
      </section>

      {/* 3. Design Pattern Synergy Cards */}
      <section className="mt-12">
        <h2 className="font-serif text-3xl text-paper">GoF Pattern Synergy</h2>
        <p className="mt-2 text-sm text-mist">
          Composite is rarely used in isolation. Here is how it combines with other GoF patterns:
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: GitBranch,
              title: "Composite + Visitor",
              desc: "Add new operations (e.g. Type Checking, Optimization, CodeGen) without modifying Leaf or Composite classes.",
            },
            {
              icon: Layers,
              title: "Composite + Iterator",
              desc: "Traverse expression tree nodes (in-order, post-order, pre-order) seamlessly using standard iterators.",
            },
            {
              icon: Boxes,
              title: "Composite + Decorator",
              desc: "Wrap single expression nodes to add logging, performance timing, or validation without breaking Component contract.",
            },
            {
              icon: Zap,
              title: "Composite + Flyweight",
              desc: "Share common Leaf instances (e.g., constant numbers 0 or 1) across multiple composite subtrees to save memory.",
            },
          ].map((card) => (
            <article key={card.title} className="rounded-2xl border border-line bg-panel p-5 shadow-lg">
              <card.icon size={22} className="text-sage" />
              <h3 className="mt-3 font-serif text-lg text-paper">{card.title}</h3>
              <p className="mt-2 text-xs leading-6 text-mist">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Applicability & Checklist */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h3 className="font-serif text-2xl text-sage">When to Use Composite</h3>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-xs leading-6 text-mist">
            <li>You need to represent part-whole hierarchy trees of objects.</li>
            <li>Client code should treat composite groups and primitive leaves uniformly.</li>
            <li>You want to add new leaf or composite node types without breaking existing client code.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-coral/30 bg-panel p-6">
          <h3 className="font-serif text-2xl text-coral">When NOT to Use</h3>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-xs leading-6 text-mist">
            <li>The domain objects are flat lists or don't share a common operation.</li>
            <li>Nodes have incompatible interfaces (forcing dummy implementations).</li>
            <li>Over-generalization makes simple structures unnecessarily complex.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
