"use client";

import Menu_gerente from "@/componentes/menu_gerente";
import Menu_vendedor from "@/componentes/menu_vendedor";
import ListaVentas from "@/componentes/ventas/listaVentas";
import { get } from "@/hooks/SessionUtil";
import Link from "next/link";
export default function Page() {
    const rol = get('rol');
    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <div className="mb-2 mt-4">
                <div className="d-flex gap-4">
                    <h2>Listado de Todas las Ventas</h2>
                </div>
            </div>
            <ListaVentas></ListaVentas>
        </div>
    );
}