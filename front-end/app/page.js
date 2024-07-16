"use client";

import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { inicio_sesion } from '@/hooks/Autenticacion';
import { get, estaSesion } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';

export default function Home() {
  
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    usuario: Yup.string().required("Ingrese su usuario"),
    clave: Yup.string().required("Ingrese su clave")
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  let { errors } = formState;

  const sendData = (data) => {
    var data = {
      "usuario": data.usuario,
      "clave": data.clave,
    };
    //console.log("data en el page: ",data);
    inicio_sesion(data).then((info) => {
      //console.log("en el page", info);
      if (!estaSesion()) {
        mensajes("Error al iniciar sesión!", info.msg, "error");
      } else {
        mensajes("Has ingresado al sistema!", "Bienvenido");
        router.push("/ventas");
      }

    });

  };

  return (
    <div className="">
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ WebkitBorderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <form onSubmit={handleSubmit(sendData)}>
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">
                      Inicio de Sesión
                    </h2>
                    <p className="text-white-50 mb-5">
                      Ingrese su usuario y clave
                    </p>

                    <div className="form-outline form-white mb-4">
                      <input
                        {...register('usuario')} name="usuario" id="usuario"
                        className={`form-control ${errors.usuario ? 'is-invalid' : ''}`} />
                      <label className="form-label">Usuario</label>
                      <div className='alert alert-danger invalid-feedback'>
                        {errors.usuario?.message}
                      </div>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        {...register("clave")}
                        name="clave"
                        type="password"
                        id="clave"
                        className={`form-control ${errors.clave ? "is-invalid" : ""
                          }`}
                      />
                      <label className="form-label">
                        Clave
                      </label>
                      <div className="alert alert-danger invalid-feedback">
                        {errors.clave?.message}
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Acceder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}
