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
    const [autos, setAutos] = useState([]);
    const [autosSeleccionados, setAutosSeleccionados] = useState([]);

    useEffect(() => {
        const fetchResultados = async () => {
            //buscar la venta seleccionada
            const response = await obtener('/admin/ventas/obtener/e/' + external_user, token);
            const ventaEncontrada = response.datos.find(venta => venta.external_id === external);
            console.log("ventaEncontrada", ventaEncontrada);

            if (ventaEncontrada) {
                setRespuesta(ventaEncontrada);

                setValue('numero', ventaEncontrada['numero']);
                setValue('recargo', ventaEncontrada['recargo']);
                setValue('total', ventaEncontrada['total']);

                setAutosSeleccionados(ventaEncontrada.auto || []);

                const totalInicial = ventaEncontrada.auto.reduce((total, auto) => total + auto.precio, 0);
                setValue('total', totalInicial);
            }

            const response_autos = await obtener('admin/autosDisponibles', token);
            console.log("autos", response_autos);
            setAutos(response_autos.datos);
        };

        fetchResultados();
    }, [external_user, token, setValue, external]);

    const { register, handleSubmit, formState, setValue, watch } = useForm({
        defaultValues: respuesta,
    });

    const { errors } = formState;

    const addAutoToTable = (auto) => {
        // Verificar que el auto no esté ya en la lista
        if (!autosSeleccionados.some((selectedAuto) => selectedAuto.external_id === auto.external_id)) {
            setAutosSeleccionados([...autosSeleccionados, auto]);
            setValue('auto', null);

            const nuevoRecargoTotal = autosSeleccionados.reduce((totalRecargo, auto) => (auto.recargo || 0) + totalRecargo, 0) + (auto.recargo || 0);
            setValue('recargo', nuevoRecargoTotal);

            const nuevoTotal = parseFloat(watch('total')) + (auto.precio || 0) + (auto.recargo || 0);
            setValue('total', nuevoTotal);
        }
    };

    const removeAutoFromTable = (index) => {
        const removedAuto = autosSeleccionados[index];
        const updatedAutos = [...autosSeleccionados];
        updatedAutos.splice(index, 1);
        setAutosSeleccionados(updatedAutos);

        const nuevoRecargoTotal = updatedAutos.reduce((totalRecargo, auto) => (auto.recargo || 0) + totalRecargo, 0);
        setValue('recargo', nuevoRecargoTotal);

        const nuevoTotal = parseFloat(watch('total')) - (removedAuto.precio || 0) - (removedAuto.recargo || 0);
        setValue('total', nuevoTotal);
    };

    const sendData = (data) => {
        console.log("data", data);
        var dato = {
            "autos": autosSeleccionados.map(auto => auto.external_id),
        };
        console.log("dato", dato);

        modificar('admin/venta/editar/' + external, dato, token).then((datos) => {
            console.log("info", datos);
            if (datos.code === 200) {
                mensajes("Venta modificada correctamente", "OK", "sucess");
                router.push("/ventas/propias");
            } else {
                mensajes("Error al modificar la venta!", "Error", "error");
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
            <h1>Modificar Venta</h1>
            <div className='col-4 container-fluid'>
                <form onSubmit={handleSubmit(sendData)}>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Número</label>
                        <input {...register('numero')} name="numero" id="numero" className={`form-control ${errors.numero ? 'is-invalid' : ''}`} readOnly />
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Total</label>
                        <input {...register('total')} name="total" id="total" className={`form-control ${errors.total ? 'is-invalid' : ''}`} readOnly />
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
                                            <button type="button" onClick={() => removeAutoFromTable(index)} className="btn btn-danger btn-sm d-block mx-auto">
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Guardar</button>
                        <Link href="/ventas/propias">
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}