// Arquivo: src/App.js (VERSÃO COMPLETA FINAL)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes Públicos
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import ProductDetailPage from './pages/ProductDetailPage'; // Assumindo este nome

// Componentes Protegidos
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<HomePage />} /> 
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-senha" element={<ResetPasswordPage />} /> 

        {/* ROTA PROTEGIDA */}
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