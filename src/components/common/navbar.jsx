import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Usamos 'Link' para la navegación interna */}
        <Navbar.Brand as={Link} to="/">
          🥩 Inventario La Carnicería
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Link para la página principal (Listado) */}
            <Nav.Link as={Link} to="/">
              Inventario
            </Nav.Link>
            
            {/* Link para la página de creación */}
            <Nav.Link as={Link} to="/crear">
              Agregar Producto
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;