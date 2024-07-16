"use client";
import { useState, useEffect } from "react";
import { getToken } from "@/hooks/SessionUtil";
import { obtener } from "@/hooks/Conexion";
import Link from "next/link";
const ListaAutosVendidos = () => {
  const [autos, setAutos] = useState([]);

  useEffect(() => {
      const fetchAutos = async () => {
          try {

              const token = getToken();
              const response = await obtener('admin/autosVendidos', token);

              console.log("en listaAutosVendidos",response);
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
                    </tr>
                </thead>
                <tbody>
                    {autos.map((auto, i) => (
                        <tr key={auto.external_id}>
                            <td>{auto.marca}</td>
                            <td>{auto.modelo}</td>
                            <td>{auto.anio}</td>
                            <td>{auto.color}</td>
                            <td>{auto.precio}</td>                            
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
  );
};

export default ListaAutosVendidos;