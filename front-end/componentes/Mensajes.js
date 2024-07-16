import swal from "sweetalert";
//JOption 
const mensajes = (texto, titulo, tipo = 'success',) =>
    swal(titulo, texto, tipo, {
        button: "ACEPTAR", //Modificar el texto del botón
        closeOnEsc: true, //Apretar Esc lo cierra
        closeOnClickOutside: true, //Click fuera del panel lo cierra
        timer: 3000 //Se cierra el JOption en 3 segundos
    }); 

export default mensajes;