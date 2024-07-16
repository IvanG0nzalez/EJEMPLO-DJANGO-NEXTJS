
let URL = "http://localhost:3000/api/";
export function url_api() {
  return URL;
}

export async function enviar(recurso, data) {
  //console.log("data en conexion", data);
  let headers = []
  headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function obtener(recurso, token) {
  const headers = {
    "Content-type": "application/json",
    "token": token,
  }
  const response = await fetch(URL + recurso, {
    method: "GET",
    headers: headers,
    cache: 'no-store'
  });
  const responseData = await response.json();
  return responseData;
}

export async function obtener_ventas_empleado(recurso, token, external_id) {

  const headers = {
    "Content-type": "application/json",
    "token": token,
  }
  const response = await fetch(URL + recurso + external_id, {
    method: "GET",
    headers: headers,
    cache: 'no-store'
  });
  const responseData = await response.json();
  return responseData;
}

export async function guardar(recurso, data, token) {
  const headers = {
    "Content-type": "application/json",
    "token": token,
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
}

export async function guardar_imagen(recurso, data, token) {
  const headers = {
    "token": token,
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: data,
  });
  const responseData = await response.json();
  return responseData;
}

export async function modificar(recurso, data, token) {
  const headers = {
    "Content-type": "application/json",
    "token": token,
  };

  const response = await fetch(URL + recurso, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
}