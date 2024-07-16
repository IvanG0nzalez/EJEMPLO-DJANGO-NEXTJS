"use client";
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { getExternalUser, getToken, get } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import Link from 'next/link';
import Menu_gerente from '@/componentes/menu_gerente';
import Menu_vendedor from '@/componentes/menu_vendedor';
import { modificar } from '@/hooks/Conexion';
import { obtener } from '@/hooks/Conexion';


export default function Page({ params }) {
    const external = params.external;
    const external_user = getExternalUser();
    const token = getToken();
    const router = useRouter();
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
            }

        };

        fetchResultados();
    }, [external, setValue, token]);

    const validationShema = Yup.object().shape({
        marca: Yup.string().required("Ingrese la marca del auto"),
        modelo: Yup.string().required("Ingrese el modelo del auto"),
        anio: Yup.number()
            .required("Ingrese el año del auto")
            .typeError("El año debe ser un número")
            .min(1886, "El año mínimo permitido es 1886")
            .max(new Date().getFullYear(), "El año no puede ser mayor al actual"),
        color: Yup.string().required("Ingrese el color del auto"),
        precio: Yup.number()
            .required("Ingrese el precio del auto")
            .typeError("El precio debe ser un número")
            .min(0, "El precio no puede ser negativo"),

    });

    const { register, handleSubmit, formState, setValue, watch } = useForm({
        defaultValues: respuesta,
    });

    const { errors } = formState;

    const sendData = (data) => {
        console.log("data", data);
        var dato = {
            "marca": data.marca,
            "modelo": data.modelo,
            "anio": data.anio,
            "color": data.color,
            "precio": data.precio
        };
        console.log("dato", dato);

        modificar('admin/auto/editar/' + external, dato, token).then((datos) => {
            console.log("info", datos);
            if (datos.code === 200) {
                mensajes("Auto modificado correctamente", "OK", "sucess");
                router.push(`/autos/disponibles/detalle/${external}`);
            } else {
                mensajes("Error al modificar el auto!", "Error", "error");
            }

        });
    };

    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <h1>Modificar Auto</h1>
            <div className='col-4 container-fluid'>
                <form onSubmit={handleSubmit(sendData)}>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Marca</label>
                        <input {...register('marca')} name="marca" id="marca" className={`form-control ${errors.marca ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.marca?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Modelo</label>
                        <input {...register('modelo')} name="modelo" id="modelo" className={`form-control ${errors.modelo ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.modelo?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Año</label>
                        <input {...register('anio')} name="anio" id="anio" className={`form-control ${errors.anio ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.anio?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Color</label>
                        <input {...register('color')} name="color" id="color" className={`form-control ${errors.color ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.color?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Precio</label>
                        <input {...register('precio')} name="precio" id="precio" className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.precio?.message}
                        </div>
                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Guardar</button>
                        <Link href={`/autos/disponibles/detalle/${external}`}>
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}