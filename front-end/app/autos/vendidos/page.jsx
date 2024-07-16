"use client";

import ListaAutosVendidos from "@/componentes/autos/listaAutosVendidos";
import Menu_gerente from "@/componentes/menu_gerente";
import Menu_vendedor from "@/componentes/menu_vendedor";
import { get } from "@/hooks/SessionUtil";
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
                    <h2>Listado de Autos Vendidos</h2>
                </div>
            </div>
            <ListaAutosVendidos></ListaAutosVendidos>
        </div>
    );
}