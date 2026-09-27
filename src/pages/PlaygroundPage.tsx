import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  ListOrdered,
  Network,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  StepForward,
  Trash2,
} from "lucide-react";
import ExpressionTree from "../components/ExpressionTree";
import {
  addChild,
  classicExample,
  countNodes,
  evaluationTrace,
  generateCode,
  leaf,
  nextId,
  op,
  parseExpression,
  removeNode,
  toInfix,
  type ExprNode,
  type Operator,
} from "../pattern/expression";

const presets: { name: string; tree: () => ExprNode; expr: string }[] = [
  { name: "5 + (10 × 2)", tree: classicExample, expr: "5 + (10 * 2)" },
  {
    name: "(1 + 2) × (3 + 4)",
    tree: () => op("*", [op("+", [leaf(1), leaf(2)]), op("+", [leaf(3), leaf(4)])]),
    expr: "(1 + 2) * (3 + 4)",
  },
  {
    name: "100 − (8 × 3)",
    tree: () => op("-", [leaf(100), op("*", [leaf(8), leaf(3)])]),
    expr: "100 - (8 * 3)",
  },
  {
    name: "(12 / 3) + (4 × 5)",
    tree: () => op("+", [op("/", [leaf(12), leaf(3)]), op("*", [leaf(4), leaf(5)])]),
    expr: "(12 / 3) + (4 * 5)",
  },
];

type ViewTab = "tree" | "code" | "trace";
type Lang = "typescript" | "java" | "csharp" | "python";

