import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import AppSidebar from "./components/AppSidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import PlaybookPage from "./pages/PlaybookPage";
import WorkflowPage from "./pages/WorkflowPage";
import AIFaqPage from "./pages/AIFaqPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-bg">
            <Header onToggleSidebar={() => setSidebarOpen((p) => !p)} />
            <div className="flex flex-1">
              <AppSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/workflow" element={<WorkflowPage />} />
                    <Route path="/playbook" element={<PlaybookPage />} />
                    <Route path="/ai-assistant" element={<AIFaqPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
}
