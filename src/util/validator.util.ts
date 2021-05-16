//import * as Validator from 'validatorjs'; //así no me funcionó
const Validator = require('validatorjs')


//Esta función está pensada para ejecutarse dentro de una PROMESA.
export const validarObjeto = function(objeto, reglas, funcionRechazo){
    Validator.useLang('es');
    let validador = new Validator(objeto, reglas);
    if (validador.fails()) {
        funcionRechazo({
            codigo: 400,
            mensaje: "The data you're trying to introduce are incorrect!"
        })
        return false;
    }
    return true;
}