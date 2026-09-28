import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export type UmlPart = "client" | "component" | "leaf" | "composite" | "note" | "link";

const copy: Record<UmlPart, { title: string; body: string }> = {
  client: {
    title: "Client",
    body: "Works only with the Component interface. It never asks “are you a Leaf or a Composite?” — it just calls Operation() / evaluate().",
  },
  component: {
    title: "Component (interface)",
    body: "Declares the contract every node in the tree must honour. Here that contract is Operation(), which we implement as evaluate(). Both Number (Leaf) and Operator (Composite) implement it.",
  },
  leaf: {
    title: "Leaf",
    body: "A primitive object with no children. Operation() is done entirely inside the Leaf. In the arithmetic tree a Leaf is a Number such as 5, 10, or 2.",
  },
  composite: {
    title: "Composite",
    body: "Stores child Components (the ◇ aggregation) and implements Operation() by calling child.operation() on each child, then combining the results. An Operator such as + or * is a Composite.",
  },
  note: {
    title: "Delegation note",
    body: "This is the entire pattern in one sentence: Composite.Operation() uses child.operation() on each child. Recursion bottoms out when a child is a Leaf.",
  },
  link: {
    title: "Aggregation of Component",
    body: "The hollow diamond is aggregation: Composite has-a list of Component. Because those children are typed as Component, a child may be a Leaf or another Composite — that is what makes nested expressions like 5 + (10 * 2) possible.",
  },
};

function HeaderBar({
  x,
  y,
  w,
  label,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  active: boolean;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={32} fill={active ? "#7fbfa3" : "#b7e0cd"} />
      <text
        x={x + w / 2}
        y={y + 21}
        textAnchor="middle"
        fontFamily="Outfit, sans-serif"
        fontSize="13.5"
        fontWeight="600"
        fill="#163227"
      >
        {label}
      </text>
    </>
  );
}

