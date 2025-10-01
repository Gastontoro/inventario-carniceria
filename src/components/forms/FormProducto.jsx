import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

// -----------------------------------------------------
// 1. ESQUEMA DE VALIDACIÓN CON YUP
// -----------------------------------------------------
const validationSchema = yup.object({
  nombre: yup.string()
    .required('El nombre del corte es obligatorio.')
    .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    
  precio: yup.number()
    .typeError('El precio debe ser un número.')
    .required('El precio es obligatorio.')
    .positive('El precio debe ser positivo.'),
    
  stock: yup.number()
    .typeError('El stock debe ser un número entero.')
    .required('El stock es obligatorio.')
    .integer('El stock debe ser un número entero.')
    .min(0, 'El stock no puede ser negativo.'),

  proveedor: yup.string()
    .required('El proveedor es obligatorio.'),
    
  descripcion: yup.string().max(200, 'Máximo 200 caracteres.'),
  imagenUrl: yup.string().url('Debe ser una URL válida.').nullable(),
}).required();


function FormProducto({ onSubmit, defaultValues, isEditing }) {
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues || {
      nombre: '', 
      precio: 0, 
      stock: 0, 
      proveedor: '', 
      descripcion: '', 
      imagenUrl: ''
    } // Establece valores predeterminados para evitar NaN/undefined
  });

  // Efecto para actualizar el formulario si los defaultValues cambian (solo en edición)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      
      {/* Fila 1: Nombre y Precio */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formNombre">
          <Form.Label>Nombre del Corte</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: Bife de Chorizo" 
            {...register("nombre")} 
            isInvalid={!!errors.nombre} // Muestra el error
          />
          <Form.Control.Feedback type="invalid">
            {errors.nombre?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="formPrecio">
          <Form.Label>Precio por Kg ($)</Form.Label>
          <Form.Control 
            type="number" 
            step="0.01" // Permite decimales para el precio
            placeholder="Ej: 15.99" 
            {...register("precio")} 
            isInvalid={!!errors.precio}
          />
          <Form.Control.Feedback type="invalid">
            {errors.precio?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* Fila 2: Stock y Proveedor */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formStock">
          <Form.Label>Stock (kg o Unidades)</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Ej: 50" 
            {...register("stock", { valueAsNumber: true })} // Convierte a número automáticamente
            isInvalid={!!errors.stock}
          />
          <Form.Control.Feedback type="invalid">
            {errors.stock?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="formProveedor">
          <Form.Label>Proveedor</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ej: Frigorífico El Toro" 
            {...register("proveedor")} 
            isInvalid={!!errors.proveedor}
          />
          <Form.Control.Feedback type="invalid">
            {errors.proveedor?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* Fila 3: Descripción */}
      <Form.Group className="mb-3" controlId="formDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          placeholder="Notas de calidad, tipo de crianza, etc."
          {...register("descripcion")}
          isInvalid={!!errors.descripcion}
        />
        <Form.Control.Feedback type="invalid">
            {errors.descripcion?.message}
        </Form.Control.Feedback>
      </Form.Group>
      
      {/* Fila 4: URL de Imagen */}
      <Form.Group className="mb-4" controlId="formImagenUrl">
        <Form.Label>URL de Imagen (Opcional)</Form.Label>
        <Form.Control 
          type="url" 
          placeholder="https://ejemplo.com/imagen-bife.jpg" 
          {...register("imagenUrl")} 
          isInvalid={!!errors.imagenUrl}
        />
        <Form.Control.Feedback type="invalid">
          {errors.imagenUrl?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Botón de Enviar */}
      <Button variant={isEditing ? "warning" : "success"} type="submit" className="w-100">
        {isEditing ? 'Guardar Cambios' : 'Añadir al Inventario'}
      </Button>
    </Form>
  );
}

export default FormProducto;