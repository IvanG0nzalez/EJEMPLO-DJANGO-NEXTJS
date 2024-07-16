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
            const response = await obtener('/admin/compradores/obtener/' + external, token);
            console.log("response", response);

            if (response.datos) {
                setRespuesta(response.datos);

                setValue('nombres', response.datos.nombres);
                setValue('apellidos', response.datos.apellidos);
                setValue('direccion', response.datos.direccion);
                setValue('celular', response.datos.celular);
                setValue('genero', response.datos.genero);
            }

        };

        fetchResultados();
    }, [external, setValue, token]);

    const validationShema = Yup.object().shape({
        nombres: Yup.string().required("Ingrese sus nombres"),
        apellidos: Yup.string().required("Ingrese sus apellidos"),
        direccion: Yup.string().required("Ingrese su dirección"),
        celular: Yup.string().required("Ingrese su celular").length(10, "El celular debe tener 10 dígitos"),
    });

    const { register, handleSubmit, formState, setValue, watch } = useForm({
        defaultValues: respuesta,
    });

    const { errors } = formState;




    const sendData = (data) => {
        console.log("data", data);
        var dato = {
            "nombres": data.nombres,
            "apellidos": data.apellidos,
            "direccion": data.direccion,
            "celular": data.celular,
            "genero": data.genero
        };
        console.log("dato", dato);

        modificar('admin/comprador/editar/' + external, dato, token).then((datos) => {
            console.log("info", datos);
            if (datos.code === 200) {
                mensajes("Comprador modificado correctamente", "OK", "sucess");
                router.push("/compradores");
            } else {
                mensajes("Error al modificar el comprador!", "Error", "error");
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
            <h1>Modificar Comprador</h1>
            <div className='col-4 container-fluid'>
                <form onSubmit={handleSubmit(sendData)}>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Nombres</label>
                        <input {...register('nombres')} name="nombres" id="nombres" className={`form-control ${errors.nombres ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.nombres?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Apellidos</label>
                        <input {...register('apellidos')} name="apellidos" id="apellidos" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.apellidos?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Dirección</label>
                        <input {...register('direccion')} name="direccion" id="direccion" className={`form-control ${errors.direccion ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.direccion?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Celular</label>
                        <input {...register('celular')} name="celular" id="celular" className={`form-control ${errors.celular ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.celular?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Género</label>
                        <select {...register('genero')} name="genero" id="genero" className={`form-select ${errors.genero ? 'is-invalid' : ''}`}>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.genero?.message}
                        </div>
                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Guardar</button>
                        <Link href="/compradores">
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}