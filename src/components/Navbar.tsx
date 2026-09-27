import { BookOpen, Box, Code2, GraduationCap, Network, Play } from "lucide-react";
import type { Page } from "../types";

const items: { id: Page; label: string; icon: typeof BookOpen }[] = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "structure", label: "Structure", icon: Network },
  { id: "playground", label: "Playground", icon: Play },
  { id: "code", label: "Code Lab", icon: Code2 },
  { id: "advanced", label: "Advanced", icon: Box },
  { id: "quiz", label: "Quiz", icon: GraduationCap },
];

type Props = {
  page: Page;
  onChange: (page: Page) => void;
};

export default function Navbar({ page, onChange }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button
          type="button"
          onClick={() => onChange("learn")}
          className="flex items-center gap-2 text-left"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-sage-deep font-mono text-sm text-sage">
            Σ
          </span>
          <span>
            <span className="block font-serif text-lg leading-none text-paper">Composite Lab</span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-mist/70">
              Structural pattern
            </span>
          </span>
        </button>
        <nav className="flex flex-wrap justify-end gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const on = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition",
                  on ? "bg-sage-deep text-paper" : "text-mist hover:bg-panel hover:text-paper",
                ].join(" ")}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
