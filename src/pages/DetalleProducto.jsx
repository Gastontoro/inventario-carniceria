import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorId } from '../api/firebase';

function DetalleProducto() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await obtenerProductoPorId(id);
        setProducto(data);
      } catch (err) {
        setError("Error al cargar el detalle del producto: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3">Cargando detalle del corte...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
          <p className="mt-2">El producto con ID "{id}" no se pudo encontrar.</p>
          <Button variant="danger" as={Link} to="/">Volver al Inventario</Button>
        </Alert>
      </Container>
    );
  }

  // Renderiza el detalle del producto
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">{producto.nombre}</h3>
              <Button variant="outline-light" as={Link} to={`/editar/${producto.id}`}>
                Editar Producto
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3">
                  {/* Placeholder de imagen o imagen real si existe */}
                  <img 
                    src={producto.imagenUrl || 'https://via.placeholder.com/150?text=Corte+Carne'} 
                    alt={producto.nombre} 
                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                    className="rounded shadow-sm"
                  />
                </Col>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Precio por Kg/Unidad:</strong> ${parseFloat(producto.precio).toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Stock Disponible:</strong> <span className={producto.stock <= 5 ? 'text-danger fw-bold' : ''}>{producto.stock}</span> kg/u
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Proveedor:</strong> {producto.proveedor}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>ID de Inventario:</strong> {producto.id}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              
              <div className="mt-4 p-3 bg-light border rounded">
                <h5>Descripción / Notas de Calidad</h5>
                <p>{producto.descripcion || 'No hay descripción disponible para este corte.'}</p>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="secondary" as={Link} to="/">
                  Volver al Listado
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetalleProducto;