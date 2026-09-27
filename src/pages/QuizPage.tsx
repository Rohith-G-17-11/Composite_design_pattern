import { useState } from "react";
import { Award, Check, CheckCircle2, GraduationCap, HelpCircle, RefreshCw, XCircle } from "lucide-react";
import { quiz } from "../pattern/quiz";

export default function QuizPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const score = answers.reduce<number>((acc, a, i) => acc + (a === quiz[i].answer ? 1 : 0), 0);
  const percentage = Math.round((score / quiz.length) * 100);
  const passed = percentage >= 80;

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => prev.map((v, i) => (i === questionIndex ? optionIndex : v)));
  };

  const handleReset = () => {
    setAnswers(quiz.map(() => null));
    setSubmitted(false);
    setShowCertificate(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-3">
        <GraduationCap className="text-sage" size={32} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Knowledge Verification
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">Composite Pattern Mastery Quiz</h1>
        </div>
      </div>

      <p className="mt-4 leading-8 text-mist">
        Test your understanding of the Composite Design Pattern, GoF UML participants (`Component`, `Leaf`, `Composite`),
        and the arithmetic expression tree example (`5 + (10 * 2) = 25`).
      </p>

      {/* Quiz Progress & Score Header */}
      {submitted && (
        <div className="mt-8 rounded-3xl border border-line bg-panel p-6 shadow-xl text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-mist font-semibold">Quiz Result</span>
            <h2 className="mt-1 font-serif text-3xl text-paper">
              You scored <span className="text-gold font-mono">{score}</span> / {quiz.length} ({percentage}%)
            </h2>
            <p className="mt-2 text-xs text-mist leading-6">
              {passed
                ? "Congratulations! You demonstrated expert mastery of the Composite Pattern."
                : "Good attempt! Review the explanations below and retry to achieve mastery (≥80%)."}
            </p>
          </div>

          {passed && (
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink shadow-lg hover:bg-gold/90 transition shrink-0"
            >
              <Award size={18} /> View Certificate
            </button>
          )}
        </div>
      )}

      {/* Questions List */}
      <ol className="mt-10 space-y-8">
        {quiz.map((item, qi) => {
          return (
            <li key={item.q} className="rounded-3xl border border-line bg-panel p-6 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-lg text-paper leading-7">
                  <span className="text-sage font-mono mr-2">{qi + 1}.</span>
                  {item.q}
                </h2>
              </div>

              <ul className="mt-5 space-y-3">
                {item.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const isCorrect = submitted && oi === item.answer;
                  const isWrong = submitted && chosen && oi !== item.answer;

                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => handleSelect(qi, oi)}
                        className={[
                          "w-full rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition flex items-center justify-between gap-3",
                          isCorrect
                            ? "border-sage bg-sage/15 text-sage font-medium"
                            : isWrong
                              ? "border-coral bg-coral/15 text-coral font-medium"
                              : chosen
                                ? "border-gold bg-gold/10 text-paper"
                                : "border-line/60 bg-ink-soft/60 text-mist hover:border-mist hover:text-paper",
                        ].join(" ")}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 size={18} className="text-sage shrink-0" />}
                        {isWrong && <XCircle size={18} className="text-coral shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {submitted && (
                <div className="mt-4 rounded-2xl border border-line bg-ink-soft p-4 text-xs leading-6 text-mist flex items-start gap-2.5">
                  <HelpCircle size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-paper block mb-1">Explanation:</strong>
                    {item.why}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center gap-2 rounded-full bg-sage-deep px-8 py-3 text-sm font-semibold text-paper shadow-lg hover:bg-sage-deep/80 transition"
          >
            <Check size={16} /> Submit Quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-2.5 text-sm font-medium text-mist hover:text-paper transition"
          >
            <RefreshCw size={15} /> Retake Quiz
          </button>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full rounded-3xl border-2 border-gold bg-panel p-8 sm:p-10 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-mist hover:text-paper text-sm font-bold"
            >
              ✕ Close
            </button>

            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-gold mb-4">
              <Award size={36} />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gold">
              Certificate of Completion
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-paper">
              Composite Design Pattern Master
            </h2>
            <p className="mt-3 text-sm text-mist max-w-lg mx-auto">
              This certifies that you have successfully mastered the <strong>Composite Design Pattern</strong>,
              demonstrating expert knowledge of Component interfaces, Leaf nodes, and Composite tree recursion.
            </p>

            <div className="mt-6 rounded-2xl bg-ink-soft p-4 border border-line inline-block text-left text-xs font-mono space-y-1">
              <p><span className="text-mist">Score Achieved:</span> <span className="text-gold font-bold">{percentage}% ({score}/{quiz.length})</span></p>
              <p><span className="text-mist">Example Domain:</span> <span className="text-sage">Arithmetic Expression Tree (5 + (10 * 2) = 25)</span></p>
              <p><span className="text-mist">Reference Standard:</span> <span className="text-paper">GoF / Refactoring Guru Structural UML</span></p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-sage-deep px-6 py-2.5 text-xs font-semibold text-paper hover:bg-sage-deep/80"
              >
                Print / Save Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="rounded-full border border-line px-6 py-2.5 text-xs text-mist hover:text-paper"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
