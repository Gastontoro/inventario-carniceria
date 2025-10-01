import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { obtenerTodosLosProductos, eliminarProducto } from '../api/firebase';

function Home() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, loading: false, error: null });

  // Función para cargar los datos del inventario (READ All)
  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerTodosLosProductos();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar el inventario: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect para cargar los productos al inicio
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Función para manejar la eliminación de un producto (DELETE)
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto "${nombre}"? Esta acción es irreversible.`)) {
      return;
    }

    setDeleteStatus({ id, loading: true, error: null });
    try {
      await eliminarProducto(id);
      
      // Si la eliminación es exitosa, actualiza el estado local para reflejar el cambio
      setProductos(prev => prev.filter(p => p.id !== id));
      setDeleteStatus({ id: null, loading: false, error: null });

    } catch (err) {
      setDeleteStatus({ id, loading: false, error: "Error al eliminar: " + err.message });
    }
  };

  // ----------------------------------------------------
  // Renderizado del Componente
  // ----------------------------------------------------
  
  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="danger" />
        <h4 className="mt-3">Cargando inventario...</h4>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <strong>¡Error de conexión!</strong> {error}
          <div className="mt-2">
            <Button variant="danger" onClick={fetchProductos}>Reintentar Carga</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Inventario de Carnicería</h1>
        <Button variant="success" as={Link} to="/crear">
          + Agregar Nuevo Corte
        </Button>
      </div>

      {productos.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay productos en el inventario. ¡Crea el primero!
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Proveedor</th>
              <th>Stock (kg/u)</th>
              <th>Precio ($)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.proveedor}</td>
                <td className={producto.stock <= 5 ? 'text-danger fw-bold' : ''}>
                    {producto.stock}
                </td>
                <td>${parseFloat(producto.precio).toFixed(2)}</td>
                <td className="d-flex justify-content-around">
                  
                  {/* Botón Ver Detalle (READ One) */}
                  <Button variant="info" size="sm" as={Link} to={`/producto/${producto.id}`}>
                    Ver
                  </Button>
                  
                  {/* Botón Editar (UPDATE) */}
                  <Button variant="warning" size="sm" as={Link} to={`/editar/${producto.id}`}>
                    Editar
                  </Button>
                  
                  {/* Botón Eliminar (DELETE) */}
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(producto.id, producto.nombre)}
                    disabled={deleteStatus.loading && deleteStatus.id === producto.id}
                  >
                    {deleteStatus.loading && deleteStatus.id === producto.id ? 
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                      : 'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Mostrar error de eliminación si ocurre */}
      {deleteStatus.error && 
        <Alert variant="danger" className="mt-3">
          Error al eliminar el producto: {deleteStatus.error}
        </Alert>}
      
    </Container>
  );
}

export default Home;