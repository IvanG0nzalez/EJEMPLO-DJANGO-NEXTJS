"use client";
import { useState, useEffect } from "react";
import { get, getToken } from "@/hooks/SessionUtil";
import { obtener_ventas_empleado } from "@/hooks/Conexion";
import Link from "next/link";
const ListaVentasEmpleado = () => {
    const token = getToken();
    const external_id = get('external_id');

  const [ventas, setVentas] = useState([]);

  useEffect(() => {
      const fetchVentas = async () => {
          try {
              const response = await obtener_ventas_empleado('admin/ventas/obtener/e/', token, external_id);

              console.log("en listaVentasEmpleado",response);
              setVentas(response.datos);
          } catch (error) {
              console.error("Error obteniendo las ventas", error);
          }
      };

      fetchVentas();
  }, []);

  return (
      <div className="container-fluid">
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Número</th>
                        <th scope="col">Comprador</th>
                        <th scope="col">Recargo</th>
                        <th scope="col">Total</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta, i) => (
                        <tr key={venta.external_id}>
                            <td>{venta.numero}</td>
                            <td>{venta.comprador.nombres + ' ' + venta.comprador.apellidos ?? "CONSUMIDOR FINAL"}</td>
                            <td>{venta.recargo}</td>
                            <td>{venta.total}</td>   
                            <td>
                                <Link href={`/ventas/editar/${venta.external_id}`} passHref className="btn btn-primary">Modificar</Link>    
                            </td>                         
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
  );
};

export default ListaVentasEmpleado;