"use client";
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getExternalUser, getToken, get } from '@/hooks/SessionUtil';
import Menu_gerente from '@/componentes/menu_gerente';
import Menu_vendedor from '@/componentes/menu_vendedor';
import { obtener } from '@/hooks/Conexion';
import { useForm } from "react-hook-form";
import Link from 'next/link';

export default function Page({ params }) {
    const external = params.external;
    const token = getToken();
    const rol = get('rol');
    const [respuesta, setRespuesta] = useState({});


    useEffect(() => {
        const fetchResultados = async () => {
            const response = await obtener('/admin/autos/obtener/' + external, token);
            console.log("response", response);

            if (response.datos) {
                setRespuesta(response.datos);

                setValue('marca', response.datos.marca);
                setValue('modelo', response.datos.modelo);
                setValue('anio', response.datos.anio);
                setValue('color', response.datos.color);
                setValue('precio', response.datos.precio);
                setValue('foto', response.datos.foto);
                setValue('estado', response.datos.estado);
            }

        };

        fetchResultados();
    }, [external, setValue, token]);

    const { setValue } = useForm();

    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <h1>Detalle Auto</h1>
            <div className='col-8 container-fluid d-flex flex-column align-items-center' style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>

                {respuesta.estado === false && (
                    <p style={{ fontSize: '1.3em', color: 'red' }}><strong>Estado: VENDIDO</strong></p>
                )}

                {respuesta.estado === true && (
                    <p style={{ fontSize: '1.3em', color: 'green' }}><strong>Estado: DISPONIBLE</strong></p>
                )}

                <p style={{ fontSize: '1.3em' }}><strong>Marca:</strong> {respuesta.marca}</p>
                <p style={{ fontSize: '1.3em' }}><strong>Modelo:</strong> {respuesta.modelo}</p>
                <p style={{ fontSize: '1.3em' }}><strong>Año:</strong> {respuesta.anio}</p>
                <p style={{ fontSize: '1.3em' }}><strong>Color:</strong> {respuesta.color}</p>
                <p style={{ fontSize: '1.3em' }}><strong>Precio:</strong> {respuesta.precio}</p>

                {respuesta.foto && respuesta.foto.length > 0 && (
                    <div>
                        <h2 className="text-center mb-3">Fotos</h2>
                        <div className='d-flex justify-content-center'>
                            <ul className='list-inline'>
                                {respuesta.foto.map((foto, index) => (
                                    <li key={index} className='list-inline-item'>
                                        <img
                                            src={`https://back-end-autos.onrender.com/multimedia/${foto.archivo}`}
                                            alt={`Foto ${index + 1}`}
                                            style={{ maxWidth: '200px', maxHeight: '200px', width: '100%', height: 'auto' }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="d-flex flex-column align-items-center mt-4">

                    <div className="d-flex gap-4">
                        {respuesta.estado !== false && (
                            <Link
                                href={`/autos/disponibles/detalle/editar/${external}`}
                                passHref
                                className="btn btn-outline-dark btn-lg px-3"
                            >
                                Modificar
                            </Link>
                        )}

                        <Link href="/autos/disponibles">
                            <button className="btn btn-outline-dark btn-lg px-3">Volver</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}