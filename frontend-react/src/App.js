// Arquivo: src/App.js (VERSÃO FINAL COM ROTAS)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota para a Página Principal */}
        <Route path="/" element={<HomePage />} />

        {/* Rota para o Painel do Administrador */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
