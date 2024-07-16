"use client";

import Menu_gerente from "@/componentes/menu_gerente";
import Menu_vendedor from "@/componentes/menu_vendedor";
import ListaVentasEmpleado from "@/componentes/ventas/listaVentasEmpleado";
import { get } from "@/hooks/SessionUtil";
import Link from "next/link";
export default function Page() {
    const rol = get('rol');
    const vendedor = get('usuario');
    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <div className="mb-2 mt-4">
                <div className="d-flex gap-4">
                    <h2>Ventas de {vendedor}</h2>
                    <Link href="/ventas/nuevo">
                        <button className="btn btn-dark px-2">Nueva Venta</button>

                    </Link>
                </div>
            </div>
            <ListaVentasEmpleado></ListaVentasEmpleado>
        </div>
    );
}