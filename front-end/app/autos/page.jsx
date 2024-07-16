"use client";

import ListaAutos from "@/componentes/autos/listaAutos";
import Menu_gerente from "@/componentes/menu_gerente";
import Menu_vendedor from "@/componentes/menu_vendedor";
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
                    <h2>Listado de Autos</h2>
                    <Link href="/autos/nuevo">
                        <button className="btn btn-dark px-2">Nuevo Auto</button>

                    </Link>
                </div>
            </div>
            <ListaAutos></ListaAutos>
        </div>
    );
}