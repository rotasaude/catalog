import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OpenModulesProvider } from "./components/OpenModules";
import { FeaturePage } from "./pages/FeaturePage";
import { ModuleList } from "./pages/ModuleList";

// Rotas separadas do roteador para os testes montarem com MemoryRouter.
export function AppRoutes() {
  return (
    <OpenModulesProvider>
      <div className="wrap">
        <Routes>
          <Route path="/" element={<ModuleList />} />
          <Route path="/funcionalidades/:slug" element={<FeaturePage />} />
          <Route path="*" element={<FeaturePage />} />
        </Routes>
      </div>
    </OpenModulesProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
