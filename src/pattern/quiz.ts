export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export const quiz: QuizQuestion[] = [
  {
    q: "What is the primary intent of the Composite Design Pattern?",
    options: [
      "To restrict class instantiation to a single shared object.",
      "To compose objects into tree structures to represent part-whole hierarchies, treating individual objects and groups uniformly.",
      "To convert an incompatible interface into an interface that a client expects.",
      "To dynamically add new responsibilities to an object at runtime without inheritance.",
    ],
    answer: 1,
    why: "Composite allows Clients to treat Leaf primitives and Composite groups through a single unified Component interface.",
  },
  {
    q: "In our Expression Tree example (5 + (10 * 2)), what corresponds to the 'Leaf' participant?",
    options: [
      "The '+' operator node",
      "The '*' operator node",
      "The NumberExpr nodes (5, 10, 2)",
      "The evaluate() method signature",
    ],
    answer: 2,
    why: "Leaf participants are primitive nodes with no children. NumberExpr stores a value and evaluates it directly without delegating.",
  },
  {
    q: "Which UML participant stores children and implements Operation() by delegating to each child?",
    options: ["Client", "Component interface", "Leaf", "Composite"],
    answer: 3,
    why: "Composite aggregates child Components (the hollow diamond ◇) and executes child.evaluate() on each child.",
  },
  {
    q: "Why is evaluate() declared on the Component interface rather than only on concrete classes?",
    options: [
      "So the Client can invoke evaluate() on any node without checking whether it is a Leaf or a Composite.",
      "Because TypeScript does not allow methods on concrete classes.",
      "So that Leaf nodes can add and remove children.",
      "To prevent recursion during tree walking.",
    ],
    answer: 0,
    why: "Uniformity is the core benefit. The Client depends only on Expression.evaluate(), keeping client code simple and decoupling it from concrete tree node types.",
  },
  {
    q: "What does the hollow diamond (◇) pointing to Component signify on the Composite UML diagram?",
    options: [
      "Composite inherits from Client.",
      "Composite aggregates (has-a collection of) Component objects.",
      "Component contains a reference to Leaf.",
      "Composite must always contain exactly two child elements.",
    ],
    answer: 1,
    why: "The hollow diamond represents aggregation. Because children are typed as Component, a Composite can hold Leaves or nested Composites.",
  },
  {
    q: "What is the key trade-off of a 'Transparent' Composite design vs a 'Safe' Composite design?",
    options: [
      "Transparent puts add/remove child methods on Component (uniform, but lower safety); Safe puts them only on Composite (type-safe, less uniform).",
      "Safe allows unlimited depth; Transparent limits tree depth to 3 levels.",
      "Transparent uses private constructors; Safe uses public constructors.",
      "Safe is faster in execution speed than Transparent.",
    ],
    answer: 0,
    why: "Transparency maximizes uniformity by letting Clients call add() anywhere (though Leaves no-op/throw), while Safety restricts child management to Composite types.",
  },
  {
    q: "When Composite.evaluate() runs on the expression (10 * 2), what order of operations occurs?",
    options: [
      "The operator computes 10 * 2 before calling evaluate() on its children.",
      "The operator executes depth-first traversal, calling evaluate() on child 10 and child 2 first, then multiplying their return values.",
      "The Client computes the product and passes it to the Composite.",
      "The expression tree is flattened into a single Leaf.",
    ],
    answer: 1,
    why: "Composite evaluation is post-order recursion: evaluate() traverses children first, then combines child results in the Composite node.",
  },
  {
    q: "How does the Composite pattern satisfy the Open/Closed Principle?",
    options: [
      "By preventing developers from adding new classes to the codebase.",
      "By allowing new Leaf or Composite types (e.g. power, modulus operators) to be introduced without modifying existing Client code.",
      "By closing all class fields to private access.",
      "By converting all classes to abstract interfaces.",
    ],
    answer: 1,
    why: "Because Clients only depend on the Component interface, adding new node classes does not require modifying existing evaluation logic.",
  },
  {
    q: "Which design pattern is frequently combined with Composite to perform new operations across tree nodes without altering node classes?",
    options: ["Singleton", "Visitor", "Adapter", "Factory Method"],
    answer: 1,
    why: "Visitor lets you define new operations (e.g. pretty-printing, type-checking, compiling) across the Composite tree structure without polluting node classes.",
  },
  {
    q: "In an arithmetic expression tree 5 + (10 * 2), what is the evaluation result of root.evaluate()?",
    options: ["30", "25", "100", "17"],
    answer: 1,
    why: "First (10 * 2) evaluates to 20. Then 5 + 20 evaluates to 25.",
  },
];
