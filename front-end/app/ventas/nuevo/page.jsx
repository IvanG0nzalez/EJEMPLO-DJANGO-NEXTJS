"use client";
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'next/navigation';
import { getExternalUser, getToken, get } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import Link from 'next/link';
import Menu_gerente from '@/componentes/menu_gerente';
import Menu_vendedor from '@/componentes/menu_vendedor';
import { guardar } from '@/hooks/Conexion';
import { obtener } from '@/hooks/Conexion';


export default function Nuevo() {
    const external_user = getExternalUser();
    const token = getToken();
    const router = useRouter();
    const rol = get('rol');

    const validationShema = Yup.object().shape({
        numero: Yup.number().required("Ingrese el número de la venta"),
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, setValue, watch } = useForm(formOptions);

    const { errors } = formState;

    const [compradores, setCompradores] = useState([]);
    const [autos, setAutos] = useState([]);
    const [autosSeleccionados, setAutosSeleccionados] = useState([]);

    useEffect(() => {
        const fetchResultados = async () => {
            try {
                const response_compradores = await obtener('admin/compradores', token);
                const response_autos = await obtener('admin/autosDisponibles', token);
                //console.log("compradores", response_compradores);
                //console.log("autos", response_autos);
                setCompradores(response_compradores.datos);
                setAutos(response_autos.datos);
            } catch (error) {
                console.error("Error obteniendo información de compradores o autos", error);
            }
        };

        fetchResultados();
    }, [token]);

    const addAutoToTable = (auto) => {
        // Verificar que el auto no esté ya en la lista
        if (!autosSeleccionados.some((selectedAuto) => selectedAuto.external_id === auto.external_id)) {
            setAutosSeleccionados([...autosSeleccionados, auto]);
            // Limpiar el valor del select después de seleccionar un auto
            setValue('auto', null);
        }
    };

    const removeAutoFromTable = (index) => {
        const updatedAutos = [...autosSeleccionados];
        updatedAutos.splice(index, 1);
        setAutosSeleccionados(updatedAutos);
    };
    
    const sendData = (data) => {
        console.log("data", data);
        var dato = {
            "numero": data.numero,
            "empleado": external_user,
            "comprador": data.comprador,
            "autos": autosSeleccionados.map(auto => auto.external_id),
        };
        console.log("dato", dato);

        guardar("admin/venta/guardar", dato, token).then((info) => {
            console.log("info", info);
            if(info.code === 200) {
                mensajes("Venta registrada correctamente", "OK", "sucess");
                router.push("/ventas/propias");
            } else {
                mensajes("Error al agregar la venta!", "Error", "error");
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
            <h1>Registrar Venta</h1>
            <div className='col-4 container-fluid'>
                <form onSubmit={handleSubmit(sendData)}>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Número</label>
                        <input {...register('numero')} name="numero" id="numero" className={`form-control ${errors.numero ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.numero?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Comprador</label>
                        <select {...register('comprador')} className={`form-select ${errors.comprador ? 'is-invalid' : ''}`}>
                            <option value="">Seleccionar Comprador</option>
                            {compradores.map((comprador, i) => (
                                <option key={i} value={comprador.external_id}>{comprador.nombres + " " + comprador.apellidos + " - " + comprador.cedula }</option>
                            ))}
                        </select>
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.comprador?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label>Autos Disponibles:</label>
                        <select
                            {...register('auto')}
                            className={`form-select ${errors.auto ? 'is-invalid' : ''}`}
                        >
                            <option value="">Seleccionar Auto</option>
                            {autos.map((auto) => (
                                <option key={auto.external_id} value={auto.external_id}>
                                    {auto.marca} {auto.modelo} - {auto.color} ({auto.anio})
                                </option>
                            ))}
                        </select>
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.auto?.message}
                        </div>
                        <button type="button" onClick={() => addAutoToTable(autos.find((auto) => auto.external_id === watch('auto')))} className="btn btn-outline-dark btn-sm d-block mx-auto mt-3 px-5">
                            Agregar Auto
                        </button>
                    </div>

                    {/* Tabla de autos seleccionados */}
                    <div className="form-outline form-white mb-4">
                        <label>Autos Seleccionados:</label>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Año</th>
                                    <th>Color</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {autosSeleccionados.map((auto, index) => (
                                    <tr key={auto.external_id}>
                                        <td>{auto.marca}</td>
                                        <td>{auto.modelo}</td>
                                        <td>{auto.anio}</td>
                                        <td>{auto.color}</td>
                                        <td>{auto.precio}</td>
                                        <td>
                                            <button type="button" onClick={() => removeAutoFromTable(index)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Agregar</button>
                        <Link href="/ventas/propias">
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}