export default function PlaygroundPage() {
  const [tree, setTree] = useState<ExprNode>(() => classicExample());
  const [selected, setSelected] = useState<string | null>("add");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  // Expression input state
  const [customInput, setCustomInput] = useState("5 + (10 * 2)");
  const [parseError, setParseError] = useState<string | null>(null);

  // Tree manipulation state
  const [numberInput, setNumberInput] = useState("4");
  const [newOp, setNewOp] = useState<Operator>("+");

  // Code view state
  const [viewTab, setViewTab] = useState<ViewTab>("tree");
  const [codeLang, setCodeLang] = useState<Lang>("typescript");
  const [copied, setCopied] = useState(false);

  const steps = useMemo(() => evaluationTrace(tree), [tree]);
  const infix = useMemo(() => toInfix(tree), [tree]);
  const counts = useMemo(() => countNodes(tree), [tree]);
  const current = step >= 0 ? steps[step] : undefined;

  const activeIds = useMemo(
    () => new Set(steps.slice(0, step + 1).map((s) => s.nodeId)),
    [steps, step],
  );

  const evalMap = useMemo(() => {
    if (step < 0) return undefined;
    const map: Record<string, number> = {};
    for (let i = 0; i <= step && i < steps.length; i++) {
      map[steps[i].nodeId] = steps[i].value;
    }
    return map;
  }, [steps, step]);

  const result = steps.at(-1)?.value;

  const resetWalk = () => {
    setPlaying(false);
    setStep(-1);
  };

  const loadPreset = (p: (typeof presets)[0]) => {
    const next = p.tree();
    setTree(next);
    setSelected(next.id);
    setCustomInput(p.expr);
    setParseError(null);
    resetWalk();
  };

  const handleParseCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    try {
      const parsed = parseExpression(customInput);
      setTree(parsed);
      setSelected(parsed.id);
      setParseError(null);
      resetWalk();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid expression";
      setParseError(msg);
    }
  };

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((s) => s + 1), 850);
    return () => window.clearTimeout(timer);
  }, [playing, step, steps.length]);

  const tick = () => {
    setPlaying(false);
    setStep((s) => (s >= steps.length - 1 ? s : s + 1));
  };

  const findSelectedNode = (n: ExprNode): ExprNode | null => {
    if (n.id === selected) return n;
    if (n.kind === "composite") {
      for (const c of n.children) {
        const hit = findSelectedNode(c);
        if (hit) return hit;
      }
    }
    return null;
  };

  const selectedNode = selected ? findSelectedNode(tree) : null;
  const selectedIsComposite = selectedNode?.kind === "composite";

  const generatedSnippet = useMemo(
    () => generateCode(tree, codeLang),
    [tree, codeLang],
  );

  const copyCode = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Interactive Workbench
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Expression Playground</h1>
        </div>

        {/* View mode switcher */}
        <div className="flex rounded-full border border-line bg-panel p-1 text-sm">
          <button
            type="button"
            onClick={() => setViewTab("tree")}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
              viewTab === "tree" ? "bg-sage-deep text-paper" : "text-mist hover:text-paper",
            ].join(" ")}
          >
            <Network size={15} /> Tree View
          </button>
          <button
            type="button"
            onClick={() => setViewTab("code")}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
              viewTab === "code" ? "bg-sage-deep text-paper" : "text-mist hover:text-paper",
            ].join(" ")}
          >
            <Code2 size={15} /> Code View
          </button>
          <button
            type="button"
            onClick={() => setViewTab("trace")}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition",
              viewTab === "trace" ? "bg-sage-deep text-paper" : "text-mist hover:text-paper",
            ].join(" ")}
          >
            <ListOrdered size={15} /> Trace Steps
          </button>
        </div>
      </div>

      <p className="mt-4 max-w-3xl leading-8 text-mist">
        The Client holds the root <code className="text-gold">Expression</code> component and calls{" "}
        <code className="text-gold">evaluate()</code>. Type any math expression below or click a
        preset to build the Composite pattern object graph!
      </p>

      {/* Expression input bar */}
      <form onSubmit={handleParseCustom} className="mt-6 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setParseError(null);
            }}
            placeholder="e.g. 5 + (10 * 2) or (15 - 3) / 4"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-2.5 font-mono text-sm text-paper placeholder-mist/40 focus:border-sage focus:outline-none"
          />
          {parseError && (
            <p className="mt-1 text-xs text-coral font-sans">{parseError}</p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-sage-deep px-5 py-2.5 text-sm font-medium text-paper hover:bg-sage-deep/80 transition"
        >
          <Sparkles size={16} /> Parse Expression
        </button>
      </form>

      {/* Preset pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-mist/60 font-medium mr-1">
          Presets:
        </span>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => loadPreset(p)}
            className="rounded-full border border-line bg-ink-soft px-3.5 py-1 text-xs text-mist hover:border-sage hover:text-paper transition"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        {/* Main interactive panel */}
        <div className="rounded-2xl border border-line bg-panel p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
            <div>
              <p className="font-mono text-xl font-medium text-gold">{infix}</p>
              <p className="mt-1 text-xs text-mist">
                {counts.leaves} Leaves (Number) · {counts.composites} Composites (Operator)
                {result != null ? ` · Final evaluate() = ${result}` : ""}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (playing) {
                    setPlaying(false);
                    return;
                  }
                  if (step >= steps.length - 1) setStep(-1);
                  setPlaying(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-sage-deep px-4 py-2 text-xs font-semibold text-paper hover:bg-sage-deep/80"
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? "Pause" : "Play evaluate()"}
              </button>
              <button
                type="button"
                onClick={tick}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs text-mist hover:text-paper"
              >
                <StepForward size={14} /> Step
              </button>
              <button
                type="button"
                onClick={resetWalk}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs text-mist hover:text-paper"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* View Tab Contents */}
          {viewTab === "tree" && (
            <div className="min-h-[360px] flex items-center justify-center">
              <ExpressionTree
                node={tree}
                activeIds={activeIds}
                evalMap={evalMap}
                selectedId={selected}
                onSelect={setSelected}
              />
            </div>
          )}

          {viewTab === "code" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  {(["typescript", "java", "csharp", "python"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setCodeLang(l)}
                      className={[
                        "rounded-lg px-3 py-1 text-xs font-mono transition uppercase",
                        codeLang === l ? "bg-sage-deep text-paper" : "bg-ink-soft text-mist hover:text-paper",
                      ].join(" ")}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-paper"
                >
                  {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-ink-soft p-4 font-mono text-xs leading-6 text-paper/90 max-h-[380px]">
                {generatedSnippet}
              </pre>
            </div>
          )}

          {viewTab === "trace" && (
            <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {steps.map((st, i) => {
                const isActive = step === i;
                const isPassed = step > i;
                return (
                  <div
                    key={`${st.nodeId}-${i}`}
                    className={[
                      "rounded-xl border p-3 font-mono text-xs transition",
                      isActive
                        ? "border-gold bg-gold/10 text-paper"
                        : isPassed
                          ? "border-sage/40 bg-sage/5 text-mist"
                          : "border-line/40 bg-ink-soft/40 text-mist/60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>
                        Step {st.index}: {st.label}
                      </span>
                      <span className="text-gold font-bold">return {st.value}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs opacity-90">{st.detail}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6">
          {/* Step Detail Card */}
          <div className="rounded-2xl border border-line bg-ink-soft p-5">
            <h2 className="font-serif text-xl text-paper">Evaluation Step Trace</h2>
            {current ? (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gold">
                  <span>
                    Step {current.index} / {steps.length}
                  </span>
                  <span className="rounded bg-gold/20 px-2 py-0.5">{current.kind}</span>
                </div>
                <p className="mt-2 font-medium text-paper text-sm">{current.label}</p>
                <p className="mt-2 text-xs leading-6 text-mist">{current.detail}</p>
                <div className="mt-3 rounded-lg bg-ink p-2.5 text-center font-mono text-xl font-bold text-sage">
                  Returns: {current.value}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs leading-6 text-mist">
                Click <strong>Play evaluate()</strong> or <strong>Step</strong> to watch the depth-first execution walk through each Leaf and Composite node.
              </p>
            )}
          </div>

          {/* Dynamic Tree Editor */}
          <div className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-serif text-xl text-paper">Node Controls</h2>
            <p className="mt-1 text-xs leading-5 text-mist">
              Select a node in the tree diagram to add children or modify it.
            </p>

            {selectedNode ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-ink-soft p-3 text-xs">
                  <span className="text-mist">Selected Node ID: </span>
                  <code className="text-gold">{selectedNode.id}</code>
                  <br />
                  <span className="text-mist">Type: </span>
                  <span className="font-semibold text-paper capitalize">
                    {selectedNode.kind} ({selectedNode.kind === "leaf" ? selectedNode.value : selectedNode.operator})
                  </span>
                </div>

                {/* Leaf adding */}
                {selectedIsComposite ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={numberInput}
                        onChange={(e) => setNumberInput(e.target.value)}
                        className="w-20 rounded-lg border border-line bg-ink px-2.5 py-1.5 font-mono text-xs text-paper"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!selected) return;
                          const val = Number(numberInput);
                          if (Number.isNaN(val)) return;
                          setTree((t) => addChild(t, selected, leaf(val)));
                          resetWalk();
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky/20 px-3 py-1.5 text-xs font-semibold text-sky hover:bg-sky/30"
                      >
                        <Plus size={14} /> Add Leaf
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={newOp}
                        onChange={(e) => setNewOp(e.target.value as Operator)}
                        className="rounded-lg border border-line bg-ink px-2.5 py-1.5 font-mono text-xs text-paper"
                      >
                        {["+", "-", "*", "/"].map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selected) return;
                          setTree((t) =>
                            addChild(t, selected, op(newOp, [leaf(1), leaf(1)], nextId("op"))),
                          );
                          resetWalk();
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-sage/20 px-3 py-1.5 text-xs font-semibold text-sage hover:bg-sage/30"
                      >
                        <Plus size={14} /> Add Composite
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs italic text-mist/70">
                    Leaves cannot hold child components (no diamond in UML). Select a Composite node to add children.
                  </p>
                )}

                {/* Delete node */}
                {selected !== tree.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!selected) return;
                      setTree((t) => removeNode(t, selected));
                      setSelected(tree.id);
                      resetWalk();
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-coral/40 bg-coral/10 px-3 py-2 text-xs font-medium text-coral hover:bg-coral/20"
                  >
                    <Trash2 size={14} /> Delete Selected Node
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-mist/60 italic">
                Click any node on the tree diagram to inspect or modify it.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
