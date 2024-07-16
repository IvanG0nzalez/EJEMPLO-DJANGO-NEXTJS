"use client";
import { useState, useEffect } from "react";
import { getToken } from "@/hooks/SessionUtil";
import { obtener } from "@/hooks/Conexion";

const ListaVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
    const [anio, setAnio] = useState('');
    const [mes, setMes] = useState('');
    const [filtrado, setFiltrado] = useState(false);


    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const token = getToken();
                const response = await obtener('/admin/empleados', token);
                console.log("response empleados", response);
                setEmpleados(response.datos);
            } catch (error) {
                console.error("Error obteniendo los empleados", error);
            }
        };
        const fetchVentas = async () => {
            try {
                const token = getToken();
                const response = await obtener('/admin/ventas', token);
                console.log("en listaVentas", response);
                setVentas(response.datos);
            } catch (error) {
                console.error("Error obteniendo las ventas", error);
            }
        };

        fetchEmpleados();
        fetchVentas();
    }, []);


    const handleFiltrarVentas = async () => {
        try {

            const token = getToken();
            let url = '/admin/ventas';
            if (empleadoSeleccionado) {
                url += `/obtener/e/${empleadoSeleccionado}`;
                if (anio && mes) {
                    url += `/${anio}/${mes}`;
                }
            } else if (anio && mes) {
                url += `/obtener/${anio}/${mes}`;
            }
            //console.log("empleadoseleccionado", empleadoSeleccionado);
            //console.log("url", url);
            const response = await obtener(url, token);

            //console.log("en listaVentas", response);
            setVentas(response.datos);
            setFiltrado(true); 
        } catch (error) {
            console.error("Error obteniendo las ventas", error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="mb-3 d-flex">
                <select
                    className="form-select me-2"
                    style={{ width: '225px' }} 
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                >
                    <option value="">Todos los empleados</option>
                    {empleados.map((empleado) => (
                        <option key={empleado.external_id} value={empleado.external_id}>
                            {empleado.nombres + ' ' + empleado.apellidos}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Año"
                    className="form-control me-2"
                    style={{ width: '100px' }} 
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Mes"
                    className="form-control me-2"
                    style={{ width: '100px' }} 
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                />

                <button onClick={handleFiltrarVentas} className="btn btn-outline-dark btn-sm">Filtrar</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Número</th>
                        <th scope="col">Comprador</th>
                        <th scope="col">Empleado</th>
                        <th scope="col">Recargo</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filtrado ? (
                        ventas.length > 0 ? (
                            ventas.map((venta, i) => (
                                <tr key={venta.external_id}>
                                    <td>{venta.numero}</td>
                                    <td>{venta.comprador.nombres + ' ' + venta.comprador.apellidos ?? "CONSUMIDOR FINAL"}</td>
                                     <td>{venta.empleado.nombres + ' ' + venta.empleado.apellidos}</td>
                                    <td>{venta.recargo}</td>
                                    <td>{venta.total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5" className="text-center">No se encontraron ventas en la fecha ingresada</td>
                            </tr>
                        ) 
                    ) : (
                        ventas.map((venta, i) => (
                            <tr key={venta.external_id}>
                                <td>{venta.numero}</td>
                                <td>{venta.comprador.nombres + ' ' + venta.comprador.apellidos ?? "CONSUMIDOR FINAL"}</td>
                                <td>{venta.empleado.nombres + ' ' + venta.empleado.apellidos}</td>
                                <td>{venta.recargo}</td>
                                <td>{venta.total}</td>
                            </tr>
                        ))
                    )}

                </tbody>
            </table>
        </div>
    );
};

export default ListaVentas;