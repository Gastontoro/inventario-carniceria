import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar el CSS de Bootstrap
import Navbar from './components/common/navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import DetalleProducto from './pages/DetalleProducto';
import CrearEditarProducto from './pages/CrearEditarProducto';

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar va fuera de Routes para que se muestre en todas las páginas */}
      <Navbar /> 
      
      <main className="container my-5">
        <Routes>
          {/* 1. Ruta Principal: Listado de Inventario (READ All) */}
          <Route path="/" element={<Home />} />
          
          {/* 2. Ruta de Creación (CREATE) */}
          <Route path="/crear" element={<CrearEditarProducto />} />
          
          {/* 3. Ruta Dinámica: Detalle del Producto (READ One) */}
          <Route path="/producto/:id" element={<DetalleProducto />} />
          
          {/* 4. Ruta Dinámica: Edición del Producto (UPDATE) */}
          <Route path="/editar/:id" element={<CrearEditarProducto />} />

          {/* Opcional: Ruta 404 */}
          <Route path="*" element={<h1 className="text-center mt-5">404 - ¡Corte no encontrado!</h1>} />
        </Routes>
      </main>
      
      {/* El Footer también va fuera de Routes */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;