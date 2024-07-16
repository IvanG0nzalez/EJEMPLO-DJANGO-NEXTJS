"use client";
import { useState, useEffect } from "react";
import { getToken } from "@/hooks/SessionUtil";
import { obtener } from "@/hooks/Conexion";
import Link from "next/link";
const ListaCompradores = () => {
  const [compradores, setCompradores] = useState([]);

  useEffect(() => {
      const fetchCompradores = async () => {
          try {

              const token = getToken();
              const response = await obtener('admin/compradores', token);

              console.log("en listaCompradores",response);
              setCompradores(response.datos);
          } catch (error) {
              console.error("Error obteniendo las ventas", error);
          }
      };

      fetchCompradores();
  }, []);

  return (
      <div className="container-fluid">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Nombres</th>
                        <th scope="col">Apellidos</th>
                        <th scope="col">Cédula</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Celular</th>
                        <th scope="col">Genero</th>
                        <th scope="col">Fecha de nacimiento</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {compradores.map((comprador, i) => (
                        <tr key={comprador.external_id}>
                            <td>{comprador.nombres}</td>
                            <td>{comprador.apellidos}</td>
                            <td>{comprador.cedula}</td>
                            <td>{comprador.direccion}</td>
                            <td>{comprador.celular}</td>                            
                            <td>{comprador.genero}</td>
                            <td>{comprador.fecha_nac}</td>
                            <td>
                                <Link href={`/compradores/editar/${comprador.external_id}`} passHref className="btn btn-primary">Modificar</Link>    
                            </td>   
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
  );
};

export default ListaCompradores;