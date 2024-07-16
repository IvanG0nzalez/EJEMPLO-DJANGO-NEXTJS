"use client";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'next/navigation';
import { getExternalUser, getToken, get } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import Link from 'next/link';
import Menu_gerente from '@/componentes/menu_gerente';
import Menu_vendedor from '@/componentes/menu_vendedor';
import { guardar } from '@/hooks/Conexion';

export default function Nuevo() {
    const external_user = getExternalUser();
    const token = getToken();
    const rol = get('rol');
    const router = useRouter();

    const validationShema = Yup.object().shape({
        nombres: Yup.string().required("Ingrese sus nombres"),
        apellidos: Yup.string().required("Ingrese sus apellidos"),
        cedula: Yup.string().required("Ingrese su cedula").length(10, "La cédula debe tener 10 dígitos"),
        direccion: Yup.string().required("Ingrese su dirección"),
        celular: Yup.string().required("Ingrese su celular").length(10, "El celular debe tener 10 dígitos"),
        fecha_nac: Yup.string().required("Ingrese su fecha de nacimiento"),
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const sendData = (data) => {
        console.log("data", data);
        var dato = {
            "nombres": data.nombres,
            "apellidos": data.apellidos,
            "cedula": data.cedula,
            "direccion": data.direccion,
            "celular": data.celular,
            "genero": data.genero,
            "fecha_nac": data.fecha_nac,
        };
        console.log("dato", dato);

        guardar("admin/comprador/guardar", dato, token).then((info) => {
            console.log("info", info);
            mensajes("Comprador registrado correctamente", "OK", "sucess");
            router.push("/compradores");
        });
    }

    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <h1>Registrar Comprador</h1>
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
                        <label className="form-label">Cedula</label>
                        <input {...register('cedula')} name="cedula" id="cedula" className={`form-control ${errors.cedula ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.cedula?.message}
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

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Fecha de Nacimiento</label>
                        <input {...register('fecha_nac')} name="fecha_nac" id="fecha_nac" type="date" className={`form-control ${errors.fecha_nac ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.fecha_nac?.message}
                        </div>
                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Agregar</button>
                        <Link href="/compradores">
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}