"use client";

import ListaCompradores from "@/componentes/compradores/listaCompradores";
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
                    <h2>Listado de Compradores</h2>
                    <Link href="/compradores/nuevo">
                        <button className="btn btn-dark px-2">Nuevo Comprador</button>

                    </Link>
                </div>
            </div>
            <ListaCompradores></ListaCompradores>
        </div>
    );
}