export default function UmlDiagram() {
  const [active, setActive] = useState<UmlPart>("component");
  const info = useMemo(() => copy[active], [active]);

  const stroke = "#1b2438";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <div className="overflow-x-auto rounded-2xl border border-line bg-[#ece7dc] p-3 sm:p-5">
        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-[0.16em] text-[#5c6578]">
          Click a box to see in detail
        </p>
        <svg
          viewBox="0 0 920 420"
          className="h-auto w-full min-w-[640px]"
          role="img"
          aria-label="Composite pattern UML: Client, Component interface, Leaf, Composite, and child.operation note"
        >
          {/* Client → Component */}
          <line x1="168" y1="64" x2="248" y2="64" stroke={stroke} strokeWidth="2.4" />
          <polygon points="248,58 264,64 248,70" fill={stroke} />

          {/* Inheritance from children up to Component */}
          <line x1="455" y1="118" x2="455" y2="176" stroke={stroke} strokeWidth="2.4" />
          <line x1="250" y1="176" x2="660" y2="176" stroke={stroke} strokeWidth="2.4" />
          <line x1="250" y1="176" x2="250" y2="218" stroke={stroke} strokeWidth="2.4" />
          <line x1="660" y1="176" x2="660" y2="218" stroke={stroke} strokeWidth="2.4" />
          <polygon points="449,118 455,102 461,118" fill="#ece7dc" stroke={stroke} strokeWidth="2.4" />

          {/* Composite aggregation loop back to Component */}
          <line
            x1="790"
            y1="270"
            x2="860"
            y2="270"
            stroke={stroke}
            strokeWidth="2.4"
            className="cursor-pointer"
            onClick={() => setActive("link")}
          />
          <polyline
            points="860,270 860,64 790,64"
            fill="none"
            stroke={stroke}
            strokeWidth="2.4"
            className="cursor-pointer"
            onClick={() => setActive("link")}
          />
          <polygon points="790,58 774,64 790,70" fill={stroke} />
          {/* hollow diamond on Composite */}
          <polygon
            points="790,270 802,262 814,270 802,278"
            fill="#ece7dc"
            stroke={stroke}
            strokeWidth="2.4"
            className="cursor-pointer"
            onClick={() => setActive("link")}
          />

          {/* dotted note connector */}
          <line
            x1="720"
            y1="292"
            x2="790"
            y2="330"
            stroke={stroke}
            strokeWidth="1.8"
            strokeDasharray="5 5"
          />

          {/* Client */}
          <g className="cursor-pointer uml-box" onClick={() => setActive("client")}>
            <rect
              x="24"
              y="40"
              width="144"
              height="48"
              rx="2"
              fill="#f7f4ee"
              stroke={active === "client" ? "#2f6f56" : stroke}
              strokeWidth={active === "client" ? 3 : 2}
            />
            <HeaderBar x={24} y={40} w={144} label="Client" active={active === "client"} />
            <rect x="24" y="72" width="144" height="16" fill="#f7f4ee" />
          </g>

          {/* Component */}
          <g className="cursor-pointer uml-box" onClick={() => setActive("component")}>
            <rect
              x="264"
              y="28"
              width="382"
              height="90"
              rx="2"
              fill="#f7f4ee"
              stroke={active === "component" ? "#2f6f56" : stroke}
              strokeWidth={active === "component" ? 3 : 2}
            />
            <HeaderBar
              x={264}
              y={28}
              w={382}
              label="Component(interface)"
              active={active === "component"}
            />
            <line x1="264" y1="60" x2="646" y2="60" stroke={stroke} strokeWidth="1.6" />
            <text x="280" y="88" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#1b2438">
              Operation()
            </text>
          </g>

          {/* Leaf */}
          <g className="cursor-pointer uml-box" onClick={() => setActive("leaf")}>
            <rect
              x="138"
              y="218"
              width="224"
              height="108"
              rx="2"
              fill="#f7f4ee"
              stroke={active === "leaf" ? "#2f6f56" : stroke}
              strokeWidth={active === "leaf" ? 3 : 2}
            />
            <HeaderBar x={138} y={218} w={224} label="Leaf" active={active === "leaf"} />
            <line x1="138" y1="250" x2="362" y2="250" stroke={stroke} strokeWidth="1.6" />
            <text x="154" y="286" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#1b2438">
              Operation()
            </text>
          </g>

          {/* Composite */}
          <g className="cursor-pointer uml-box" onClick={() => setActive("composite")}>
            <rect
              x="548"
              y="218"
              width="242"
              height="108"
              rx="2"
              fill="#f7f4ee"
              stroke={active === "composite" ? "#2f6f56" : stroke}
              strokeWidth={active === "composite" ? 3 : 2}
            />
            <HeaderBar x={548} y={218} w={242} label="Composite" active={active === "composite"} />
            <line x1="548" y1="250" x2="790" y2="250" stroke={stroke} strokeWidth="1.6" />
            <text x="564" y="286" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#1b2438">
              Operation()
            </text>
          </g>

          {/* Note */}
          <g className="cursor-pointer uml-box" onClick={() => setActive("note")}>
            <rect
              x="790"
              y="318"
              width="110"
              height="78"
              rx="2"
              fill="#f7f4ee"
              stroke={active === "note" ? "#2f6f56" : stroke}
              strokeWidth={active === "note" ? 3 : 2}
            />
            <text
              x="845"
              y="344"
              textAnchor="middle"
              fontFamily="Outfit, sans-serif"
              fontSize="13"
              fill="#1b2438"
            >
              Uses
            </text>
            <text
              x="845"
              y="362"
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="11"
              fill="#1b2438"
            >
              child.operation()
            </text>
            <text
              x="845"
              y="380"
              textAnchor="middle"
              fontFamily="Outfit, sans-serif"
              fontSize="13"
              fill="#1b2438"
            >
              on each child
            </text>
          </g>
        </svg>
      </div>

      <motion.aside
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-line bg-panel p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Selected participant</p>
        <h3 className="mt-2 font-serif text-2xl text-paper">{info.title}</h3>
        <p className="mt-3 text-sm leading-7 text-mist">{info.body}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="rounded-xl bg-ink-soft p-3">
            <dt className="text-gold">Expression-tree mapping</dt>
            <dd className="mt-1 text-mist">
              {active === "client" && "The code that calls root.evaluate() and prints 25."}
              {active === "component" && "interface Expression { evaluate(): number }"}
              {active === "leaf" && "class NumberExpr — evaluate() returns this.value"}
              {active === "composite" && "class OperatorExpr — loops children and calls evaluate()"}
              {active === "note" && "for (const child of children) child.evaluate()"}
              {active === "link" && "children: Expression[]  // Leaf or nested Operator"}
            </dd>
          </div>
        </dl>
      </motion.aside>
    </div>
  );
}
