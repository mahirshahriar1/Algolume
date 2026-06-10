import { Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/pages/HomePage";
import { LearnPage } from "@/pages/LearnPage";
import { LessonPage } from "@/pages/LessonPage";
import { NotesPage } from "@/pages/NotesPage";
import { SearchPage } from "@/pages/SearchPage";
import { PlaygroundPage } from "@/pages/PlaygroundPage";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { ProblemPage } from "@/pages/ProblemPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ScrollToTop } from "@/components/ScrollToTop";
import { VisualizersPage } from "@/pages/visualizers/VisualizersPage";
import { VisualizerDetailPage } from "@/pages/visualizers/VisualizerDetailPage";
import { SortingPage } from "@/pages/SortingPage";
import { PathfindingPage } from "@/pages/PathfindingPage";

export default function App() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:chapterId/:lessonId" element={<LessonPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:id" element={<ProblemPage />} />
        <Route path="/visualizers" element={<VisualizersPage />} />
        <Route path="/visualizers/:id" element={<VisualizerDetailPage />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/pathfinding" element={<PathfindingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ScrollToTop />
    </div>
  );
}
