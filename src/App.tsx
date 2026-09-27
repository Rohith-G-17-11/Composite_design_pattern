import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LearnPage from "./pages/LearnPage";
import StructurePage from "./pages/StructurePage";
import PlaygroundPage from "./pages/PlaygroundPage";
import CodePage from "./pages/CodePage";
import AdvancedPage from "./pages/AdvancedPage";
import QuizPage from "./pages/QuizPage";
import type { Page } from "./types";

export default function App() {
  const [page, setPage] = useState<Page>("learn");

  return (
    <div className="min-h-screen bg-ink">
      <Navbar page={page} onChange={setPage} />
      <main>
        {page === "learn" && <LearnPage onOpen={setPage} />}
        {page === "structure" && <StructurePage />}
        {page === "playground" && <PlaygroundPage />}
        {page === "code" && <CodePage />}
        {page === "advanced" && <AdvancedPage />}
        {page === "quiz" && <QuizPage />}
      </main>
      <Footer />
    </div>
  );
}
