import UmlDiagram from "../components/UmlDiagram";

export default function StructurePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        Structure · do not invent another diagram
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">The Composite UML</h1>
      <p className="mt-4 max-w-3xl leading-8 text-mist">
        This course uses one structure: the classic Component / Leaf / Composite diagram. Client depends
        on the Component interface. Leaf and Composite both implement Operation(). Composite aggregates
        Component children (the hollow diamond) and, in Operation(), uses child.operation() on each
        child. Nested Composites are allowed because a child is a Component, not a Leaf.
      </p>

      <figure className="mt-10 overflow-hidden rounded-2xl border border-line bg-[#ece7dc] p-4">
        <figcaption className="mb-3 px-1 text-xs font-medium uppercase tracking-[0.16em] text-[#5c6578]">
          Reference figure (the structure this site teaches)
        </figcaption>
        <img
          src="/composite-uml.png"
          alt="UML class diagram of the Composite pattern showing Client, Component interface with Operation, Leaf, Composite, aggregation diamond, and a note that Composite uses child.operation on each child"
          className="mx-auto max-h-[420px] w-auto max-w-full"
        />
      </figure>

      <div className="mt-10">
        <UmlDiagram />
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-serif text-2xl">Inheritance arrows</h2>
          <p className="mt-3 text-sm leading-7 text-mist">
            The open triangle pointing at Component means Leaf and Composite are kinds of Component.
            That is why a Client variable typed as Component can hold either a Number or an Operator.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-serif text-2xl">The loop on the right</h2>
          <p className="mt-3 text-sm leading-7 text-mist">
            The line with the diamond leaving Composite and returning to Component is not a second
            inheritance. It is “Composite contains Components.” Because Component includes Composite,
            the tree can be arbitrarily deep: + contains *, which contains numbers.
          </p>
        </article>
      </section>
    </div>
  );
}
