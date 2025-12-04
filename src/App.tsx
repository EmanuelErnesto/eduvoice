import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { Team } from "./pages/Team";
import { validateEnv } from "./env";

try {
  validateEnv();
} catch (error) {
  console.error("Environment validation error:", error);
}

const App: React.FC = () => {
  return (
    <BrowserRouter
      basename={import.meta.env.MODE === "production" ? "/eduvoice" : "/"}
    >
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/equipe" element={<Team />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
