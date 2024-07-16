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
import { guardar_imagen } from '@/hooks/Conexion';

export default function Page({ params }) {
    const external = params.external;
    const external_user = getExternalUser();
    const token = getToken();
    const rol = get('rol');
    const router = useRouter();

    const validationShema = Yup.object().shape({
        external: Yup.string().required("Ingrese un identificador único para la(s) imagen(es)"),
    });

    const formOptions = { resolver: yupResolver(validationShema) };
    const { register, handleSubmit, formState, setValue } = useForm(formOptions);
    const { errors } = formState;

    const sendData = async (data) => {
        try {
            const formData = new FormData();
            formData.append('auto', external);
            formData.append('external', data.external);

            for (let i = 0; i < data.files.length; i++) {
                formData.append('file', data.files[i]);
            }
            console.log("data", formData);
            const response = await guardar_imagen("admin/autos/file/guardar", formData, token);

            console.log("response", response);
            mensajes("Imagen(es) guardada(s) correctamente", "OK", "success");
            router.push("/autos/disponibles");
        } catch (error) {
            console.error("Error al enviar la(s) imagen(es)", error);
            mensajes("Error al enviar la(s) imagen(es)", "Error", "error");
        }
    }

    const handleFileChange = (event) => {
        setValue('files', event.target.files);
    }

    return (
        <div className="row">
            {rol === 'gerente' ? (
                <Menu_gerente />
            ) : (
                <Menu_vendedor />
            )}
            <h1>Registrar Imagen</h1>
            <div className='col-4 container-fluid'>
                <form onSubmit={handleSubmit(sendData)} encType='multipart/form-data'>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Nombre único</label>
                        <input {...register('external')} name="external" id="external" className={`form-control ${errors.external ? 'is-invalid' : ''}`} />
                        <div className='alert alert-danger invalid-feedback'>
                            {errors.external?.message}
                        </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                        <label className="form-label">Imagen(es)</label>
                        <input type="file" onChange={handleFileChange} multiple className="form-control" />

                    </div>

                    <div className="d-flex gap-4">
                        <button type="submit" className="btn btn-outline-dark btn-lg px-5" id='boton-nuevo-auto'>Agregar</button>
                        <Link href="/autos/disponibles">
                            <button className="btn btn-outline-dark btn-lg px-5">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}