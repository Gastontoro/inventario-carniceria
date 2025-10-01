import React from 'react';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light fixed-bottom">
      <div className="container text-center">
        <span className="text-muted">
          © {new Date().getFullYear()} Inventario de Carnicería Ficticia. Proyecto React CRUD.
        </span>
      </div>
    </footer>
  );
}

export default Footer;