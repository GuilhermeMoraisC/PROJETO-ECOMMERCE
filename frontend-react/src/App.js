// Arquivo: src/App.js (VERSÃO ATUALIZADA)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage'; // <--- IMPORTE A PÁGINA DE LOGIN
import ProtectedRoute from './components/ProtectedRoute'; // <--- IMPORTE O "GUARDA"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota para a Página Principal (Pública) */}
        <Route path="/" element={<HomePage />} />

        {/* Rota de Login (Pública) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota para o Painel do Administrador (Agora Protegida) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;