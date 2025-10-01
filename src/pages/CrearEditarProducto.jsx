import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormProducto from '../components/forms/FormProducto';
import { crearProducto, obtenerProductoPorId, actualizarProducto } from '../api/firebase';

function CrearEditarProducto() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditing = !!id; 

  // Estado para la interfaz
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estado para los datos del producto (solo en modo edición)
  const [productoData, setProductoData] = useState(null); 

  const title = isEditing ? `Editar Producto` : 'Crear Nuevo Producto';

  // 1. Lógica para CARGAR los datos del producto (solo en modo edición)
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const data = await obtenerProductoPorId(id);
          // Preparamos los datos para React Hook Form
          setProductoData({
            ...data,
            // Aseguramos que los números sean de tipo Number para RHF
            precio: parseFloat(data.precio) || 0,
            stock: parseInt(data.stock) || 0,
            // Aseguramos que los campos opcionales no sean undefined
            descripcion: data.descripcion || '',
            imagenUrl: data.imagenUrl || '',
          });
          setIsLoading(false);
        } catch (err) {
          setError("Error al cargar el producto para edición. " + err.message);
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);


  // 2. Lógica para MANEJAR el envío del formulario (CREATE/UPDATE)
  const handleSubmitForm = async (data) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Limpiamos la URL si está vacía
    const finalData = {
        ...data,
        imagenUrl: data.imagenUrl || null // Guardamos null en Firebase si la URL está vacía
    };

    try {
      if (isEditing) {
        // OPERACIÓN UPDATE
        await actualizarProducto(id, finalData);
        setSuccess('Producto actualizado con éxito.');
        // Redirigir al detalle después de un momento
        setTimeout(() => navigate(`/producto/${id}`), 2000); 
      } else {
        // OPERACIÓN CREATE
        await crearProducto(finalData);
        setSuccess('Producto creado y añadido al inventario.');
        // Redirigir al listado
        setTimeout(() => navigate('/'), 2000); 
      }
    } catch (err) { // <--- Esta es la línea que pudo haber fallado en el copy/paste
      setError(err.message || "Ocurrió un error al procesar la operación.");
    } finally {
      setIsLoading(false);
    }
  };


  // Manejo de carga y errores
  if (isLoading && isEditing) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3">Cargando datos del producto...</p>
      </Container>
    );
  }

  // Evitamos renderizado prematuro si estamos en edición y aún no tenemos datos
  if (isEditing && !productoData && !error) {
    return null; 
  }
  
  const defaultValues = isEditing ? productoData : null;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="text-white bg-dark d-flex justify-content-between align-items-center">
              <h2 className="mb-0">{title}</h2>
              <Button variant="outline-light" as={Link} to="/">Volver</Button>
            </Card.Header>
            <Card.Body>
                
              {/* Mensajes de Estado */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {/* Mostrar formulario si no hay un error crítico de carga */}
              {!error && (
                <FormProducto 
                  onSubmit={handleSubmitForm} 
                  defaultValues={defaultValues}
                  isEditing={isEditing}
                />
              )}
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CrearEditarProducto;