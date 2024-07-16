"use client";
import { useState, useEffect } from "react";
import { getToken } from "@/hooks/SessionUtil";
import { obtener } from "@/hooks/Conexion";
import Link from "next/link";
const ListaAutos = () => {
    const [autos, setAutos] = useState([]);

    useEffect(() => {
        const fetchAutos = async () => {
            try {

                const token = getToken();
                const response = await obtener('admin/autos', token);

                console.log("en listaAutos", response);
                setAutos(response.datos);
            } catch (error) {
                console.error("Error obteniendo los autos", error);
            }
        };

        fetchAutos();
    }, []);

    return (
        <div className="container-fluid">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Año</th>
                        <th scope="col">Color</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    {autos.map((auto, i) => (
                        <tr key={auto.external_id}>
                            <td>
                                <Link href={`/autos/detalle/${auto.external_id}`} passHref>{auto.marca}</Link>
                            </td>
                            <td>{auto.modelo}</td>
                            <td>{auto.anio}</td>
                            <td>{auto.color}</td>
                            <td>{auto.precio}</td>
                            <td>{auto.estado ? 'Disponible' : 'Vendido'}</td>
                            <td>
                                {auto.estado ? (
                                    auto.foto.length === 3 ? (
                                        <Link
                                            href={`/autos/editar/${auto.external_id}`}
                                            passHref
                                            className="btn btn-dark"
                                        >
                                            Modificar
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/autos/file/${auto.external_id}`}
                                                passHref
                                                className="btn btn-primary"
                                            >
                                                Agregar Imagen
                                            </Link>
                                            &nbsp;
                                            <Link
                                                href={`/autos/editar/${auto.external_id}`}
                                                passHref
                                                className="btn btn-dark"
                                            >
                                                Modificar
                                            </Link>
                                        </>
                                    )
                                ) : (
                                    "Sin Acciones"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaAutos;