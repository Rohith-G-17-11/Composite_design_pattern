import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Layers, Sigma } from "lucide-react";
import type { Page } from "../types";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

type Props = { onOpen: (page: Page) => void };

export default function LearnPage({ onOpen }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.section
        initial="hidden"
        animate="show"
        variants={fade}
        className="overflow-hidden rounded-3xl border border-line bg-[radial-gradient(1200px_circle_at_10%_-10%,#2f6f56_0%,transparent_42%),linear-gradient(180deg,#172038,transparent)] px-6 py-14 sm:px-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">
          Structural design pattern · Course
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-paper sm:text-6xl">
          Treat a tree of objects as one object.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
          Composite lets a Client call a single <code className="text-gold">Operation()</code> on either a
          Leaf or a whole group. This lab teaches that idea the way Refactoring Guru frames it, and
          proves it with one running example: the expression{" "}
          <span className="text-paper">5 + (10 × 2) = 25</span>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onOpen("structure")}
            className="inline-flex items-center gap-2 rounded-full bg-sage-deep px-5 py-2.5 text-sm font-medium text-paper"
          >
            See the UML structure <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => onOpen("playground")}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-mist"
          >
            Evaluate 5 + (10 × 2)
          </button>
        </div>
      </motion.section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Layers,
            t: "Intent",
            d: "Compose objects into a tree that models a part–whole hierarchy, then work with that tree through one Component interface.",
          },
          {
            icon: GitBranch,
            t: "The contract",
            d: "Component declares Operation(). Leaf implements it directly. Composite stores children and calls child.operation() on each child.",
          },
          {
            icon: Sigma,
            t: "The lab example",
            d: "Number is a Leaf. Operator is a Composite. evaluate() is Operation(). Nested operators become nested Composites.",
          },
        ].map((card) => (
          <article key={card.t} className="rounded-2xl border border-line bg-panel p-6">
            <card.icon className="text-sage" size={22} />
            <h2 className="mt-4 font-serif text-2xl">{card.t}</h2>
            <p className="mt-2 text-sm leading-7 text-mist">{card.d}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <article>
          <h2 className="font-serif text-3xl">The problem</h2>
          <p className="mt-4 leading-8 text-mist">
            Many domains are trees: files in folders, widgets in panels, products in boxes, and
            arithmetic expressions. A naive design makes the Client inspect every object: “if this is a
            number, return it; if this is an operator, walk children.” Each new node type forces another
            branch. Nesting — parentheses — becomes a special case instead of ordinary composition.
          </p>
          <p className="mt-4 leading-8 text-mist">
            For <code className="text-gold">5 + (10 * 2)</code> that means the Client would have to know
            that <code>+</code> contains a number and another operator, and that <code>*</code> contains
            two numbers. The knowledge of the tree leaks into every caller.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-ink-soft p-6 font-mono text-[13px] leading-7 text-sage">
          <p className="text-mist/70">// Without Composite — Client does the tree walking</p>
          {`function total(node) {
  if (node.type === "number") return node.value;
  if (node.type === "add") {
    return total(node.left) + total(node.right);
  }
  if (node.type === "mul") {
    return total(node.left) * total(node.right);
  }
  throw new Error("unknown node");
}`}
        </article>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <article className="order-2 rounded-2xl border border-line bg-ink-soft p-6 font-mono text-[13px] leading-7 text-gold lg:order-1">
          <p className="text-mist/70">// With Composite — Client talks only to Component</p>
          {`interface Expression {
  evaluate(): number; // Operation()
}

root.evaluate(); // 25, whether root is 5 or 5+(10*2)`}
        </article>
        <article className="order-1 lg:order-2">
          <h2 className="font-serif text-3xl">The solution</h2>
          <p className="mt-4 leading-8 text-mist">
            Declare a Component interface with the operation the Client actually wants. Give every part
            of the tree that interface. A Leaf carries out the work itself. A Composite keeps a list of
            child Components — the diamond on the UML — and implements the same operation by delegating
            to those children. Recursion is not a trick; it is the Composite’s Operation().
          </p>
          <p className="mt-4 leading-8 text-mist">
            The Client now depends on one type. Adding a new operator, or nesting operators ten levels
            deep, does not change the Client.
          </p>
        </article>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Analogy</h2>
        <p className="mt-4 max-w-3xl leading-8 text-mist">
          Refactoring Guru’s boxes-and-products picture is the same shape as our expression tree. A boxed
          gift contains products and smaller boxes. Asking “what is the total price?” is one question to
          the outer box. The box asks each child; a product answers with its price; a nested box repeats
          the question. Swap “price” for “value”, “product” for Number, “box” for Operator, and you have{" "}
          <strong className="text-paper">5 + (10 × 2)</strong>.
        </p>
      </section>

      <section className="mt-16 rounded-3xl border border-line bg-panel p-8">
        <h2 className="font-serif text-3xl">How 5 + (10 × 2) maps onto the UML</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-sage">
              <tr>
                <th className="pb-3 font-medium">UML participant</th>
                <th className="pb-3 font-medium">In this course</th>
                <th className="pb-3 font-medium">In the example</th>
              </tr>
            </thead>
            <tbody className="text-mist">
              {[
                ["Client", "Anyone holding an Expression", "UI calling evaluate()"],
                ["Component(interface)", "Expression", "evaluate()"],
                ["Leaf", "NumberExpr", "5, 10, 2"],
                ["Composite", "OperatorExpr", "+ and *"],
                ["◇ children", "children: Expression[]", "* is a child of +"],
                ["child.operation()", "child.evaluate()", "* asks 10 and 2, + asks 5 and *"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell) => (
                    <td key={cell} className="py-3 pr-4 font-mono text-[13px] text-paper/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
