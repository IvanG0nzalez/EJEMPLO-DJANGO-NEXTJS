import { enviar} from "./Conexion";
import { save, saveToken } from "./SessionUtil";
export async function inicio_sesion(data) {
    const sesion = await enviar("inicio-sesion", data);
    if (sesion && sesion.code === 200) {
        saveToken(sesion.datos.token);
        save('usuario', sesion.datos.user);
        save('external_id', sesion.datos.external_id);
        save('rol', sesion.datos.rol);
    }
    return sesion;
}
