import { motion, AnimatePresence } from "framer-motion";
import type { ExprNode } from "../pattern/expression";

type Props = {
  node: ExprNode;
  activeIds?: Set<string>;
  evalMap?: Record<string, number>;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export default function ExpressionTree({ node, activeIds, evalMap, selectedId, onSelect }: Props) {
  return (
    <div className="flex justify-center overflow-x-auto py-6 px-2">
      <TreeNode
        node={node}
        activeIds={activeIds}
        evalMap={evalMap}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}

function TreeNode({ node, activeIds, evalMap, selectedId, onSelect }: Props) {
  const lit = activeIds?.has(node.id) ?? false;
  const computedVal = evalMap ? evalMap[node.id] : undefined;
  const selected = selectedId === node.id;
  const isLeaf = node.kind === "leaf";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.button
          type="button"
          layout
          onClick={() => onSelect?.(node.id)}
          animate={{
            scale: lit ? 1.08 : 1,
            boxShadow: lit
              ? "0 0 15px rgba(232, 195, 106, 0.4), 0 0 0 2px #e8c36a"
              : selected
                ? "0 0 0 2px #e8c36a"
                : "0 4px 12px rgba(0,0,0,0.3)",
          }}
          transition={{ duration: 0.2 }}
          className={[
            "relative z-10 flex min-w-[88px] flex-col items-center justify-center rounded-2xl border px-4 py-2.5 font-mono text-sm transition-colors",
            isLeaf
              ? "border-sky/50 bg-[#14233a] text-sky hover:bg-[#1a2f4c]"
              : "border-sage/50 bg-[#122b22] text-sage hover:bg-[#17382c]",
          ].join(" ")}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-75">
            {isLeaf ? "Leaf" : "Composite"}
          </span>
          <span className="text-lg font-bold">
            {isLeaf ? node.value : node.operator}
          </span>
        </motion.button>

        {/* Animated Computed Value Badge during evaluation */}
        <AnimatePresence>
          {computedVal !== undefined && (
            <motion.span
              initial={{ scale: 0, y: -6, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-3 -right-3 z-20 rounded-full border border-gold bg-gold/90 px-2 py-0.5 font-mono text-xs font-bold text-ink shadow-lg"
            >
              = {computedVal}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {node.kind === "composite" && node.children.length > 0 && (
        <div className="mt-4 flex items-start gap-6 sm:gap-8">
          {node.children.map((child) => (
            <div key={child.id} className="relative flex flex-col items-center">
              {/* Connecting line */}
              <div
                className={[
                  "mb-3 h-6 w-0.5 transition-colors duration-300",
                  lit || (activeIds?.has(child.id) ?? false) ? "bg-gold" : "bg-line",
                ].join(" ")}
              />
              <TreeNode
                node={child}
                activeIds={activeIds}
                evalMap={evalMap}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
