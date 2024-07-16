"use client"
import { borrarSesion } from "@/hooks/SessionUtil";
import Link from "next/link";
import mensajes from "./Mensajes";
import { redirect, useRouter } from "next/navigation";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
export default function Menu_gerente() {
    const router = useRouter();
    const salir = async () => {
        await borrarSesion();
        mensajes("Adiós!", "Hasta la próxima");
        router.push('/');
        router.refresh();
    }
    return (
     <Navbar bg="dark" expand="lg" variant="dark">
      <div className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <Nav.Link onClick={salir}>Cerrar Sesión</Nav.Link>
            
            <NavDropdown title="Ventas" id="basic-nav-dropdown">
                <NavDropdown.Item href="/ventas">Ventas</NavDropdown.Item>
                <NavDropdown.Item href="/ventas/propias">Mis Ventas</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title="Autos" id="basic-nav-dropdown">
                <NavDropdown.Item href="/autos">Autos</NavDropdown.Item>
                <NavDropdown.Item href="/autos/vendidos">Autos Vendidos</NavDropdown.Item>
                <NavDropdown.Item href="/autos/disponibles">Autos Disponibles</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/compradores">Compradores</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
    );
}