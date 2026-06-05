import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AddProduct from './pages/AddProduct/AddProduct';
import ProductPage from './pages/ProductPage/ProductPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin/add" element={<AddProduct />} />

        {/* Public product page — QR code links here */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
